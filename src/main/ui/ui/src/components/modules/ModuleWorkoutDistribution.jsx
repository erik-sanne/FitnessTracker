import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import Spinner from "react-bootstrap/Spinner";
import useFetch from "../../services/useFetch";
import DisplayValue from "./DisplayValue";
import Graph from "./Graph";
import {useEffect, useState} from "react";

const manualOrderingPass = (data) => {
    return [
        { x: "CORE", y: data["CORE"] },
        { x: "OBLIQUES", y: data["OBLIQUES"] },
        { x: "GLUTES", y: data["GLUTES"] },
        { x: "HAMSTRINGS", y: data["HAMSTRINGS"] },
        { x: "QUADS", y: data["QUADS"] },
        { x: "CALVES", y: data["CALVES"] },
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
    ]
};

const interpolate = (values, factor) => {
    let result = []
    const len = values.length;
    for (let i = 0; i < len; i++) {
        let sum = 0;
        for (let j = -factor; j < +factor; j++) {
            const index = (((i + j) % len) + len) % len;
            const falloff = 1 / (1 + Math.abs(j));
            sum += values[index] * falloff;
        }
        result[i] = sum;
    }
    return result;
}

const createConfig = (data) => {

    const sorted = manualOrderingPass(data);

    const xLabels = sorted.map( entry => entry.x)
    const yValues = interpolate(sorted.map( entry => entry.y), 5);

    return {
        type: 'radar',
        data: {
            labels: xLabels,
            datasets: [{
                label: 'Sets per bodypart',
                backgroundColor: 'rgba(107,166,239,0.35)',
                data: yValues,
                lineTension: 0.5,
            }]
        },
        options: {
            legend: {
                display: false
            },
            responsive: true,
            scale: {
                ticks: {
                    display: false
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

const bestImprovement = (data) => {
    let lowest = 99;
    let str = "";
    Object.entries(data).map(([name, value]) => {
        if (value < lowest) {
            lowest = value;
            str = name;
        }
        return null;
    })
    return str.split('_')[1] || str.split('_')[0];
}

const ModuleWorkoutDistribution = () => {
    const { data, loading } = useFetch('/api/distribution');
    const [ chartData, setChartData ] = useState(null);

    useEffect(() => {
        if (!loading)
            setChartData(createConfig(data));

    }, [data, loading])

    return (
        <>
            { loading ? <Spinner animation="grow"/> :
                <>
                    <Graph data={ chartData } />
                    <div style={{display: "flex", marginTop: "10px"}}>
                        <DisplayValue text={"You could focus more on"} value={ bestImprovement(data)} />
                    </div>
                </>
            }
        </>
    );
}

export default ModuleWorkoutDistribution;