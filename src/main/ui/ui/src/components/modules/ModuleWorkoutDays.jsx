import '../../styles/Module.css';
import React, {useEffect, useRef} from 'react';
import Spinner from "react-bootstrap/Spinner";
import Chart from 'chart.js'
import zoom from 'chartjs-plugin-zoom' //It says that its not used, but it is
import useFetch from "../../services/UseFetch";

const config = {}

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
                backgroundColor: 'rgba(54,92,150, 0.5)',
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
                            return arr[1] == "1" ? [arr[1], arr[0]] : [arr[1], ''];
                        }
                    }
                }]
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x' // is panning about the y axis neccessary for bar charts?
                    },
                    zoom: {
                        enabled: false
                    }
                }
            }
        }
    }
}

const ModuleWorkoutDays = () => {
    const { data, _, loading } = useFetch('api/workoutsPerWeek');
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
                <h3>Frequency</h3>
                {loading ? <Spinner animation="grow" /> : <canvas ref={ canvasRef } />}
            </div>
    );
}

export default ModuleWorkoutDays;