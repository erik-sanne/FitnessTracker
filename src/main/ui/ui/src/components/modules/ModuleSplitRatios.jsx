import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import Utils from "../../services/Utils";


const ModuleSplitRatios = () => {
    const { data, loading } = useFetch('/api/workouts');
    const [ state, setState ] = useState(null);
    const [ ctx, setCtx ] = useState(null);

    useEffect(() => {
        if (!data)
            return
        const tmp = new Date(data[data.length - 1].date)
        const firstDate = new Date(tmp.getFullYear(), tmp.getMonth(), 1);

        let types = []
        data.forEach((w) => {
            if (!types.includes(w.description))
                types.push(w.description)
        })

        const setdata = types.map(type => ({ type: type, values: doStuff(new Date(firstDate), data.filter(w => w.description === type))}))

        const chartdata = createConfig(setdata, ctx);

        setState({
            setdata: setdata,
            chartdata: chartdata
        })
    }, [data, ctx])


    if (loading)
        return <Loader />

    return state &&
                <div style={{ width: '100%', marginBottom: '2em' }}>
                    <Graph data={state.chartdata} callback={ chart => setCtx(chart.getContext('2d'))}/>
                </div>
}

const doStuff = (date, workouts) => {
    const today = new Date();
    const MILLIS_SCAN = 1000 * 60 * 60 * 24 * 45; // 45+45=~3 months

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
            date = new Date(date.setDate(7))
        } else if (date.getDate() === 7) {
            date = new Date(date.setDate(date.getMonth() === 1 ? 14 : 15))
        } else if (date.getDate() === 14 || date.getDate() === 15) {
            date = new Date(date.setDate(21))
        } else {
            date = new Date(date.setMonth(date.getMonth() + 1));
            date = new Date(date.getFullYear(), date.getMonth(), 1)
        }
    }
    return [dates, values];
}

const colors = {
    "PUSH": ['rgb(255,217,57)', 'rgb(236,198,35, 0.8)', 'rgba(236,192,1,0)'],
    "PULL": ['rgb(45,104,255)', 'rgb(22,81,231, 0.8)', 'rgba(0,65,233,0)'],
    "BACK": ['rgb(59,191,255)', 'rgb(35,171,238, 0.8)', 'rgba(0,157,233,0)'],
    "LEGS": ['rgb(74,255,157)', 'rgb(31,238,125, 0.8)', 'rgba(0,236,109,0)'],
    "ARMS": ['rgb(212,70,255)', 'rgb(188,30,236, 0.8)', 'rgba(182,0,236,0)'],
    "SHOULDERS": ['rgb(255,68,68)', 'rgb(239,35,35, 0.8)', 'rgba(238,0,0,0)'],
    "CUSTOM": ['rgb(78,78,78)', 'rgba(52,52,52,0.8)', 'rgb(78,78,78, 0)']
}

const asGradient = (ctx, [_, start, stop]) => {
    if (!ctx)
        return stop;

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, start);
    gradient.addColorStop(0.8, stop);
    return gradient;
}

const createConfig = (setdata, ctx) => {

    const data = setdata.map(obj => ({
        label: Utils.camelCase(obj.type),
        borderWidth: 2,
        borderColor: colors[obj.type][0],
        backgroundColor: asGradient(ctx, colors[obj.type]),
        data: obj.values[1],
        lineTension: 0,
        pointStyle: 'circle'
    }))

    return {
        type: 'line',
        data: {
            labels: setdata[0].values[0],
            datasets: data
        },
        options: {
            legend: {
                display: true,
                position: "chartArea",
                align: "center",
                labels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            tooltips: {
                mode: 'index'
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
                        fontStyle: 'bold',
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