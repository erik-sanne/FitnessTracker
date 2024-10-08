import '../../styles/Module.css';
import Spinner from "../ui_components/Loader";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import DisplayValue from "./DisplayValue";
import Switch from "@material-ui/core/Switch";
import {getCookie} from "react-use-cookie";

const createConfig = (bsds, normalratio) => {

    const xLabels = Object.keys(bsds[0]).map(k => camelCase(k.replace(/_/g, ' ')));
    const yValues = bsds.map(bsd => Object.values(bsd));

    const datasets = [{
        type: 'bar',
        label: '',
        backgroundColor: 'rgba(101,101,101,0.1)',
        borderColor: 'rgba(101,101,101,0.5)',
        borderWidth: 2,
        data: normalratio,
        borderRadius: 5,
        borderSkipped: false,
    },{
        type: 'line',
        label: '',
        backgroundColor: 'rgba(107,166,239,0.5)',
        borderColor: 'rgba(107,166,239,0.8)',
        borderWidth: 0,
        fill: false,
        pointRadius: 7,
        data: yValues[0],
        tension: 0.2
    }]

    bsds[1] && datasets.push({
        type: 'line',
        label: '',
        backgroundColor: 'rgba(70,131,58,0.5)',
        borderColor: 'rgba(70,131,58,0.8)',
        borderWidth: 0,
        fill: false,
        pointRadius: 7,
        data: yValues[0],
        tension: 0.2
    })

    const maxVal = Math.max(Math.max.apply(null, yValues.flat()) + 1, 6);

    return {
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: datasets
        },
        options: {
            interaction: {
                enabled: false
            },
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth < 600 ? 1.5 : 1.5,
            clip: false,
            hoverMode: 'index',
            scales: {
                y: {
                    display: true,
                    min: 0,
                    max: maxVal,
                    ticks: {
                        display: false,
                    },
                    gridLines: {
                        display: false,
                        tickMarkLength: 0,
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12,
                            family: 'Quicksand',
                            weight: 'bold',
                        },
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        usePointStyle: true
                    }
                },
                zoom: {
                    pan: {
                        enabled: false
                    },
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
    const [ usePredictions, setUsePredicions ] = useState(false);
    const [ predictedMaxes, setPredictedMaxes ] = useState(null);

    const getExerciseData = async () => {
        const token = getCookie('session_token');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        };

        const bench = await fetch( process.env.REACT_APP_API_BASE + `/api/predictORM/BENCH_PRESS`, options);
        const squat = await fetch( process.env.REACT_APP_API_BASE + `/api/predictORM/SQUAT`, options);
        const deadlift = await fetch( process.env.REACT_APP_API_BASE + `/api/predictORM/DEADLIFT`, options);

        return [
            await bench.json(),
            await squat.json(),
            await deadlift.json()
        ]
    }

    useEffect(() => {
        getExerciseData().then( res => setPredictedMaxes(res));
    },[])

    useEffect(() => {
        if (usePredictions && predictedMaxes) {
            setChartData(null);
            const bsds = [ scale(getBSD(predictedMaxes)) ];
            setChartData(createConfig(bsds, normalratio));
            setMse(getMse(bsds[0], normalratio));
            return;
        }

        if (data.length > 0) {
            const bsds = data.map(friend => scale(getBSD(friend)));
            setChartData(createConfig(bsds, normalratio));

            if (data.length === 1)
                setMse(getMse(bsds[0], normalratio));
            }
    }, [usePredictions, predictedMaxes])

    return (
        <>
            <div className={'primary-content-wrapper'}>
                { chartData ? <Graph data={ chartData } style={{ marginTop: '0'}} /> : <Spinner /> }
                { data.length < 2 &&
                                <p onClick={ () => { setUsePredicions(!usePredictions) }} style={{
                                    position: 'absolute',
                                    top: window.innerWidth < 600 ? '2.5rem' : '3.5rem',
                                    right: '1.5rem' }}> Actual <Switch color="primary" checked={ usePredictions } /> Predictions </p>}
            </div>

            <div style={{ display: "flex" }}>
                {
                    mse ? Object.entries(mse).map(([key, value], idx) =>
                        <DisplayValue key={idx} text={ key == 'Squat' ? 'Conv. Squat' : key } value={value + `${ usePredictions ? '*' : '' }`}/>
                    ) :
                        <>
                            <DisplayValue key={ 1 } text={ "Bench Press" } value={''}/>
                            <DisplayValue key={ 2 } text={ "Conv. Squat" } value={''}/>
                            <DisplayValue key={ 3 } text={ "Deadlift" } value={''}/>
                        </>
                }
            </div>
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default ModuleBSD;