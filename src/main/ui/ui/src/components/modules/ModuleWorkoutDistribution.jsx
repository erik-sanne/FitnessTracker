import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import Spinner from "../ui_components/Loader";
import DisplayValue from "./DisplayValue";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import Slider from "@material-ui/core/Slider";
import TextButton from "../ui_components/TextButton";
import Switch from "@material-ui/core/Switch";

const CALVES_SCALE = 2.0;
const CORE_SCALE = 1.5;

const manualOrderingPass = (data, ppl=false) => {
    if (ppl) {
        return [
            { x: "LEGS", y: (data["GLUTES"] +
                            data["HAMSTRINGS"] +
                            data["QUADS"] +
                            data["CALVES"]) / 4 },
            { x: "PULL", y: (data["TRAPS"] +
                            data["RHOMBOIDS"]+
                            data["LATS"]+
                            data["REAR_DELTS"] +
                            data["BICEPS"]) / 5 },
            { x: "PUSH", y: (data["TRICEPS"] +
                            data["SIDE_DELTS"] +
                            data["FRONT_DELTS"] +
                            data["UPPER_CHEST"] +
                            data["LOWER_CHEST"]) / 5 },
        ].map(it => { it.x = camelCase(it.x); return it;})
    }

    return [
        { x: "CORE", y: data["CORE"] * CORE_SCALE},
        //{ x: "OBLIQUES", y: data["OBLIQUES"] },
        { x: "GLUTES", y: data["GLUTES"] },
        { x: "HAMSTRINGS", y: data["HAMSTRINGS"] },
        { x: "QUADS", y: data["QUADS"] },
        { x: "CALVES", y: data["CALVES"] * CALVES_SCALE },
        { x: "TRAPS", y: data["TRAPS"] },
        { x: "RHOMBOIDS", y: data["RHOMBOIDS"] },
        { x: "LATS", y: data["LATS"] },
        { x: "REAR DELTS", y: data["REAR_DELTS"] },
        { x: "BICEPS", y: data["BICEPS"] },
        { x: "TRICEPS", y: data["TRICEPS"] },
        { x: "SIDE DELTS", y: data["SIDE_DELTS"] },
        { x: "FRONT DELTS", y: data["FRONT_DELTS"] },
        { x: "UPPER CHEST", y: data["UPPER_CHEST"] },
        { x: "LOWER CHEST", y: data["LOWER_CHEST"] },
    ].map(it => { it.x = camelCase(it.x); return it;})
};

const interpolate = (values, factor) => {
    let result = []
    const len = values.length;
    for (let i = 0; i < len; i++) {
        let sum = 0;
        for (let j = -factor; j <= +factor; j++) {
            const index = (((i + j) % len) + len) % len;
            const falloff = 1 / (1 + Math.abs(j));
            sum += values[index] * falloff;
        }
        result[i] = sum;
    }
    return result;
}

const createConfig = (data=[], usePPL= false) => {
    const sorted = manualOrderingPass(data[0], usePPL);
    const xLabels = sorted.map( entry => entry.x)

    const datasets = data.map((set, idx) => {
        const sorted = manualOrderingPass(set, usePPL);
        const yValues = interpolate(sorted.map( entry => Math.log(entry.y + 1)), 0);
        return {
            label: 'Sets per bodypart',
            backgroundColor: idx === 0 ? 'rgba(107,166,239,0.1)' : 'rgba(70,131,58,0.1)',
            borderColor: idx === 0 ? 'rgba(107,166,239,0.5)' : 'rgba(70,131,58,0.5)',
            data: yValues,
            lineTension: 0.1,
            borderWidth: 2
        }
    })

    return {
        type: 'radar',
        data: {
            labels: xLabels,
            datasets: datasets
        },
        options: {
            legend: {
                display: false
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 1.5,
            scale: {
                ticks: {
                    display: false
                },
                pointLabels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            elements: {
                point:{
                    radius: 0
                }
            }
        }
    }
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const calculateImpr = (mapping) => {
    let lowest = 99;
    let str = "";
    mapping.map(({x: name, y: value}) => {
        if (value <= lowest) {
            lowest = value;
            str = name;
        }
        return null;
    })
    let res = str.split('_')[1] || str.split('_')[0];
    return camelCase(res);
}

const bestImprovement = (data) => {
    const mapping = manualOrderingPass(data);
    return calculateImpr(mapping);
}

const bestImprovementMulti = (data) => {
    let merged = {};
    data.forEach(person => {
        person = manualOrderingPass(person);
        person.forEach((ex, idx) => {
            if (!isNaN(ex.y)) {
                if (merged[idx]) {
                    merged[idx].y += ex.y;
                } else
                    merged[idx] = ex;
            }
        })
    });

    return calculateImpr(Object.values(merged));
}

const ModuleWorkoutDistribution = ({ data=[], rangeCallback }) => {
    const [ chartData, setChartData ] = useState(null);
    const [ usePPL, setUsePPL ] = useState(false)
    const [ maxRange, ] = useState(365)
    const [ range, setRange ] = useState([maxRange-30, maxRange]);
    const [ timer, setTimer] = useState(null)

    useEffect(() => {
        if (data.length > 0) {
            setChartData(createConfig(data, usePPL));
        }
    }, [data])

    const valuetext = (value) => {
        let date = new Date();
        date.setDate(date.getDate() - maxRange + value);
        let parts = date.toISOString().split('T')[0].split("-");
        let dateString = `${parts[2]}/${parts[1]}`
        return `${dateString}`;
    }

    const submitDates = () => {
        let from = new Date();
        let to = new Date();
        from.setDate(from.getDate() - maxRange + range[0]);
        to.setDate(to.getDate() - maxRange + range[1]);
        rangeCallback(from, to);
    }

    useEffect(() => {
        if (timer)
            clearTimeout(timer);
        setTimer(setTimeout(() => { submitDates(); }, 250));
    }, [range, usePPL])

    return (
        <>
            { data.length < 1 ? <Spinner /> :
                <>
                    { data.length < 2 && <p style={{ textAlign: "right", margin: '-5px'}} onClick={ () => {
                        setUsePPL(!usePPL);
                    }}>
                        Show splits
                        <Switch color="primary" checked={ usePPL }/>
                    </p> }
                    <div className={ 'centerC' }>
                        <Graph data={ chartData } />
                    </div>
                    <div style={{display: "flex", marginTop: "10px"}}>
                        { data.length > 1 ?
                            <DisplayValue text={"You could both focus on"} value={ bestImprovementMulti(data) } />
                            :
                            bestImprovement(data[0]) ?
                                <DisplayValue text={"You could focus more on"} value={bestImprovement(data[0])} /> :
                                <DisplayValue text={"No data for this period"} value={ null } />
                        }
                    </div>
                    {data.length === 1 && <>
                        <Slider
                            value={range}
                            onChange={(event, val) => setRange([ val[0], val[1] ]) }
                            valueLabelDisplay="auto"
                            valueLabelFormat={valuetext}
                            min={0}
                            max={maxRange}
                            />
                            <div style={{ float: 'right' }}>
                                <TextButton mini onClick={ () => setRange([maxRange - 180, maxRange])}> 180 days </TextButton>
                                <TextButton mini onClick={ () => setRange([maxRange - 90, maxRange])}> 90 days </TextButton>
                                <TextButton mini onClick={ () => setRange([maxRange - 30, maxRange])}> 30 days </TextButton>
                            </div>
                        </>
                    }
                </>
            }
        </>
    );
}

export default ModuleWorkoutDistribution;