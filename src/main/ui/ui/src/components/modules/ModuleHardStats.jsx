import '../../styles/Module.css';
import React, {useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Module from "./Module";
import Graph from "./Graph";


const ModuleHardStats = () => {
    const { data, loading } = useFetch('/api/stats');
    const [ state, setState ] = useState(null);

    if (loading)
        return <Loader />

    if (!state) {
        const setdata = Object.keys(data.setTypes).map(key => {
            return {exercise: key, sets: data.setTypes[key], workouts: data.setWorkouts[key]}
        });

        const chartdata = createConfig(setdata);

        setState({
            setdata: setdata,
            chartdata: chartdata
        })
    }

    return state && <Module title={ "fallback_coverstatistics" } style={{ gridRow: '2' }}>
                <div style={{height: 'min(65vw, 500px)'}} className={'centerC'}>
                    <p> You registered your first workout on {data.firstWorkout.split("T")[0]}. Since then you've achieved the following:</p>
                    <span>Total number of registered workouts: <b>{data.workouts}</b></span>
                    <p>Total number of registered sets: <b>{data.sets}</b></p>
                    <span>Exercises:</span>
                    <div style={{ paddingLeft: '1rem', maxHeight: '14em', overflowY: 'auto' }}>
                        {
                            state.setdata
                                .sort((a, b) => a.exercise.localeCompare(b.exercise))
                                .map(({exercise, sets, workouts}) => sets !== 0 &&
                                    <>
                                        <span key={exercise}>
                                            <b>{ format(exercise) }:</b> <b>{workouts}</b> workouts (<b>{sets}</b> sets)
                                        </span> <br/>
                                    </>)
                        }
                    </div>
                    <Graph data={state.chartdata}/>
                </div>
            </Module>
}

const createConfig = (setdata={}) => {

    const data = setdata.sort((a, b) => (b.workouts + b.sets) - (a.workouts + a.sets))

    let workouts = data.map(e => e.workouts)
    let sets = data.map(e => e.sets)
    let xLabels = data.map(e => format(e.exercise))

    return {
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Workouts with exercise',
                    backgroundColor: 'rgba(72,125,190,0.4)',
                    borderColor: 'rgb(61,111,169)',
                    borderWidth: 1,
                    data: workouts
                },
                {
                    label: 'Sets performed',
                    backgroundColor: 'rgba(107,166,239,0.4)',
                    borderColor: 'rgb(61,111,169)',
                    borderWidth: 1,
                    data: sets
                }
            ]
        },
        options: {
            legend: {
                display: false
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 1.5,
            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        stepSize: 1,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }],
                xAxes: [{
                    stacked: true,
                    ticks: {
                        autoSkip: false,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }]
            },
            elements: {
                point:{
                    radius: 0
                }
            }
        }
    }
}

const format = (text) => {
    text = text.replaceAll("_", " ")
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default ModuleHardStats;