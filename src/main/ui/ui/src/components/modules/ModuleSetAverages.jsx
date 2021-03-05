import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import Spinner from "react-bootstrap/Spinner";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import DataSelect from "../ui_components/DataSelect";
import {getCookie} from "react-use-cookie";
import Switch from '@material-ui/core/Switch';

const createConfig = (data, fullHistory) => {
    data = data.reverse();
    const xLabels = data.map( e => e.date.split('T')[0]);
    const weights = data.map( e => e.weight);
    const reps = data.map( e => e.reps);

    const today = new Date();
    const end = today.setDate(today.getDate() + 1);
    let start;
    if (fullHistory)
        start = today.setDate(xLabels[0]);
    else
        start = today.setDate(today.getDate() - 30);

    return {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [{
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
                    display: true,
                    position: "left",
                    id: "rep-y-id",
                    ticks: {
                        display: false
                    }
                }, {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "wei-y-id",
                    ticks: {
                        display: false
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

const ModuleWorkoutDistribution = () => {
    const { data: exercises, loading } = useFetch('/api/exercises');
    const [ srcData, setSrcData ] = useState(null);
    const [ chartData, setChartData ] = useState(null);
    const [ selectedExercise, setSelectedExercise ] = useState(null);
    const [ message, setMessage ] = useState("Select an exercise to view your progression");
    const [ showFullHistory, setShowFullHistory ] = useState(true);

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
        if (selectedExercise)
            getExerciseData(selectedExercise);
    }, [selectedExercise])

    useEffect(() => {
        if (!srcData)
            setMessage("Select an exercise to view your progression");
        else if (srcData.length > 1) {
            setChartData(createConfig(srcData, showFullHistory));
            setMessage("");
        } else if (srcData.length > 0)
            setMessage("Not enough data available for this exercise");
        else
            setMessage("No data available for this exercise");

    }, [showFullHistory, srcData])

    return (
        <>
            { loading ? <Spinner animation="grow"/> :
                <>
                    { chartData && message === "" &&
                    <>
                        <div style={{ display: 'flex '}}>
                            <h2 style={{ fontWeight: 'bold', flex: 1, padding: '9px', fontSize: 'calc(10px + 1vmin)'}}>
                                { camelCase(selectedExercise) }
                            </h2>
                            <p style={{ textAlign: "right", flex: 1}}>
                                Show full history
                                <Switch color="primary" checked={showFullHistory} onChange={ (event) => setShowFullHistory(event.target.checked)}/>
                            </p>
                        </div>
                        <Graph data={ chartData }/>
                    </>
                    }
                    { message !== "" && <p style={ {...messageStyle, fontSize: 'calc(10px + 1vmin)'} }> {message} </p>}
                    <div style={{display: "flex", marginTop: "10px"}}>
                        <DataSelect options={exercises.map(e => e.replace(/_/g, ' '))} onSelect={ (ex) => setSelectedExercise(ex) } style={selectStyle} />
                    </div>
                </>
            }
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const messageStyle = {
    textAlign: 'center',
    padding: '32px',
    margin: '0px'
}

const selectStyle = {
    width: '100vw'
}

export default ModuleWorkoutDistribution;