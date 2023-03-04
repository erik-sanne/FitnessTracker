import '../../styles/Module.css';
import React, {useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";


const ModuleExerciseDistribution = () => {
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

    return state &&
                <div style={{height: 'min(65vw, 500px)'}} className={'centerC'}>
                    <Graph data={state.chartdata}/>
                </div>
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
                    type: 'line',
                    label: 'Workouts with exercise',
                    //backgroundColor: 'rgba(72,125,190,0.4)',
                    borderColor: 'rgba(107,166,239,0.5)',
                    borderWidth: 2,
                    data: workouts
                },
                {
                    type: 'bar',
                    label: 'Sets performed',
                    backgroundColor: 'rgba(107,166,239,0.1)',
                    borderColor: 'rgba(107,166,239,0.5)',
                    borderWidth: 2,
                    data: sets
                }
            ]
        },
        options: {
            legend: {
                display: true
            },
            responsive: true,
            aspectRatio: 2.5,
            scales: {
                yAxes: [{
                    stacked: true,
                    display: false,
                    ticks: {
                        stepSize: 1,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }],
                xAxes: [{
                    stacked: true,
                    ticks: {
                        display: window.innerWidth > 600,
                        autoSkip: false,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }]
            },
            elements: {
                point:{
                    radius: 2
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

export default ModuleExerciseDistribution;