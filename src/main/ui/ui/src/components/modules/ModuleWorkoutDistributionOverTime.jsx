import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import Utils from "../../services/Utils";
import Select from "react-select";

const RATE_INTERVAL = 1000 * 60 * 60 * 24 * 45; // 45+45=~3 months

const ModuleWorkoutDistributionOverTime = () => {
    const { data, loading } = useFetch('/api/distribution-over-time');
    const [ chartData, setChartData ] = useState(null);
    const [ options, setOptions] = useState(null)
    const [ selected, setSelected] = useState("")

    useEffect(() => {
        if (!data)
            return

        const chartdata = createConfig(data, selected.value);
        setOptions(chartdata.data.datasets.map(dataset => ({label: dataset.label, value: dataset.label})))
        setChartData(chartdata)

    }, [data, selected])


    if (loading)
        return <Loader />

    return chartData &&
                <>
                    <Graph data={chartData} />
                    { false && <Select
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        defaultValue={ selected }
                        placeholder={ 'None' }
                        onChange={ setSelected }
                        options={ options }
                        menuPlacement={"top"}
                        className="select-container"
                        classNamePrefix="select" />}
                </>
}

const rate = (data) => {
    const today = new Date();

    const result = {};
    Object.keys(data).forEach((key) => {
        result[key] = [];
    });

    let cursor = new Date(data.dates[0]);
    while (cursor.getTime() <= today.getTime()) {
        const startOfInterval = data.dates.findIndex(date => Math.abs(cursor.getTime() - new Date(date).getTime()) <= RATE_INTERVAL);
        const endOfInterval = data.dates.findLastIndex(date => Math.abs(cursor.getTime() - new Date(date).getTime()) <= RATE_INTERVAL);

        result.dates.push(cursor);
        Object.entries(data).forEach(([key, values]) => {
           if (key == 'dates') return;

           if (startOfInterval === -1 && endOfInterval === -1) {
               result[key].push(0);
               return;
           }

           const s = Math.max(0, startOfInterval);
           const e = Math.min(endOfInterval + 1, data.dates.length);

           let ratedValue = values.slice(s, e).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
           result[key].push(ratedValue);
        });

        const copy = new Date(cursor);
        if (cursor.getDate() === 1) {
            cursor = new Date(copy.setDate(7))
        } else if (cursor.getDate() === 7) {
            cursor = new Date(copy.setDate(cursor.getMonth() === 1 ? 14 : 15))
        } else if (cursor.getDate() === 14 || cursor.getDate() === 15) {
            cursor = new Date(copy.setDate(21))
        } else {
            cursor = new Date(copy.setMonth(cursor.getMonth() + 1));
            cursor = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
        }
    }

    return result;
}

const randomColors = (total) => {
    var i = 360 / (total - 1);
    var r = [];
    for (var x=0; x<total; x++)
    {
        r.push([`hsl(${i * x}, 50%, 50%)`, `hsl(${i * x}, 50%, 30%, 0.8)`]);
    }
    return r;
}

const createConfig = (setdata, selected) => {
    delete setdata["SPINAL_ERECTORS"]
    const ratedData = rate(setdata);

    const colors = randomColors(Object.keys(ratedData).length);
    const dataset = Object.entries(ratedData).filter(([key, values]) => key !== 'dates').sort(([k1, v1], [k2, v2]) => {
            const sumA = v1.reduce((acc, curr) => acc + curr, 0);
            const sumB = v2.reduce((acc, curr) => acc + curr, 0);
            return sumB - sumA;
        }).map(([key, values], index) => {
            const label = Utils.camelCase(key.replace("_", " "))
            return ({
                label: label,
                borderWidth: 2,
                data: values,
                tension: 0,
                borderColor: colors[index][0],
                backgroundColor: colors[index][1],
                fill: true,
                pointStyle: 'circle'
        })})
    
    return {
        type: 'line',
        data: {
            labels: ratedData.dates,
            datasets: dataset
        },
        options: {
            layout: {
                padding: {
                    left: 1,
                    right:  0
                }
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            responsive:true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth < 600 ? 2 : 2.5,
            scales: {
                y: {
                    stacked: true,
                    display: false,
                    position: "right",
                    ticks: {
                        font: {
                            family: 'Quicksand',
                            weight: 'bold',
                        },
                        callback: function (value) {
                            return (value);
                        },
                    }
                },
                x: {
                    type: 'time',
                    stacked: true,
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
                        axis.paddingRight = 0;
                        axis.paddingLeft = 0;
                    }
                }
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            plugins: {
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        title: function (contexts) {
                            const millis = contexts[0].parsed.x;
                            const from = new Date(millis - RATE_INTERVAL).toISOString().split("T")[0];
                            const to = new Date(millis + RATE_INTERVAL).toISOString().split("T")[0];
                            return `Approximated distribution:\n${from} - ${to}`
                        },
                        label: function (context) {
                            let val = context.parsed.y || '';
                            let label = context.dataset.label || '';

                            let sum = 0;
                            Object.entries(ratedData).forEach(([k, values]) => {
                                if (k === 'dates') return;
                                sum += values[context.dataIndex]
                            });
                            if (sum < 0.01)
                                return " " + label + ": 0%";
                            return " " + label + ": " + ((val/sum)*100).toFixed(0) + "%";
                        }
                    }
                },
                legend: {
                    display: false,
                    position: "chartArea",
                    align: "center",
                    reverse: true,
                    labels: {
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    }
}

export default ModuleWorkoutDistributionOverTime;