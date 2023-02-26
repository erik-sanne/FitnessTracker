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

const createConfig = (data, mergeAxes) => {
    data.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
    });
    const xLabels = data.map( e => e.date.split('T')[0]);
    const weights = data.map( e => e.weight);
    const reps = data.map( e => e.reps);
    const maxCombined = Math.max(...data.map(e => e.combined))
    const maxWeight = Math.max(...data.map(e => e.weight))
    const combined = data.map(e => Math.round((e.combined / maxCombined) * 100));
    const weightScaled = data.map(e => Math.round((e.weight / maxWeight) * 100));

    const zip = (a, b) => a.map((k, i, arr) => [getMagicNumberFromDate(k, arr[0]), b[i]]);
    const ptsComb = zip(xLabels, combined);
    const ptsWeight = zip(xLabels, weightScaled);
    const progressionPts = getPolyfitLinePlot(xLabels, ptsComb);
    const weightProgPts = getPolyfitLinePlot(xLabels, ptsWeight);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    xLabels.push(tomorrow.toISOString().split('T')[0]);
    return {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: mergeAxes ? [{
                label: 'Volume / max',
                yAxisID: 'wei-y-id',
                fill: false,
                borderColor: 'rgba(107,166,239,0.35)',
                backgroundColor: 'rgba(107,166,239,0.35)',
                borderWidth: 2,
                lineTension: 0,
                pointRadius: 4,
                pointHoverRadius: 8,
                showLine: false,
                data: combined
            }, {
                label: 'Total Progression',
                yAxisID: 'wei-y-id',
                borderDash: [15, 3],
                fill: false,
                borderColor: 'rgb(239,169,107)',
                backgroundColor: 'rgb(239,164,107)',
                borderWidth: 1,
                pointHoverRadius: 0,
                lineTension: 0,
                //function: function (x) { return func.predict(x)[1]; },
                data: progressionPts
            }, {
                label: 'Weight progression',
                yAxisID: 'wei-y-id',
                borderDash: [15, 3],
                fill: false,
                borderColor: 'rgb(159,102,53)',
                backgroundColor: 'rgb(152,97,55)',
                borderWidth: 1,
                pointHoverRadius: 0,
                lineTension: 0,
                hidden: true,
                //function: function (x) { return func.predict(x)[1]; },
                data: weightProgPts
            }] : [{
                label: 'Repetitions',
                yAxisID: 'rep-y-id',
                fill: false,
                borderDash: [15, 3],
                borderColor: 'rgba(107,166,239,0.35)',
                backgroundColor: 'rgba(107,166,239,0.35)',
                borderWidth: 2,
                lineTension: 0,
                data: reps
            }, {
                label: 'Weights',
                yAxisID: 'wei-y-id',
                fill: false,
                borderColor: 'rgba(107,166,239,0.5)',
                backgroundColor: 'rgba(107,166,239,0.35)',
                borderWidth: 2,
                lineTension: 0,
                data: weights
            }]
        },
        options: {
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 1.5,
            hoverMode: 'index',
            stacked: false,
            title:{
                display: false,
            },
            legend: {
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
                    id: "rep-y-id",
                    ticks: {
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
                    id: "wei-y-id",
                    ticks: {
                        suggestedMin: 0,
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
                        fontSize: 12,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }]
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        enabled: true,
                        mode: 'x'
                    }
                }
            },
            tooltips: {
                mode: 'nearest',
                filter: function (tooltipItem) {
                    return tooltipItem.datasetIndex === 0;
                },
                callbacks: {
                    footer: function (context) {
                        let pointInfo = context[0];
                        if (!pointInfo || pointInfo.datasetIndex !== 0)
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
    const [ chartData, setChartData ] = useState(null);
    const [ selectedExercise, setSelectedExercise ] = useState(null);
    const [ message, setMessage ] = useState("Select an exercise to view your progression");
    const [ loading, setLoading ] = useState(false);

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
        setChartData({
            data1: createConfig(data, true),
            data2: createConfig(data, false)
        })

        if (data.length > 1) {
            setMessage("");
            LocalStorage.set("progression_saved_exercise", selectedExercise)
        } else if (data.length > 0) {
            setMessage("Not enough data available for this exercise");
        } else
            setMessage("No data available for this exercise");
    }

    useEffect(() => {
        const stored = LocalStorage.get("progression_saved_exercise", null);
        if (typeof stored !== 'string' && 'value' in stored)
            setSelectedExercise(stored);
    }, [])

    useEffect(() => {
        if (selectedExercise)
            getExerciseData(selectedExercise.value).then(_ => _);
    }, [selectedExercise])


    return (
        <>
            { loadingExercises ? <Loader /> :
                <>
                    <div className={'centerC'}>
                        { !loading && chartData && message === "" &&
                        <>
                            <div style={{ display: 'flex '}}>
                                <h2 style={{ fontWeight: 'bold', flex: 1, padding: '9px', fontSize: 'calc(10px + 1vmin)'}}>
                                    { camelCase(selectedExercise.label) }
                                </h2>
                            </div>
                            <div className={'centerC'}>
                                <SwiperWrapper>
                                    <SwiperSlide>
                                        <div style={{width: '100%'}} className={'no-swipe'}>
                                            <Graph data={ chartData.data1 }/>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div style={{ width: '100%'}} className={'no-swipe'}>
                                            <Graph data={ chartData.data2 }/>
                                        </div>
                                    </SwiperSlide>
                                </SwiperWrapper>
                            </div>
                        </>
                        }
                        { loading && <div style={{textAlign: "center", padding: '32% 0%'}}> <Loader /> </div> }
                        { !loading && message !== "" && <DisplayValue text={ message } value={""}
                                                          style={{textAlign: "center", padding: '32% 0%'}}/> }


                    </div>

                    <Select
                        defaultValue={ selectedExercise }
                        onChange={ setSelectedExercise }
                        options={ exercises.map(e =>{ return {value: e, label: camelCase(e.replace(/_/g, ' '))}}) }
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