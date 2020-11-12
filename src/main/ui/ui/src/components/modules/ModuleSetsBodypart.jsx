import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import React, {useEffect, useRef } from 'react';
import Spinner from "react-bootstrap/Spinner";
import Chart from 'chart.js'
import useFetch from "../../services/UseFetch";
import DisplayValue from "./DisplayValue";

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
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!loading) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            new Chart(ctx, createConfig(data));
        }
    }, [data, loading]);

    return (
            <div className={ 'module' }>
                <h3> Intensity / part </h3>
                { loading ? <Spinner animation="grow"/> :
                    <>
                        <canvas ref={canvasRef} />
                        <div style={{display: "flex"}}>
                            <DisplayValue text={"You could focus more on"} value={ "[N/A]" } />
                        </div>
                    </>
                }
            </div>
    );
}

export default ModuleSetsBodypart;