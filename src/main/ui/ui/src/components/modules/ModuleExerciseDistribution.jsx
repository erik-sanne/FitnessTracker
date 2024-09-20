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

    if (!state && data) {
        const setdata = Object.keys(data.setTypes).map(key => {
            return {exercise: key, sets: data.setTypes[key], workouts: data.setWorkouts[key]}
        });

        const chartdata = createConfig(setdata);

        setState({
            setdata: setdata,
            chartdata: chartdata
        })
    }

    return state && <Graph data={state.chartdata}/>
}

const createConfig = (setdata={}) => {

    const data = setdata.sort((a, b) => (b.sets) - (a.sets))

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
                    label: 'Workouts by exercise',
                    //backgroundColor: 'rgba(72,125,190,0.4)',
                    borderColor: 'rgba(107,166,239,0.5)',
                    borderWidth: 2,
                    data: workouts
                },
                {
                    type: 'bar',
                    label: 'Sets performed by exercise',
                    backgroundColor: 'rgba(107,166,239,0.1)',
                    borderColor: 'rgba(107,166,239,0.5)',
                    borderWidth: 2,
                    data: sets
                }
            ]
        },
        options: {
            responsive:true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5,
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
                y: {
                    stacked: true,
                    display: false,
                    ticks: {
                        font: {
                            stepSize: 1,
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    stacked: true,
                    ticks: {
                        display: window.innerWidth > 800,
                        autoSkip: false,
                        font: {
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                }
            },
            elements: {
                point:{
                    radius: 2
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
                        textAlign: "right",
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                     multiKeyBackground: "rgba(0,0,0,0)",
                     usePointStyle: true
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