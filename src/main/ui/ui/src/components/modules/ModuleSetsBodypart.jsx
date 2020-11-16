import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import Spinner from "react-bootstrap/Spinner";
import useFetch from "../../services/UseFetch";
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

const ModuleSetsBodypart = () => {
    const { data, loading } = useFetch('api/setsPerBodypart');
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
                    <div style={{display: "flex"}}>
                        <DisplayValue text={"You could focus more on"} value={ "[N/A]" } />
                    </div>
                </>
            }
        </>
    );
}

export default ModuleSetsBodypart;