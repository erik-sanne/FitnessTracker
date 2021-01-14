import '../../styles/Module.css';
import Spinner from "react-bootstrap/Spinner";
import DisplayValue from "./DisplayValue";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import Modal from "../ui_components/Modal";

const createConfig = (rawdata=[]) => {

    const data = rawdata.map(d => d.reverse());

    const datasets = data.map((person, idx) => {
        const yValues = person.map((week) => week.totalWorkouts );
        return {
            label: 'Workouts per week',
            backgroundColor: idx === 0 ? 'rgba(107,166,239,0.35)' : 'rgba(70,131,58,0.35)',
            data: yValues
        }
    })

    let longestRecords = [];
    let tempLen = 0;
    data.forEach((person) => {
        if (person.length > tempLen) {
            tempLen = person.length;
            longestRecords = person;
        }
    })

    let xLabels = longestRecords.map((week) => (
        `${ week.year } ${ week.weekNumber }`
    ));

    datasets.forEach((dataset) => {
        const diffLen = tempLen - dataset.data.length;
        if (diffLen)
            dataset.data = new Array(Math.abs(diffLen)).fill(0,0, Math.abs(diffLen)).concat(dataset.data)
    })

    return {
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: datasets
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
                        max: xLabels[xLabels.length - 1],
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
    const subarr = data.slice(Math.max(data.length - numWeeks, 0));
    const total = subarr.map(e => e.totalWorkouts).reduce((acc, el) => acc + el, 0);
    return total / numWeeks;
}

const reachedGoal = (goal, data) => {
    return data && data[data.length - 1].totalWorkouts >= goal;
}

const ModuleWorkoutDays = ({ data=[] }) => {
    const LS_KEY_WEEKLY_GOAL = "weekly_goal"
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
        if (data.length > 0)
            setChartData(createConfig(data))
    }, [data])

    return (
        <>
            { data.length === 1 && <FontAwesomeIcon icon={ faMedal } style={{
                color: reachedGoal(goal, data[0]) ? "#ffc877" : "rgb(61 65 72)",
                position: 'absolute',
                top:'min(4vw, 68px)',
                right: 'min(4vw, 68px)',
                fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                }}
                onClick={ () => setModalVisible(true) }/>}

            { data.length < 1 ? <Spinner animation="grow"/> :
                <>
                    { chartData && <Graph data={ chartData } /> }
                    {data.length < 2 ?
                        <div style={{display: "flex"}}>
                            <DisplayValue text={'Avg 30 weeks'}
                                          value={data ? computeAverage(30, data[0]).toFixed(1) : "-"}/>
                            <DisplayValue text={'Avg 10 weeks'}
                                          value={data ? computeAverage(10, data[0]).toFixed(1) : "-"}/>
                            <DisplayValue text={'This week'}
                                          value={data ? data[0][data[0].length - 1].totalWorkouts.toFixed(0) : "-"}/>
                        </div>
                        :
                        <div style={{display: "flex"}}>
                            <DisplayValue text={'Avg 30 weeks'}
                                          value={
                                              <>
                                                <span style={{ color: 'rgba(107,166,239,0.35)'}}> { computeAverage(30, data[0]).toFixed(1) }</span>
                                                <span style={{ color: 'rgba(70,131,58,0.35)'}}> { computeAverage(30, data[1]).toFixed(1) }</span>
                                              </>
                                          }/>
                            <DisplayValue text={'Avg 10 weeks'}
                                          value={
                                              <>
                                                  <span style={{ color: 'rgba(107,166,239,0.35)'}}> { computeAverage(10, data[0]).toFixed(1) }</span>
                                                  <span style={{ color: 'rgba(70,131,58,0.35)'}}> { computeAverage(10, data[1]).toFixed(1) }</span>
                                              </>
                                          }/>
                            <DisplayValue text={'This week'}
                                          value={
                                              <>
                                                  <span style={{ color: 'rgba(107,166,239,0.35)'}}> { data[0][data[0].length - 1].totalWorkouts.toFixed(0) }</span>
                                                  <span style={{ color: 'rgba(70,131,58,0.35)'}}> { data[1][data[1].length - 1].totalWorkouts.toFixed(0) }</span>
                                              </>
                                          }/>
                        </div>
                    }
                </>
            }
            <Modal visible={ modalVisible } title={ "Weekly goal" } onClose={ () => setModalVisible(false) }>
                <input type={ "number" } style={ goalErr ? styleError : {} } value={ goal } onChange={ (e) => changeGoal(e.target.value) } />
            </Modal>
        </>
    );
}

const styleError = {
    border: '1px solid red',
    background: 'pink'
}

export default ModuleWorkoutDays;