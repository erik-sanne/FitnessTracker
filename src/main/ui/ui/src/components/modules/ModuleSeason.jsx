import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import useFetch from "../../services/useFetch";
import Loader from "../ui_components/Loader";
import Graph from "./Graph";
import {faStar, faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProfileDisplay from "../ui_components/ProfileDisplay";

const ModuleSeason = () => {
    const { data: data, loading } = useFetch("/api/current-season")
    const [ chartData, setChartData ] = useState(null)

    useEffect(() => {
        if (chartData == null && data !== null) {
            setChartData(createChartData(data.history))
        }

    }, [data, loading])

    if (loading)
        return <div>
            <Loader />
        </div>

    if (data == null || chartData == null)
        return <div className={ 'leaderboard empty' }>
            <p> No ongoing season </p>
        </div>

    return (
        <div>
            <Graph data={ chartData } />
            <div className={ "leaderboard" }>
                {
                    data.leaderboard.map((row, index) =>
                        <div className={ 'leaderboard-row podium' } key={ index }>
                            <div>
                                <FontAwesomeIcon icon={ faTrophy } className={ 'trophy' } />
                            </div>
                            <div className={ 'spacing' }/>
                            <div>
                                <ProfileDisplay profilePicture={ row.user.profilePicture } displayName={ row.user.displayName } title={ row.user.title }  />
                            </div>
                            <div>
                                <span> <FontAwesomeIcon icon={ faStar } className={ 'score-icon' }/> { row.totalScore } </span>
                            </div>
                        </div>
                    )
                }
                <hr/>
                <div className={ 'leaderboard-row my-position' }>
                    <div>
                        <span> <FontAwesomeIcon icon={ faTrophy } className={ 'trophy' }/> <span className={ 'rank' }>{ data.myScore.position }</span> </span>
                    </div>
                    <div className={ 'spacing' }/>
                    <div>
                        <ProfileDisplay profilePicture={ data.myScore.user.profilePicture } displayName={ data.myScore.user.displayName } title={ data.myScore.user.title } />
                    </div>
                    <div>
                        <span> <FontAwesomeIcon icon={ faStar } className={ 'score-icon' }/> { data.myScore.totalScore } </span>
                    </div>
                </div>
            </div>
        </div>)
}

const createChartData = (data) => {
    let xLabels = data.map(week => week.weekNumber).map(week => String(week).slice(-2));
    let avgScore = data.map(week => week.avgScore);
    let bestScore = data.map(week => week.bestScore);
    let myScore = data.map(week => week.myScore);

    if (xLabels.length < 5) {
        for (let i = 0; i < 5; i++) {
            const newVal = xLabels[0] - 1;
            if (newVal > 1) {
                if (i === 0) {
                    xLabels.unshift(newVal);
                    avgScore.unshift(0);
                    bestScore.unshift(0);
                    myScore.unshift(0);
                } else {
                    xLabels.unshift(newVal);
                    avgScore.unshift(null);
                    bestScore.unshift(null);
                    myScore.unshift(null);
                }
            }
        }
    }

    return {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'Your score',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(61,111,169)',
                    borderWidth: 2,
                    pointRadius: 2,
                    data: myScore
                },
                {
                    label: 'Average',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(81,81,81)',
                    borderWidth: 2,
                    borderDash: [15, 3],
                    pointRadius: 0,
                    data: avgScore
                },
                {
                    label: 'Best',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(81,81,81)',
                    borderWidth: 2,
                    pointRadius: 0,
                    data: bestScore
                }
            ]
        },
        options: {
            interaction: {
                mode: 'index'
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5,
            scales: {
                y: {
                    position: "right",
                    min: 0,
                    ticks: {
                        font: {
                            family: 'Quicksand',
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    min: xLabels[xLabels.length - 7],
                    max: xLabels[xLabels.length - 1],
                    ticks: {
                        autoSkip: false,
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
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
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

export default ModuleSeason;