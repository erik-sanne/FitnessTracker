import '../../styles/Module.css';
import React, {useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import Utils from "../../services/Utils";


const ModuleSplitRatios = () => {
    const { data, loading } = useFetch('/api/workouts');
    const [ state, setState ] = useState(null);

    if (loading)
        return <Loader />

    if (!state && data) {

        const tmp = new Date(data[data.length - 1].date)
        const firstDate = new Date(tmp.getFullYear(), tmp.getMonth(), 1);

        let types = []
        data.forEach((w) => {
            if (!types.includes(w.description))
                types.push(w.description)
        })

        const setdata = types.map(type => ({ type: type, values: doStuff(new Date(firstDate), data.filter(w => w.description === type))}))

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

const doStuff = (date, workouts) => {
    const today = new Date();
    const MILLIS_SCAN = 1000 * 60 * 60 * 24 * 30;

    const values = [];
    const dates = [];

    while (date.getTime() <= today.getTime()) {
        const y = workouts.filter((workout) => {
            const workoutDate = new Date(workout.date.split("T")[0]);
            const diff = Math.abs(workoutDate.getTime() - date.getTime());
            return diff < MILLIS_SCAN
        })

        dates.push(new Date(date))
        values.push(y.length)

        if (date.getDate() === 1) {
            date = new Date(date.setDate(date.getMonth() === 1 ? 14 : 15))
        } else {
            date = new Date(date.setMonth(date.getMonth() + 1));
            date = new Date(date.getFullYear(), date.getMonth(), 1)
        }
    }
    return [dates, values];
}

const colors = {
    "PUSH": ['rgb(188,167,79)', 'rgba(188,167,79, 0.1)'],
    "PULL": ['rgb(68,82,179)', 'rgba(68,82,179, 0.1)'],
    "BACK": ['rgb(80,144,179)', 'rgba(80,144,179, 0.1)'],
    "LEGS": ['rgb(61,179,114)', 'rgba(61,179,114, 0.1)'],
    "ARMS": ['rgb(141,57,167)', 'rgba(141,57,167, 0.1)'],
    "SHOULDERS": ['rgb(177,60,60)', 'rgba(177,60,60, 0.1)'],
    "CUSTOM": ['rgb(78,78,78)', 'rgba(78,78,78, 0.1)']
}

const createConfig = (setdata) => {

    const data = setdata.map(obj => ({
        label: Utils.camelCase(obj.type),
        borderWidth: 2,
        borderColor: colors[obj.type][0],
        backgroundColor: colors[obj.type][1],
        data: obj.values[1],
        lineTension: 0,
    }))

    return {
        type: 'line',
        data: {
            labels: setdata[0].values[0],
            datasets: data
        },
        options: {
            legend: {
                display: true
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5,
            scales: {
                yAxes: [{
                    stacked: true,
                    display: false,
                    ticks: {
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold',
                    }
                }],
                xAxes: [{
                    type: 'time',
                    stacked: true,
                    time: {
                        unit: 'month'
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
            }
        }
    }
}

export default ModuleSplitRatios;