import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import Utils from "../../services/Utils";
import Select from "react-select";


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
                <div style={{ width: '100%', marginBottom: '2em' }}>
                    <Graph data={chartData} />
                    <Select
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        defaultValue={ selected }
                        placeholder={ 'None' }
                        onChange={ setSelected }
                        options={ options }
                        menuPlacement={"top"}
                        className="select-container"
                        classNamePrefix="select" />
                </div>
}


const createConfig = (setdata, selected) => {

    const dates = setdata['dates'].map(d => new Date(d));

    const data = Object.keys(setdata)
        .filter(key => key !== 'dates')
        .map(a => ({ label: a, values: setdata[a], sum: setdata[a][setdata[a].length - 1] }))
        .sort((a, b) => b.sum - a.sum)

    const sumTot = data.reduce((a, b) => a + b.sum, 0)

    const dataMormalized = data.map(({label, values, sum}) => ({label: label, values: values.map((a) => a / sumTot), sum: sum / sumTot}))

    const dataset = dataMormalized.map((bodyPart, index) => {
        const label = Utils.camelCase(bodyPart.label.replace("_", " ")) + ` (${(100 * bodyPart.sum).toFixed(1)}%)`
        return ({
            label: label,
            borderWidth: 2,
            data: bodyPart.values,
            backgroundColor: selected && selected === label ? 'rgb(165,110,39)' : 'rgba(60,96,140,1)',
            borderColor:  index == data.length - 1 ? 'rgba(107,166,239,1)' : 'rgba(0,0,0,0)',
            tension: 0,
            fill: true,
            pointStyle: 'circle'
    })})
    
    return {
        type: 'line',
        data: {
            labels: dates,
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
                mode: 'index'
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 2 : 2.5,
            scales: {
                y: {
                    stacked: true,
                    display: true,
                    position: "right",
                    ticks: {
                        font: {
                            family: 'Quicksand',
                            weight: 'bold',
                        },
                        callback: function (value) {
                            return (value * 100).toFixed(0) + '%';
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