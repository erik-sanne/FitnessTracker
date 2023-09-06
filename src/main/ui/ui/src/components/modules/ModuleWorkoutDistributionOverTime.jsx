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

const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const createConfig = (setdata) => {


    const dates = setdata['dates'].map(d => new Date(d));

    const data = Object.keys(setdata).filter(key => key !== 'dates').map((bodyPart, index) => ({
        label: Utils.camelCase(bodyPart.replace("_", " ")),
        borderWidth: 2,
        data: setdata[bodyPart],
        borderColor: colorArray[index],
        backgroundColor: "rgba(0,0,0,0)",
        lineTension: 0,
        pointStyle: 'circle'
    }))


    return {
        type: 'line',
        data: {
            labels: dates,
            datasets: data
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