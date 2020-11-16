import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import Spinner from "react-bootstrap/Spinner";
import useFetch from "../../services/UseFetch";
import DisplayValue from "./DisplayValue";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import Graph from "./Graph";
import React, {useEffect, useState} from "react";

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

const computeAverage = (numWeeks, data) => {
    const subarr = data.slice(Math.max(- numWeeks, 0));
    const total = subarr.map(e => e.totalWorkouts).reduce((acc, el) => acc + el, 0);
    return total / numWeeks;
}

const ModuleWorkoutDays = () => {
    const { data, loading } = useFetch('api/workoutsPerWeek');
    const [ chartData, setChartData ] = useState(null);

    // Note to self:
    // Unfortunately this hook is needed and I am not sure why...
    // data = createConfig(data) does not ALWAYS work properly.
    useEffect(() => {
        if (!loading)
            setChartData(createConfig(data));
    }, [data, loading])

    return (
        <>
            <FontAwesomeIcon icon={ faMedal } style={{
                color: "#ffc877",
                position: 'absolute',
                top:'min(4vw, 68px)',
                right: 'min(4vw, 68px)',
                fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                }}/>

            { loading ? <Spinner animation="grow"/> :
                <>
                    <Graph data={ chartData } />
                    <div style={{ display: "flex" }}>
                        <DisplayValue text={'Avg 90 weeks'} value={ computeAverage(90, data).toFixed(1) } />
                        <DisplayValue text={'Avg 30 weeks'} value={ computeAverage(30, data).toFixed(1) } />
                        <DisplayValue text={'Avg 10 weeks'} value={ computeAverage(10, data).toFixed(1) } />
                    </div>
                </>
            }
        </>
    );
}

export default ModuleWorkoutDays;