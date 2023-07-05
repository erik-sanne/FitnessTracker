import '../../styles/Module.css';
import Spinner from "../ui_components/Loader";
import DisplayValue from "./DisplayValue";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMedal} from '@fortawesome/free-solid-svg-icons'
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import Modal from "../ui_components/Modal";

const createConfig = (rawdata=[], goal=0) => {

    const data = rawdata.map(d => d.map(a => a).reverse());

    const datasets = data.map((person, idx) => {
        const yValues = person.map((week) => week.totalWorkouts );
        return {
            label: 'Workouts per week',
            backgroundColor: idx === 0 ? 'rgba(107,166,239,0.1)' : 'rgba(70,131,58,0.1)',
            borderColor: idx === 0 ? 'rgba(107,166,239,0.5)' : 'rgba(70,131,58,0.5)',
            borderWidth: 2,
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

    const trends = datasets.map((dataset, idx) => {
        const periodLen = 5;
        return {
            type: 'line',
            label: 'Trend',
            fill: false,
            backgroundColor: idx === 0 ? 'rgba(107,166,239,0.1)' : 'rgba(70,131,58,0.1)',
            borderColor: idx === 0 ? 'rgba(107,166,239,0.5)' : 'rgba(70,131,58,0.5)',
            borderWidth: 1,
            borderDash: [15, 3],
            data: dataset.data.map((workouts, index, arr) => {
                let firstindex = Math.max(0, index-periodLen);
                return arr.slice(firstindex, index).reduce((v1, v2) => v1 + v2, 0) / periodLen;
            })
        }
    });

    const goalLine = {
        type: 'line',
        label: 'Target',
        fill: false,
        borderColor: "#ffc877",
        borderWidth: 1,
        borderDash: [15, 3],
        data: xLabels.map((x) => goal)

    }

    const allDatasets = datasets.concat(trends)

    if (goal > 0)
        allDatasets.push(goalLine)


    return {
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: allDatasets
        },
        options: {
            legend: {
                display: false
            },
            layout: {
                padding: {
                    left: -5,
                }
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.2 : 1.2,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 7,
                        stepSize: 1,
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: xLabels[xLabels.length - 7],
                        max: xLabels[xLabels.length - 1],
                        callback: function(value, index, values) {
                            const arr = value.split(" ")
                            return arr[1] === "1" ? [arr[1], arr[0]] : [arr[1], ''];
                        },
                        fontFamily: 'Quicksand',
                        fontStyle: 'bold'
                    }
                }]
            },
            elements: {
                point:{
                    radius: 0
                }
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
    const subarr = data.slice(0, Math.min(numWeeks, data.length));
    const total = subarr.map(e => e.totalWorkouts).reduce((acc, el) => acc + el, 0);
    return total / numWeeks;
}

const reachedGoal = (goal, data) => {
    return data && data[0].totalWorkouts >= goal;
}

const ModuleWorkoutDays = ({ data=[] }) => {
    const LS_KEY_WEEKLY_GOAL = "weekly_goal"
    const [ chartData, setChartData ] = useState(null);
    const [ goal, setGoal ] = useState(localStorage.getItem(LS_KEY_WEEKLY_GOAL) || 3);
    const [ goalErr, setGoalErr ] = useState(false);
    const [ modalVisible, setModalVisible ] = useState(false)

    const changeGoal = (value) => {
        value = parseInt(value);
        if (value < 0 || value > 7) {
            setGoalErr(true)
        } else {
            localStorage.setItem(LS_KEY_WEEKLY_GOAL, value);
            setGoalErr(false)
        }
        setGoal(value)
    }

    useEffect(() => {
        if (data.length > 0 && !chartData)
            setChartData(createConfig(data, goal))
    }, [data, goal])

    useEffect(() => {
        if (data.length > 0)
            setChartData(createConfig(data, goal))
    }, [goal])

    return (
        <>
            { data.length === 1 && <FontAwesomeIcon icon={ faMedal } style={{
                color: reachedGoal(goal, data[0]) ? "#ffc877" : "rgb(61 65 72)",
                position: 'absolute',
                top:'min(4.5vw, 35px)',
                right: 'min(4.5vw, 35px)',
                fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                cursor: 'pointer'
                }}
                onClick={ () => setModalVisible(true) }/>}

            { data.length < 1 ? <Spinner /> :
                <>
                    <div className={'centerC'}>
                        { chartData && <Graph data={ chartData }/> }
                    </div>
                    {data.length < 2 ?
                        <div style={{display: "flex"}}>
                            <DisplayValue text={'Avg 1 year'}
                                          value={data ? computeAverage(52, data[0]).toFixed(1) : "-"}/>
                            <DisplayValue text={'Avg 10 weeks'}
                                          value={data ? computeAverage(10, data[0]).toFixed(1) : "-"}/>
                            <DisplayValue text={'This week'}
                                          value={data ? data[0][0].totalWorkouts.toFixed(0) : "-"}/>
                        </div>
                        :
                        <div style={{display: "flex"}}>
                            <DisplayValue text={'Avg 1 year'}
                                          value={
                                              <>
                                                <span style={{ color: 'rgba(107,166,239,0.35)'}}> { computeAverage(52, data[0]).toFixed(1) }</span>
                                                <span style={{ color: 'rgba(70,131,58,0.35)'}}> { computeAverage(52, data[1]).toFixed(1) }</span>
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
                <i>* Set to 0 to hide target line in graph</i>
                <input type={ "number" } style={ goalErr ? styleError : {} } value={ goal } onChange={ (e) => changeGoal(e.target.value) } />
            </Modal>
        </>
    );
}

const styleError = {
    border: '1px solid red',
    background: 'rgb(240 0 0 / 5%)',
    boxShadow: '0 0 5px inset #840000'
}

export default ModuleWorkoutDays;