import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import ContentPlaceholder from "../ui_components/ContentPlaceholder";
import Loader from "../ui_components/Loader";
import {Switch} from "@mui/material";
import get from "../../services/Get";
import Graph from "./Graph";
import Utils from "../../services/Utils";

const MILLIS_SCAN = 1000 * 60 * 60 * 24 * 45; // 45+45=~3 months

const ModuleSplitRatios = () => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading] = useState(true);
    const [ groupPPL, setGroupPPL ] = useState(false);
    const [ state, setState ] = useState(null);
    const [ ctx, setCtx ] = useState(null);

    const reFetch = (group) => {
        setLoading(true);
        get(`/api/workouts?group-ppl=${group}`).then((value) => {
            setData(value)
            setLoading(false);
        });
    }

    useEffect(() => {
        reFetch(groupPPL);
    }, [groupPPL])

    useEffect(() => {
        if (!data || data.length == 0)
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
        return <ContentPlaceholder> <Loader /> </ContentPlaceholder>

    return state && <div>
            <p style={{ position: 'absolute', right: '0px', fontSize: '0.8rem', color: '#aaa', margin: '0' }}>
                <span>
                    Group by PPL
                </span>
                <Switch
                  checked={ groupPPL }
                  onChange={ () => { setGroupPPL(prev => !prev) } }
                  slotProps={{ input: { 'aria-label': 'controlled' } }}
                />
            </p>
            <Graph data={state.chartdata} callback={ chart => setCtx(chart.getContext('2d'))}/>
        </div>
}

const doStuff = (date, workouts) => {
    const today = new Date();

    const values = [];
    const dates = [];

    while (date.getTime() <= today.getTime()) {
        const y = workouts.filter((workout) => {
            const workoutDate = new Date(workout.date.split("T")[0]);
            const diff = Math.abs(workoutDate.getTime() - date.getTime());
            return diff < MILLIS_SCAN
        })

        const overflow = 2 - Math.min((today.getTime() - date.getTime()) / MILLIS_SCAN, 1) // Scale up a bit near today

        dates.push(new Date(date))
        values.push(y.length * overflow)

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
    "FULL BODY": ['rgb(174, 255, 74)', 'rgb(148, 224, 54, 0.8)', 'rgba(148, 224, 54, 0)'],
    "UPPER BODY": ['rgb(174, 255, 74)', 'rgb(148, 224, 54, 0.8)', 'rgba(148, 224, 54, 0)'],
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


    let sumAll = 0;
    const sumEx = {};
    setdata.forEach(obj => {
        const sum = obj.values[1].reduce((acc, val) => acc+val, 0);
        sumEx[obj.type] = sum;
        sumAll += sum;
    });

    const data = setdata.map(obj => ({
        label: Utils.camelCase(obj.type) + ` (${Math.round((sumEx[obj.type] / sumAll) * 100)}%)`,
        borderWidth: 2,
        borderColor: colors[obj.type][0],
        fill: true,
        backgroundColor: asGradient(ctx, colors[obj.type]),
        data: obj.values[1],
        tension: 0.4,
        cubicInterpolationMode: 'monotone',
        pointStyle: 'circle'
    }))

    return {
        type: 'line',
        data: {
            labels: setdata[0].values[0],
            datasets: data
        },
        options: {
            interaction: {
              intersect: false,
              mode: 'index',
            },
            responsive:true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5,
            scales: {
                y: {
                    stacked: true,
                    display: false,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            family: 'Quicksand',
                            weight: 'bold',
                        }
                    }
                },
                x: {
                    type: 'time',
                    stacked: true,
                    grid: {
                        display: false,
                    },
                    time: {
                        unit: 'month'
                    },
                    ticks: {
                        maxRotation: window.innerWidth < 600 ? 0 : 50,
                        labelOffset: window.innerWidth < 600 ? 25 : 0,
                        maxTicksLimit: window.innerWidth < 600 ? 4 : 0,
                        font: {
                            size: 12,
                            family: 'Quicksand',
                            weight: 'bold',
                        }
                    },
                    afterFit: (axis) => {
                        axis.paddingRight = window.innerWidth < 600 ? 0 : 0;
                        axis.paddingLeft = window.innerWidth < 600 ? 0 : 0;
                    }
                }
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "chartArea",
                    align: "start",
                    reverse: true,
                    labels: {
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
                    usePointStyle: true,
                    callbacks: {
                        title: function (contexts) {
                            const millis = contexts[0].parsed.x;
                            const from = new Date(millis - MILLIS_SCAN).toISOString().split("T")[0];
                            const to = new Date(millis + MILLIS_SCAN).toISOString().split("T")[0];
                            const prediction = new Date(millis + MILLIS_SCAN) > new Date()
                            return `Number of workouts in range:${ prediction ? '\n(estimated based on recent activity)' : '' }\n${from} - ${to}`
                        },
                        label: function (context) {
                            let label = context.dataset.label.split(' ')[0];
                            let value = Number(context.parsed.y || "0");
                            return " " + label + ": "+value.toFixed(0);
                        }
                    }
                }
            }
        }
    }
}

export default ModuleSplitRatios;