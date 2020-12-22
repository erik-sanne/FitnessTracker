import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import Spinner from "react-bootstrap/Spinner";
import useFetch from "../../services/useFetch";
import DisplayValue from "./DisplayValue";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import Modal from "../ui_components/Modal";

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
                        min: 0,
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

const reachedGoal = (goal, data) => {
    return data && data[data.length - 1].totalWorkouts >= goal;
}

const ModuleWorkoutDays = () => {
    const LS_KEY_WEEKLY_GOAL = "weekly_goal"
    const { data, loading } = useFetch('/api/workoutsPerWeek');
    const [ chartData, setChartData ] = useState(null);
    const [ goal, setGoal ] = useState(localStorage.getItem(LS_KEY_WEEKLY_GOAL) || 3);
    const [ goalErr, setGoalErr ] = useState(false);
    const [ modalVisible, setModalVisible ] = useState(false)

    const changeGoal = (value) => {
        value = parseInt(value);
        if (value < 1 || value > 14) {
            setGoalErr(true)
        } else {
            localStorage.setItem(LS_KEY_WEEKLY_GOAL, value);
            setGoalErr(false)
        }
        setGoal(value)
    }

    useEffect(() => {
        if (!loading)
            setChartData(createConfig(data));
    }, [data, loading])

    return (
        <>
            <FontAwesomeIcon icon={ faMedal } style={{
                color: !loading && reachedGoal(goal, data) ? "#ffc877" : "rgb(61 65 72)",
                position: 'absolute',
                top:'min(4vw, 68px)',
                right: 'min(4vw, 68px)',
                fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                }}
                onClick={ () => setModalVisible(true) }/>

            { loading ? <Spinner animation="grow"/> :
                <>
                    <Graph data={ chartData } />
                    <div style={{ display: "flex" }}>
                        <DisplayValue text={'Avg 30 weeks'} value={ data ? computeAverage(30, data).toFixed(1) : "-" } />
                        <DisplayValue text={'Avg 10 weeks'} value={ data ? computeAverage(10, data).toFixed(1) : "-" } />
                        <DisplayValue text={'This week'} value={ data ? data[data.length-1].totalWorkouts.toFixed(0) : "-" } />
                    </div>
                </>
            }
            <Modal visible={ modalVisible } title={ "Weekly goal" } onClose={ () => setModalVisible(false) }>
                <input type={ "number" } style={ goalErr ? styleError : {} } value={ goal } onChange={ (e) => changeGoal(e.target.value) } onS />
            </Modal>
        </>
    );
}

const styleError = {
    border: '1px solid red',
    background: 'pink'
}

export default ModuleWorkoutDays;