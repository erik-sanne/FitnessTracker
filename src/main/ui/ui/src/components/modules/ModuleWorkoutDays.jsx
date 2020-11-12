import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import React, {useEffect, useRef } from 'react';
import Spinner from "react-bootstrap/Spinner";
import Chart from 'chart.js'
import useFetch from "../../services/UseFetch";
import DisplayValue from "./DisplayValue";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'

const createConfig = (data) => {
    data = data.reverse();

    const xLabels = data.map((week) => (
        `${ week.year } ${ week.weekNumber }`
    ));

    const yValues = data.map((week) => (
        week.totalWorkouts
    ));

    return {
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: [{
                label: 'Workouts per week',
                backgroundColor: 'rgba(107,166,239,0.35)',
                data: yValues,
            }]
        },
        options: {
            legend: {
                display: false
            },
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        max: 7,
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: xLabels[xLabels.length - 7],
                        max: xLabels[xLabels.length],
                        callback: function(value, index, values) {
                            const arr = value.split(" ")
                            return arr[1] === "1" ? [arr[1], arr[0]] : [arr[1], ''];
                        }
                    }
                }]
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        enabled: false
                    }
                }
            }
        }
    }
}

const computeAverage = (numDays, data) => {
    const subarr = data.slice(Math.max(- numDays, 0));
    const total = subarr.map(e => e.totalWorkouts).reduce((acc, el) => acc + el, 0);
    return total / numDays;
}

const ModuleWorkoutDays = () => {
    const { data, loading } = useFetch('api/workoutsPerWeek');
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
                <h3>Workouts per week
                    <FontAwesomeIcon icon={ faMedal } style={{ color: "#ffc877", float: 'right', position: 'relative', top:'3px' }}/>
                </h3>
                { loading ? <Spinner animation="grow"/> :
                    <>
                        <canvas ref={canvasRef} />
                        <div style={{display: "flex"}}>
                            <DisplayValue text={'Avg 90 weeks'} value={ computeAverage(90, data).toFixed(1) } />
                            <DisplayValue text={'Avg 30 weeks'} value={ computeAverage(30, data).toFixed(1) } />
                            <DisplayValue text={'Avg 10 weeks'} value={ computeAverage(10, data).toFixed(1) } />
                        </div>
                    </>
                }
            </div>
    );
}

export default ModuleWorkoutDays;