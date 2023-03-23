import '../../styles/Module.css';
import React, {useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";


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
    "PUSH": ['rgba(255,204,15,0.8)', 'rgba(255,205,16,0.05)'],
    "PULL": ['rgba(23,121,255,0.8)', 'rgba(16,112,255,0.05)'],
    "BACK": ['rgba(64,200,255,0.8)', 'rgba(64,200,255,0.05)'],
    "LEGS": ['rgba(17,255,121,0.8)', 'rgba(14,255,116,0.05)'],
    "ARMS": ['rgba(22,22,22,0.8)', 'rgba(22,22,22,0.05)'],
    "SHOULDERS": ['rgba(255,14,14,0.8)', 'rgba(255,13,13,0.05)'],
    "CUSTOM": ['rgba(22,22,22,0.8)', 'rgba(22,22,22,0.05)']
}

const createConfig = (setdata) => {

    const data = setdata.map(obj => ({
        label: obj.type,
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