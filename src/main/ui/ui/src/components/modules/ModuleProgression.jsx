import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import {getCookie} from "react-use-cookie";
import DisplayValue from "./DisplayValue";
import regression from 'regression';
import LocalStorage from "../../services/LocalStorage";
import Loader from "../ui_components/Loader";
import SwiperWrapper from "../ui_components/swiper/SwiperWrapper";
import {SwiperSlide} from "swiper/react";
import Select from "react-select";
import Slider from "@material-ui/core/Slider";

const getDates = (startDate, stopDate) => {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate.setDate(currentDate.getDate()+1)
    }
    return dateArray;
}

const getMagicNumberFromDate = (date, firstDate) => {
    return Math.round((new Date(date).getTime() - new Date(firstDate).getTime())  / (1000 * 60 * 60 * 24))
}

const getPolyfitLinePlot = (xLabels, pts) => {
    /** Outlier removal **/
    const funcPre = regression.polynomial(pts, { order: 2, precision: 100 });
    let errors = pts.map(point => {
        let x = point[0];
        let y = point[1];
        let y_pred = funcPre.predict(x)[1];
        let mse = Math.abs(Math.pow(y_pred, 2) - Math.pow(y, 2));
        return { x: x, mse: mse };
    });
    let n_elem_to_remove = errors.length * 0.2;
    for (let i = 0; i < n_elem_to_remove; i++) {
        let largest = { mse: -1 };
        errors.forEach(e => {
            if (e.mse > largest.mse) {
                largest = e;
            }
        });
        errors = errors.filter(e => e !== largest);
    }
    const x_to_keep = errors.map(e => e.x);
    pts = pts.filter(e => x_to_keep.includes(e[0]));
    /** Done: Outlier removal **/
    const func = regression.polynomial(pts, { order: 2, precision: 100 });


    return getDates(new Date(xLabels[0]), new Date()).map(d => (d.toISOString().split('T')[0])).map((d, i, arr) => ({ x: d, y: Math.max(func.predict(getMagicNumberFromDate(d, arr[0]))[1], 0) }));
}

const createInterpolation = (x, _reps, _weights, interpolation) => {
    let weights = [];
    let reps = [];

    // Interpolation
    const interpol = interpolation-1;
    for (let i = 0; i < x.length; i++) {
        let w = 0, r = 0;
        let pts = 0;
        let lb = new Date(x[i]); lb.setDate(lb.getDate() - 10*interpol);
        let ub = new Date(x[i]); ub.setDate(lb.getDate() + 10*interpol);
        if (_weights[i] === null && _reps[i] === null) {
            weights.push(null);
            reps.push(null);
        } else {
            for (let j = 0; j < x.length; j++) {
                const sampleDate = new Date(x[j]);
                if (sampleDate >= lb && sampleDate <= ub) {
                    if (_weights[j] === null && _reps[j] === null) {
                        continue;
                    }
                    w += _weights[j];
                    r += _reps[j];
                    pts++;
                }
            }
            weights.push(w/pts);
            reps.push(r/pts);
        }
    }

    return { reps, weights }
}

const createProgression = (x, progressionValues) => {
    const maxCombined = Math.max(...progressionValues)

    const progressionPoints = progressionValues.map(val => val ? Math.round((val / maxCombined) * 100) : null);
    const _pts_filtered = progressionPoints.filter(v => v !== null);
    const zip = (a, b) => a.map((k, i, arr) => [getMagicNumberFromDate(k, arr[0]), b[i]]);
    const ptsComb = zip(x, _pts_filtered)

    const plottedLine = getPolyfitLinePlot(x, ptsComb);
    return { progressionPoints, plottedLine };
}

const calculateValues = (allXValues, data, interpolation) => {
    const xLabels = data.map( e => e.date.split('T')[0]);
    const _weights = [];
    const _reps = [];
    const _combined = [];

    for (let i = 0; i < allXValues.length; i++) {
        let x = -1;
        for (let j = 0; j < xLabels.length; j++) {
            if (allXValues[i] === xLabels[j]) {
                x = j;
                break;
            }
        }

        if (x === -1) {
            _weights.push(null)
            _reps.push(null)
            _combined.push(null)
        } else {
            _weights.push(data[x].weight)
            _reps.push(data[x].reps)
            _combined.push(data[x].combined) 
        }

    }

    const { reps, weights } = createInterpolation(allXValues, _reps, _weights, interpolation);
    const { progressionPoints, plottedLine } = createProgression(xLabels, _combined);
    return { reps, weights, progressionPoints, plottedLine }
}

