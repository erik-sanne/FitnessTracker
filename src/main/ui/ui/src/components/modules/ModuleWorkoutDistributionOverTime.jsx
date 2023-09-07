import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Graph from "./Graph";
import Utils from "../../services/Utils";


const ModuleWorkoutDistributionOverTime = () => {
    const { data, loading } = useFetch('/api/distribution-over-time');
    const [ chartData, setChartData ] = useState(null);

    useEffect(() => {
        if (!data)
            return

        const chartdata = createConfig(data);
        setChartData(chartdata)

    }, [data])


    if (loading)
        return <Loader />

    return chartData &&
                <div style={{ width: '100%', marginBottom: '2em' }}>
                    <Graph data={chartData} />
                </div>
}


const createConfig = (setdata) => {

    const sum = (arr) => arr.reduce((a, b) => a+b, 0)

    const dates = setdata['dates'].map(d => new Date(d));

    const data = Object.keys(setdata)
        .filter(key => key !== 'dates')
        .map(a => ({ label: a, values: setdata[a], sum: sum(setdata[a]) }))
        .sort((a, b) => b.sum - a.sum)

    const sumTot = data.reduce((a, b) => a + b.sum, 0)

    const dataset = data.map((bodyPart, index) => ({
        label: Utils.camelCase(bodyPart.label.replace("_", " ")) + ` (${(100 * bodyPart.sum/sumTot).toFixed(1)}%)`,
        borderWidth: 2,
        data: bodyPart.values,
        backgroundColor: 'rgba(60,96,140,0.1)',
        borderColor: 'rgba(107,166,239,0.5)',
        lineTension: 0,
        pointStyle: 'circle'
    }))


    return {
        type: 'line',
        data: {
            labels: dates,
            datasets: dataset
        },
        options: {
            legend: {
                display: true,
                position: "chartArea",
                align: "center",
                reverse: true,
                labels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            layout: {
                padding: {
                    left: 1,
                    right:  0
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
                    position: "left",
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
                        maxRotation: window.innerWidth < 600 ? 0 : 50,
                        labelOffset: window.innerWidth < 600 ? 25 : 0,
                        maxTicksLimit: window.innerWidth < 600 ? 4 : 0,
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

export default ModuleWorkoutDistributionOverTime;