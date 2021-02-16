import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import Spinner from "react-bootstrap/Spinner";
import DisplayValue from "./DisplayValue";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";

const CALVES_SCALE = 1.5;

const manualOrderingPass = (data) => {
    return [
        { x: "CORE", y: data["CORE"] },
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

const createConfig = (data=[]) => {

    const sorted = manualOrderingPass(data[0]);
    const xLabels = sorted.map( entry => entry.x)

    const datasets = data.map((set, idx) => {
        const sorted = manualOrderingPass(set);
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
            aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5,
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
        person.forEach(d => {
            if (!isNaN(d.y)) {
                if (merged[d.x]) {
                    merged[d.x] += d.y;
                } else
                    merged[d.x] = d.y;
            }
        })
    });

    return calculateImpr(merged);
}

const ModuleWorkoutDistribution = ({ data=[] }) => {
    const [ chartData, setChartData ] = useState(null);

    useEffect(() => {
        if (data.length > 0 && !chartData)
            setChartData(createConfig(data));
    }, [data])

    return (
        <>
            { data.length < 1 ? <Spinner animation="grow"/> :
                <>
                    <Graph data={ chartData } />
                    <div style={{display: "flex", marginTop: "10px"}}>
                        { data.length > 1 ?
                            <DisplayValue text={"You could both focus on"} value={ bestImprovementMulti(data) } />
                            :
                            <DisplayValue text={"You could focus more on"} value={ bestImprovement(data[0])} />
                        }
                    </div>
                </>
            }
        </>
    );
}

export default ModuleWorkoutDistribution;