const splitBodyweightOnly = (data) => {
    const bodyweight = data.filter( e => e.weight === 0);
    const weighted = data.filter( e => e.weight !== 0);
    return { bodyweight, weighted }
}

const createConfig = (data, mergeAxes, interpolation=1) => {
    data.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
    });
    const datasetsProgression = [];
    const datasets = [];

    const x = data.map( e => e.date.split('T')[0]);
    const { bodyweight, weighted } = splitBodyweightOnly(data);

    if (weighted && weighted.length > 0) {
        const { reps, weights, progressionPoints, plottedLine } = calculateValues(x, weighted, interpolation);
        datasetsProgression.push(...[{
            label: 'Volume / max',
            yAxisID: 'right_axis',
            fill: false,
            borderColor: 'rgba(107,166,239,0.35)',
            backgroundColor: 'rgba(107,166,239,0.35)',
            borderWidth: 2,
            lineTension: 0,
            pointRadius: 4,
            pointHoverRadius: 8,
            showLine: false,
            data: progressionPoints
        }, {
            label: 'Total Progression',
            yAxisID: 'right_axis',
            borderDash: [15, 3],
            fill: false,
            borderColor: 'rgb(239,169,107)',
            backgroundColor: 'rgb(239,164,107)',
            borderWidth: 1,
            pointHoverRadius: 0,
            lineTension: 0,
            data: plottedLine
        }])

        datasets.push(...[{
            label: 'Repetitions',
            yAxisID: 'left_axis',
            fill: false,
            borderDash: [15, 3],
            borderColor: 'rgba(107,166,239,0.35)',
            backgroundColor: 'rgba(107,166,239,0.35)',
            borderWidth: 2,
            lineTension: 0,
            data: reps
        }, {
            label: 'Weight',
            yAxisID: 'right_axis',
            fill: false,
            borderColor: 'rgba(107,166,239,0.5)',
            backgroundColor: 'rgba(107,166,239,0.35)',
            borderWidth: 2,
            lineTension: 0,
            data: weights
        }])
    }

    if (bodyweight && bodyweight.length > 0) {
        const { reps, weights, progressionPoints, plottedLine } = calculateValues(x, bodyweight, interpolation);
        if (weights) { weights.push(null) } // ESLint workaround

        datasetsProgression.push(...[{
            label: 'Volume / max (BW)',
            yAxisID: 'right_axis',
            fill: false,
            borderColor: 'rgba(239, 115, 107, 0.35)',
            backgroundColor: 'rgba(239, 115, 107, 0.35)',
            borderWidth: 2,
            lineTension: 0,
            pointRadius: 4,
            pointHoverRadius: 8,
            showLine: false,
            data: progressionPoints
        }, {
            label: 'Total Progression (BW)',
            yAxisID: 'right_axis',
            borderDash: [15, 3],
            fill: false,
            borderColor: 'rgb(239, 107, 131, 0.3)',
            backgroundColor: 'rgb(239, 107, 131, 0.3)',
            borderWidth: 1,
            pointHoverRadius: 0,
            lineTension: 0,
            data: plottedLine
        }])

        datasets.push(...[{
            label: 'Repetitions (BW)',
            yAxisID: 'left_axis',
            fill: false,
            borderDash: [15, 3],
            borderColor: 'rgba(239, 115, 107, 0.35)',
            backgroundColor: 'rgba(239, 115, 107, 0.35)',
            borderWidth: 2,
            lineTension: 0,
            data: reps
        }])
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    x.push(tomorrow.toISOString().split('T')[0]);
    return {
        type: 'line',
        data: {
            labels: x,
            datasets: mergeAxes ? datasetsProgression : datasets
        },
        options: {
            responsive: true,
            aspectRatio: window.innerWidth < 600 && mergeAxes ? 1 : window.innerWidth > 1500 ? 2.5 : 1.2,
            hoverMode: 'index',
            stacked: false,
            spanGaps: true,
            title:{
                display: false,
            },
            layout: {
                padding: {
                    left: -9,
                    right: window.innerWidth < 600 ? -10 : 0
                }
            },
            legend: {
                align: "end",
                labels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            scales: {
                yAxes: [{
                    type: "linear",
                    display: !mergeAxes,
                    position: "left",
                    id: "left_axis",
                    ticks: {
                        mirror: window.innerWidth < 600,
                        suggestedMin: 0,
                        callback: function(value, index, values) {
                            return value;
                        },
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }, {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "right_axis",
                    ticks: {
                        mirror: window.innerWidth < 600,
                        suggestedMin: 0,
                        max: 100,
                        callback: function(value, index, values) {
                            return value + (mergeAxes ? '%' : 'kg');
                        },
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    ticks: {
                        maxRotation: window.innerWidth < 600 ? 0 : 50,
                        labelOffset: window.innerWidth < 600 ? 20 : 0,
                        maxTicksLimit: window.innerWidth < 600 ? 5 : 0,
                        fontSize: 12,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    },
                    afterFit: (axis) => {
                        axis.paddingRight = window.innerWidth < 600 ? -10 : 0;
                        axis.paddingLeft = window.innerWidth < 600 ? -10 : 30;
                    }
                }]
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            tooltips: {
                mode: 'nearest',
                filter: function (tooltipItem) {
                    return tooltipItem.datasetIndex === 0 || tooltipItem.datasetIndex === 2;
                },
                callbacks: {
                    footer: function (context) {
                        let pointInfo = context[0];
                        if (!pointInfo || pointInfo.datasetIndex !== 0 && pointInfo.datasetIndex !== 2)
                            return '';


                        return data[pointInfo.index].sets.map(({id, reps, weight}, index) => `Set ${index + 1}: ${reps} × ${weight > 0 ? weight + 'kg' : 'bw'}`);
                    },
                    label: function (context) {
                        let label = context.yLabel || '';
                        if (label === 100)
                            return " Best workout to date"
                        return " " + label + "% relative to best workout";
                    }
                }
            }
        }
    }
}

const ModuleProgression = () => {
    const { data: exercises, loading: loadingExercises } = useFetch('/api/exercises');
    const [ rawData, setRawData ] = useState([]);
    const [ chartData, setChartData ] = useState(null);
    const [ selectedExercise, setSelectedExercise ] = useState(null);
    const [ message, setMessage ] = useState("Select an exercise to view your progression");
    const [ loading, setLoading ] = useState(false);
    const [ interpolation, setInterpolation ] = useState(10);

    const getExerciseData = async (ex) => {
        setLoading(true);
        const token = getCookie('session_token');
        const response = await fetch(process.env.REACT_APP_API_BASE + `/api/setAverages/${ex}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        });

        const data = await response.json();
        setLoading(false);
        setRawData(data)
    }

    useEffect(() => {
        const stored = LocalStorage.get("progression_saved_exercise", null);
        if (stored && typeof stored !== 'string' && 'value' in stored)
            setSelectedExercise(stored);
    }, [])

    useEffect(() => {
        if (selectedExercise)
            getExerciseData(selectedExercise.value).then(_ => _);
    }, [selectedExercise])

    useEffect(() => {
        setChartData({
            data1: createConfig(rawData, true, interpolation),
            data2: createConfig(rawData, false, interpolation)
        })

        if (rawData.length > 1) {
            setMessage("");
            LocalStorage.set("progression_saved_exercise", selectedExercise)
        } else if (rawData.length > 0) {
            setMessage("Not enough data available for this exercise");
        } else
            setMessage("No data available for this exercise");
    }, [interpolation, rawData])

    return (
        <>
            { loadingExercises ? <Loader /> :
                <>
                    <div className={'centerC'}>
                        { !loading && chartData && message === "" &&
                        <>
                            <div className={'centerC'}>
                                <SwiperWrapper>
                                    <SwiperSlide>
                                        <div style={{width: '100%'}}>
                                            <Graph data={ chartData.data1 } style={{ marginTop: 0 }}/>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div style={{ width: '100%'}}>
                                            <Graph data={ chartData.data2 }/>
                                            <Slider
                                                style={{ margin: '0 auto 1em auto', width: '80%' }}
                                                value={ interpolation }
                                                onChange={(event, val) => { event.stopPropagation(); setInterpolation(val) }}
                                                valueLabelDisplay="auto"
                                                min={1}
                                                max={10}
                                            />
                                        </div>
                                    </SwiperSlide>
                                </SwiperWrapper>
                            </div>
                        </>
                        }
                        { loading && <div style={{textAlign: "center", padding: '10% 0%'}}> <Loader /> </div> }
                        { !loading && message !== "" && <DisplayValue text={ message } value={""}
                                                          style={{textAlign: "center", padding: '10% 0%'}}/> }


                    </div>

                    <Select
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        defaultValue={ selectedExercise }
                        onChange={ setSelectedExercise }
                        options={ exercises.map(e =>{ return {value: e, label: camelCase(e.replace(/_/g, ' '))}}) }
                        menuPlacement={"top"}
                        className="select-container"
                        classNamePrefix="select" />
                </>
            }
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default ModuleProgression;