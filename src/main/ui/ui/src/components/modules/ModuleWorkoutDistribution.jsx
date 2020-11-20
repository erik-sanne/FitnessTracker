import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import Spinner from "react-bootstrap/Spinner";
import useFetch from "../../services/useFetch";
import DisplayValue from "./DisplayValue";
import Graph from "./Graph";
import {useEffect, useState} from "react";

const createConfig = (data) => {
    const xLabels = data.map( e => e.key.replace('_', ' '))
    const yValues = data.map( e => e.value )

    return {
        type: 'radar',
        data: {
            labels: xLabels,
            datasets: [{
                label: 'Sets per bodypart',
                backgroundColor: 'rgba(107,166,239,0.35)',
                data: yValues,
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
    data.forEach( (e) => {
        if (e.value >= lowest)
            return;

        lowest = e.value;
        str = e.key;
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