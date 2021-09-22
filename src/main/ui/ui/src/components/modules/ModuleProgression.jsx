import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import Spinner from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import DataSelect from "../ui_components/DataSelect";
import {getCookie} from "react-use-cookie";
import Switch from '@material-ui/core/Switch';
import DisplayValue from "./DisplayValue";
import regression from 'regression';
import LocalStorage from "../../services/LocalStorage";

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

const createConfig = (data, fullHistory, mergeAxes) => {
    data.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
    });
    const xLabels = data.map( e => e.date.split('T')[0]);
    const weights = data.map( e => e.weight);
    const reps = data.map( e => e.reps);
    const maxCombined = Math.max(...data.map(e => e.combined))
    const combined = data.map(e => Math.round((e.combined / maxCombined) * 100));

    const zip = (a, b) => a.map((k, i, arr) => [getMagicNumberFromDate(k, arr[0]), b[i]]);
    const pts = zip(xLabels, combined);
    const func = regression.polynomial(pts, { order: 2, precision: 100 });

    const plot = getDates(new Date(xLabels[0]), new Date()).map(d => (d.toISOString().split('T')[0])).map((d, i, arr) => ({ x: d, y: func.predict(getMagicNumberFromDate(d, arr[0]))[1] }));

    const today = new Date();
    const end = today.setDate(today.getDate() + 1);
    let start;
    if (fullHistory)
        start = today.setDate(xLabels[0]);
    else
        start = today.setDate(today.getDate() - 30);



    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    xLabels.push(tomorrow.toISOString().split('T')[0]);
    return {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: mergeAxes ? [{
                label: 'Relative effort',
                yAxisID: 'wei-y-id',
                fill: false,
                borderColor: 'rgba(107,166,239,0.35)',
                backgroundColor: 'rgba(107,166,239,0.35)',
                borderWidth: 2,
                lineTension: 0,
                pointRadius: 3,
                showLine: false,
                data: combined
            }, {
                label: 'Trend',
                yAxisID: 'wei-y-id',
                borderDash: [15, 3],
                fill: false,
                borderColor: 'rgb(239,169,107)',
                backgroundColor: 'rgb(239,164,107)',
                borderWidth: 2,
                lineTension: 0,
                //function: function (x) { return func.predict(x)[1]; },
                data: plot
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
                        min: start,
                        max: end,
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
                        enabled: !fullHistory,
                        mode: 'x'
                    },
                    zoom: {
                        enabled: false
                    }
                }
            }
        }
    }
}

const ModuleProgression = () => {
    const { data: exercises, loading } = useFetch('/api/exercises');
    const [ srcData, setSrcData ] = useState(null);
    const [ chartData, setChartData ] = useState(null);
    const [ selectedExercise, setSelectedExercise ] = useState("");
    const [ message, setMessage ] = useState("Select an exercise to view your progression");
    const [ showFullHistory, setShowFullHistory ] = useState(true);
    const [ splitAxes, setSplitAxes ] = useState(false);

    const getExerciseData = async (ex) => {
        const token = getCookie('session_token');
        const response = await fetch( process.env.REACT_APP_API_BASE + `/api/setAverages/${ex.replace(/ /g, '_')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        });

        const data = await response.json();
        setSrcData(data)
    }

    useEffect(() => {
        setSelectedExercise(LocalStorage.get("progression_saved_exercise", null));
    }, [])

    useEffect(() => {
        if (selectedExercise)
            getExerciseData(selectedExercise);
    }, [selectedExercise])


    useEffect(() => {
        if (!srcData)
            setMessage("Select an exercise to view your progression");
        else if (srcData.length > 1) {
            setChartData(createConfig(srcData, showFullHistory, !splitAxes));
            LocalStorage.set("progression_saved_exercise", selectedExercise);
            setMessage("");
        } else if (srcData.length > 0)
            setMessage("Not enough data available for this exercise");
        else
            setMessage("No data available for this exercise");

    }, [showFullHistory, splitAxes, srcData])

    return (
        <>
            { loading ? <Spinner /> :
                <>

                    <div className={'centerC'}>
                        { chartData && message === "" &&
                        <>
                            <div style={{ display: 'flex '}}>
                                <h2 style={{ fontWeight: 'bold', flex: 1, padding: '9px', fontSize: 'calc(10px + 1vmin)'}}>
                                    { camelCase(selectedExercise) }
                                </h2>
                                <div style={{ textAlign: "right", flex: 1}}>
                                    <p style={{ textAlign: "right", margin: '-5px'}} onClick={ () => {
                                        setShowFullHistory(!showFullHistory);
                                    }}>
                                        Fit history
                                        <Switch color="primary" checked={ showFullHistory }/>
                                    </p>
                                    <p style={{ textAlign: "right", margin: '-5px'}} onClick={ () => {
                                        setSplitAxes(!splitAxes);
                                    }}>
                                        Progression curve
                                        <Switch color="primary" checked={ !splitAxes }/>
                                    </p>
                                </div>
                            </div>
                            <div className={'centerC'}>
                                <Graph data={ chartData }/>
                            </div>
                        </>
                        }
                        { message !== "" && <DisplayValue text={ message } value={""}
                                                          style={{textAlign: "center", padding: '32% 0%'}}/> }
                    </div>
                    <DataSelect value={ selectedExercise } onSelect={ (ex) => setSelectedExercise(ex) } options={ exercises.map(e => e.replace(/_/g, ' ')) } />
                    <DataSelect value={ selectedExercise } onSelect={ (ex) => setSelectedExercise(ex) } options={ exercises.map(e => e.replace(/_/g, ' ')) } style={{display: 'none'}}  />
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