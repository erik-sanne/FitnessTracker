import '../../styles/Module.css';
import Spinner from "react-bootstrap/Spinner";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import DisplayValue from "./DisplayValue";

const createConfig = (bsd, normalratio) => {

    const xLabels = Object.keys(bsd).map(k => camelCase(k.replace(/_/g, ' ')));
    const yValues = Object.values(bsd);

    const datasets = [{
        type: 'bar',
        label: '',
        backgroundColor: 'rgba(101,101,101,0.1)',
        borderColor: 'rgba(101,101,101,0.5)',
        borderWidth: 2,
        data: normalratio
    },{
        type: 'line',
        label: '',
        backgroundColor: 'rgba(107,166,239,0.1)',
        borderColor: 'rgba(107,166,239,0.5)',
        borderWidth: 2,
        fill: false,
        data: yValues
    }]

    const maxVal = Math.max(Math.max.apply(null, yValues) + 1, 6);

    return {
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: datasets
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 1.5,
            hoverMode: 'index',
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        display: false,
                        min: 0,
                        max: maxVal,
                    },
                    gridLines: {
                        display: false,
                        tickMarkLength: 0,
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 12,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold',
                        display: false
                    }
                }]
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: false
                    },
                    zoom: {
                        enabled: false
                    }
                }
            }
        }
    }
}

const getBSD = (data) => {
    const bsd = {
        "BENCH_PRESS": 0,
        "SQUAT": 0,
        "DEADLIFT": 0
    }

    const keys = Object.keys(bsd);

    data.forEach(pb => {
        if (keys.includes(pb.exercise)) {
            bsd[pb.exercise] = pb.weight;
        }
    })
    return bsd;
}

const scale = (bsd) => {
    const hyp = Object.values(bsd).reduce((a, b) => a + b, 0)
    const scale = 12 / hyp;

    bsd["BENCH_PRESS"] *= scale;
    bsd["SQUAT"] *= scale;
    bsd["DEADLIFT"] *= scale;

    return bsd;
}

const getMse = (bsd, normalratio) => {
    const values = Object.values(bsd);
    const mse = normalratio.map((e, i) => {
        return (100 * values[i] / e).toFixed(0) + "%";
    });
    const keys = Object.keys(bsd).map(k => camelCase(k.replace(/_/g, ' ')));
    const map = {};
    keys.forEach((key, idx) => {
        map[key] = mse[idx];
    })

    return map;
}

const ModuleBSD = ({ data=[] }) => {
    const normalratio = [3, 4, 5];
    const [ chartData, setChartData ] = useState(null);
    const [ mse, setMse ] = useState(null);

    useEffect(() => {
        if (data.length > 0 && !chartData) {
            const bsd = scale(getBSD(data));
            setMse(getMse(bsd, normalratio));
            setChartData(createConfig(bsd, normalratio));
        }
    }, [data])

    return (
        <>
            { !chartData ? <Spinner animation="grow"/> :
                <>
                    { chartData && <Graph data={ chartData } /> }
                    <div style={{display: "flex", justifyContent: 'space-around'}}>
                        {
                            Object.entries(mse).map(([key, value], idx) =>
                                <DisplayValue key={idx} text={key} value={value} style={{ textAlign: 'center' }}/>
                            )
                        }
                    </div>
                </>
            }
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default ModuleBSD;