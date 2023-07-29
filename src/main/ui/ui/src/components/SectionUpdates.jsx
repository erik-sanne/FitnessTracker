import React, {useEffect, useState} from 'react'
import Module from "./modules/Module";
import Loader from "./ui_components/Loader";
import ListRow from "./ui_components/ListRow";
import get from "../services/Get";
import Graph from "./modules/Graph";

const SectionUpdates = () => {

    const PAGE_SIZE = 30;

    const FetchStatus = {
        NONE: 0, LOADING: 1, MAX_REACHED: 2
    }

    const [ commits, setCommits ] = useState([]);
    const [ chartData, setChartData ] = useState(null);
    const [ fetchStatus, setFetchStatus ] = useState(FetchStatus.NONE);


    useEffect(() => {
        getCommits();
        getCodeFrequency();
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [commits, fetchStatus])


    const handleScroll = () => {
        const isBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (isBottom) {
            getCommits();
        }
    }

    const getCommits = () => {
        if (fetchStatus !== FetchStatus.NONE)
            return;

        setFetchStatus(FetchStatus.LOADING)

        const page = Math.floor(commits.length / PAGE_SIZE) + 1;
        get(`https://api.github.com/repos/erik-sanne/FitnessTracker/commits?per_page=${PAGE_SIZE}&page=${page}`, true).then(resp => {
            const newState = [...commits, ...resp]
            setCommits(newState);
            if (Math.floor(newState.length / PAGE_SIZE) + 1 === page) {
                setFetchStatus(FetchStatus.MAX_REACHED);
            } else {
                setFetchStatus(FetchStatus.NONE);
            }
        })
    }

    const getCodeFrequency = () => {

        if (chartData)
            return;

        get(`https://api.github.com/repos/erik-sanne/FitnessTracker/stats/code_frequency`, true).then(resp => {
            if (Array.isArray(resp)) {
                setChartData(createConfig(resp))
                return
            }

            setTimeout(() => getCodeFrequency(), 5000)
        })
    }

    const createConfig = (data) => {

        const xLabels = data.map(point => point[0] * 1000)

        let total = 0;
        const acc = []
        for (let i = 0; i < data.length; i++) {
            total += (data[i][1] + data[i][2])
            acc.push(total)
        }

        const datasets = [{
            type: 'line',
            label: 'Additions',
            yAxisID: 'delta',
            backgroundColor: 'rgba(26,167,0,0.2)',
            borderColor: 'rgb(26,167,0)',
            borderWidth: 1,
            data: data.map(point => point[1])
        },{
            type: 'line',
            label: 'Deletions',
            yAxisID: 'delta',
            backgroundColor: 'rgba(169,0,0,0.2)',
            borderColor: 'rgb(169,0,0)',
            borderWidth: 1,
            data: data.map(point => -point[2])
        },{
            type: 'line',
            label: 'Size of code base',
            yAxisID: 'acc',
            backgroundColor: 'rgba(203,167,0,0.2)',
            borderColor: 'rgb(203,167,0)',
            borderWidth: 1,
            data: acc
        }]

        return {
            type: 'line',
            data: {
                labels: xLabels,
                datasets: datasets
            },
            options: {
                legend: {
                    display: true
                },
                tooltips: {
                    enabled: true
                },
                responsive: true,
                aspectRatio: window.innerWidth < 600 ? 1.5 : 6.5,
                elements: {
                    point:{
                        radius: 0
                    }
                },
                scales: {
                    yAxes: [{
                        id: "delta",
                        position: 'left',
                        display: true,
                        gridLines: {
                            display: false,
                            tickMarkLength: 0,
                        },
                        ticks: {
                            fontSize: 12,
                            fontFamily: 'Quicksand',
                            fontStyle: 'bold',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Rows / week'
                        }
                    }, {
                        id: "acc",
                        position: 'right',
                        display: true,
                        gridLines: {
                            display: false,
                            tickMarkLength: 0,
                        },
                        ticks: {
                            fontSize: 12,
                            fontFamily: 'Quicksand',
                            fontStyle: 'bold',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Rows total'
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        },
                        gridLines: {
                            display: false,
                            tickMarkLength: 0,
                        },
                        ticks: {
                            fontSize: 12,
                            fontFamily: 'Quicksand',
                            fontStyle: 'bold',
                        }
                    }]
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: false
                        },
                        zoom: {
                            enabled: false
                        }
                    }
                }
            }
        }
    }

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "Changelog">
                {
                    chartData ? <Graph data={ chartData } /> :<p>Fetching statistics... <Loader /></p>
                }
                { commits.length > 0 && commits.map((obj, idx) =>
                        <ListRow onClick={ () => { window.open(obj.html_url, '_blank') }} key={idx}>
                            <div>
                                <p style={dateStyle}>{ obj.commit.author.date.split('T')[0] }</p>
                                <p style={paragraphStyle}>{ capitalize(obj.commit.message) }</p>
                                <p style={{...paragraphStyle, color: '#aaa'}}>{ capitalize(obj.sha) }</p>
                            </div>
                        </ListRow>
                    )
                }
                { fetchStatus === FetchStatus.MAX_REACHED ? <p style={maxReachedStyle}> End of history </p> : fetchStatus === FetchStatus.LOADING ? <Loader /> : '' }
            </Module>
        </div>
    );
}

const maxReachedStyle = {
    textAlign: 'center',
    color: '#555',
    padding: '1em',
    margin: '0',
}

const paragraphStyle = {
    margin: '0px',
    paddingLeft: '0rem'
}

const dateStyle = {
    margin: '0.5rem 0'
}

export default SectionUpdates;