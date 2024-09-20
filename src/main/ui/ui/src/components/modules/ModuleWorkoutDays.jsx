import '../../styles/Module.css';
import get from "../../services/Get";
import {NavLink} from 'react-router-dom'
import Spinner from "../ui_components/Loader";
import DisplayValue from "./DisplayValue";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMedal} from '@fortawesome/free-solid-svg-icons'
import Graph from "./Graph";
import React, {useEffect, useState} from "react";

const createConfig = (rawdata=[], goal) => {

    const data = rawdata.map(d => d.map(a => a).reverse());

    const datasets = data.map((person, idx) => {
        const yValues = person.map((week) => week.totalWorkouts );
        return {
            label: 'Workouts per week',
            backgroundColor: idx === 0 ? 'rgba(107,166,239,0.1)' : 'rgba(70,131,58,0.1)',
            borderColor: idx === 0 ? 'rgba(107,166,239,0.5)' : 'rgba(70,131,58,0.5)',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
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
            tension: 0.2,
            data: dataset.data.map((workouts, index, arr) => {
                let firstindex = Math.max(0, index-periodLen);
                return arr.slice(firstindex, index).reduce((v1, v2) => v1 + v2, 0) / periodLen;
            })
        }
    });

    const goalLine = {
        type: 'line',
        label: goal.name ? goal.name : "Target",
        fill: false,
        borderColor: "#ffc877",
        borderWidth: 1,
        borderDash: [15, 3],
        data: xLabels.map((x) => goal.weeklyTarget)

    }

    const allDatasets = datasets.concat(trends)

    if (goal.weeklyTarget > 0)
        allDatasets.push(goalLine)


    return {
        goal: goal,
        type: 'bar',
        data: {
            labels: xLabels,
            datasets: allDatasets
        },
        options: {
            layout: {
                padding: {
                    left: -5,
                }
            },
            responsive:true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth < 600 ? 1.2 : 1.2,
            scales: {
                y: {
                    min: 0,
                    max: 7,
                    display: false,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    min: xLabels[xLabels.length - 7],
                    max: xLabels[xLabels.length - 1],
                    grid: {
                        display: false,
                    },
                    ticks: {
                        callback: function(value, index) {
                            const arr = this.getLabelForValue(value).split(" ")
                            return arr[1] === "1" ? [arr[1], arr[0]] : [arr[1], ''];
                        },
                        font: {
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                }
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            plugins: {
                tooltip: {
                    multiKeyBackground: "rgba(0,0,0,0)",
                    usePointStyle: true,
                },
                legend: {
                    display: true,
                    position: "chartArea",
                    align: "start",
                    reverse: true,
                    labels: {
                        filter: function(item, chart) {
                            // Logic to remove a particular legend item goes here
                            return item.text === goal.name || item.text === "Target";
                        },
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
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
    return goal.weeklyTarget > 0 && data && data[0].totalWorkouts >= goal.weeklyTarget;
}

const ModuleWorkoutDays = ({ data=[] }) => {
    const [ chartData, setChartData ] = useState(null);
    const [ goal, setGoal ] = useState({
        weeklyTarget: 0,
        name: "N/A"
    });

    useEffect(() => {
        if (data.length > 0 && (!chartData || chartData.goal != goal))
            setChartData(createConfig(data, goal))
    }, [data, goal])

    useEffect(() => {
        get(`/goal/progress`).then(resp => {
            const mostDifficultGoal = resp.reduce((max, goal) => goal.weeklyTarget <= 7 ? goal.weeklyTarget > max.weeklyTarget ? goal : max : max, goal);
            const tracked = resp.filter(goal => goal.tracked)[0]    
            if (tracked) {
                tracked.name = tracked.name + " (Manually tracked)"
            }
            setGoal(tracked ? tracked : mostDifficultGoal);
        })

    }, [])

    return (
        <>
           { data.length < 1 ? <Spinner /> :
                <>
                    <div className={'primary-content-wrapper'}>
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
                            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                                <div>
                                    <DisplayValue text={ 'My goal' } right={ true }
                                                  value={
                                       <div style={{ textAlign: 'center'}}>
                                          <NavLink to="/goals" style={{ fontSize: '1.5rem', cursor: 'pointer', padding: 0, filter: "drop-shadow(0px 0px 1px black)" }}>
                                              <FontAwesomeIcon icon={ faMedal } style={{color: reachedGoal(goal, data[0]) ? "#ffc877" : "rgba(107,166,239,0.25)" }}/>
                                          </NavLink>
                                       </div>}/>
                                </div>
                            </div>
                        </div>
                        :
                        <div style={{display: "flex"}}>
                            <DisplayValue text={'Avg 1 year'} value={
                                              <>
                                                <span style={{ color: 'rgba(107,166,239,0.35)'}}> { computeAverage(52, data[0]).toFixed(1) }</span>
                                                <span style={{ color: 'rgba(70,131,58,0.35)'}}> { computeAverage(52, data[1]).toFixed(1) }</span>
                                              </>
                                          }/>
                            <DisplayValue text={'Avg 10 weeks'} value={
                                              <>
                                                  <span style={{ color: 'rgba(107,166,239,0.35)'}}> { computeAverage(10, data[0]).toFixed(1) }</span>
                                                  <span style={{ color: 'rgba(70,131,58,0.35)'}}> { computeAverage(10, data[1]).toFixed(1) }</span>
                                              </>
                                          }/>
                            <DisplayValue text={'This week'} value={
                                              <>
                                                  <span style={{ color: 'rgba(107,166,239,0.35)'}}> { data[0][data[0].length - 1].totalWorkouts.toFixed(0) }</span>
                                                  <span style={{ color: 'rgba(70,131,58,0.35)'}}> { data[1][data[1].length - 1].totalWorkouts.toFixed(0) }</span>
                                              </>
                                          }/>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default ModuleWorkoutDays;