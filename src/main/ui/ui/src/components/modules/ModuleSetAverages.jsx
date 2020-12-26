import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import Spinner from "react-bootstrap/Spinner";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import React, {useState} from "react";
import DataSelect from "../ui_components/DataSelect";
import {getCookie} from "react-use-cookie";

const createConfig = (data) => {
    data = data.reverse();
    const xLabels = data.map( e => e.date.split('T')[0]);
    const weights = data.map( e => e.weight);
    const reps = data.map( e => e.reps);

    const today = new Date();
    const end = today.setDate(today.getDate() + 1);
    const start = today.setDate(today.getDate() - 30);

    return {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [{
                label: 'Repetitions',
                yAxisID: 'rep-y-id',
                fill: false,
                borderColor: 'rgba(107,166,239,0.35)',
                backgroundColor: 'rgba(107,166,239,0.35)',
                lineTension: 0,
                data: reps
            }, {
                label: 'Weights',
                yAxisID: 'wei-y-id',
                fill: false,
                borderDash: [5, 3],
                borderColor: 'rgba(107,166,239,0.35)',
                backgroundColor: 'rgba(107,166,239,0.35)',
                lineTension: 0,
                data: weights
            }]
        },
        options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title:{
                display: false,
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
                        max: end
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
                        enabled: false
                    }
                }
            }
        }
    }
}

const ModuleWorkoutDistribution = () => {
    const { data: exercises, loading } = useFetch('/api/exercises');
    const [ chartData, setChartData ] = useState(null);
    const [ message, setMessage ] = useState("Select an exercise to view your progression");

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
        if (data.length > 0) {
            setChartData(createConfig(data));
            setMessage("");
        } else {
            setMessage("No data available for this exercise ");
        }
    }

    return (
        <>
            { loading ? <Spinner animation="grow"/> :
                <>
                    { chartData && message === "" && <Graph data={ chartData } /> }
                    { message !== "" && <p style={ {...messageStyle, fontSize: 'calc(10px + 1vmin)'} }> {message} </p>}
                    <div style={{display: "flex", marginTop: "10px"}}>
                        <DataSelect options={exercises.map(e => e.replace(/_/g, ' '))} onSelect={getExerciseData} style={selectStyle} />
                    </div>
                </>
            }
        </>
    );
}

const messageStyle = {
    textAlign: 'center',
    padding: '16px'
}

const selectStyle = {
    padding: '12px 24px',
    background: '#282c3487',
    color: 'white',
    border: '1px solid #333',
    borderRadius: '10px',
    width: '100vw'
}

export default ModuleWorkoutDistribution;