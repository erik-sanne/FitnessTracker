import React, {useEffect, useState} from 'react'
import Module from "./modules/Module";
import Loader from "./ui_components/Loader";
import {faUserShield} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Graph from "./modules/Graph";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import get from "../services/Get.jsx";
import preval from 'preval.macro'

const SectionMonitor = () => {
    const [ health, setHealth ] = useState('LOADING')
    const [ time, setTime ] = useState(null)
    const [ cpu, setCpu ] = useState(new Array(100).fill(''))
    const [ memory, setMemory ] = useState(new Array(100).fill(''))

    useEffect(() => {
        const interval = setInterval(() => {
            pollForData();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const pollForData = () => {
        get('/actuator/health').then(health => setHealth(health.status)).catch(() => setHealth('DOWN'));
        get('/actuator/metrics/process.uptime').then(time => setTime(time.measurements[0].value));
        get('/actuator/metrics/process.cpu.usage').then(clock => setCpu(([_, ...tail]) => [...tail, {time: timestamp(), value: clock.measurements[0].value}]))
        get('/actuator/metrics/jvm.memory.used').then(mem => setMemory(([_, ...tail]) => [...tail, {time: timestamp(), value: mem.measurements[0].value}]));
    }

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "System Health">
                <span style={{
                    position: 'absolute',
                    right: 'min(4vw, 32px)',
                    top: 'min(3.5vw, 32px)',
                    fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                    color: 'rgb(61 65 72)'
                }}>
                    Mod <FontAwesomeIcon icon={ faUserShield }/>
                </span>

                { health === 'LOADING' ? <h4>Health Status: <Loader animation={"grow"}/></h4> :
                    <>
                        <>
                            <h4>Status:</h4>
                            <div>
                                <span>UI build time: </span><span>{preval`module.exports = new Date().toLocaleString('sv-SE', {timeZone: "Europe/Berlin"});`}. (Uptime: { time && new Date(new Date() - new Date(preval`module.exports = new Date()`)).toISOString().substr(11, 8) }).</span>
                            </div>
                            <div>
                                <span>Last API deploy: </span><span>{ time && new Date(new Date() - new Date((time * 1000))).toLocaleString('sv-SE') }. (Uptime: { time && new Date((time * 1000)).toISOString().substr(11, 8) })</span>
                            </div>
                            <div>
                                <span>API health check: </span><span>{ health === 'UP' ? <FontAwesomeIcon icon={faCheckCircle} style={{color: "green" }}/> : <FontAwesomeIcon icon={faExclamationTriangle} style={{color: "orange" }}/> }</span>
                            </div>
                        </>
                    </>
                }
            </Module>
            <Module title = "Performance monitor">
                <span style={{
                    position: 'absolute',
                    right: 'min(4vw, 32px)',
                    top: 'min(3.5vw, 32px)',
                    fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                    color: 'rgb(61 65 72)'
                }}>
                    Mod <FontAwesomeIcon icon={ faUserShield }/>
                </span>

                { health === 'LOADING' ? <h4><Loader animation={"grow"}/></h4> :
                    <>
                        <Graph data={ createConfig(cpu, memory) }/>
                    </>
                }
            </Module>
        </div>
    );
}

const createConfig = (cpu, memory) => {
    const linespace = cpu.map((e) => e.time);
    return {
        type: 'line',
        data: {
            labels: linespace,
            datasets: [{
                label: 'CPU Usage',
                yAxisID: 'CPU',
                borderWidth: 2,
                backgroundColor: 'rgb(146,20,20)',
                data: cpu.map((e) => e.value)
            },{
                label: 'JVM Memory Used',
                yAxisID: 'MEM',
                fill: false,
                borderDash: [3],
                borderWidth: 2,
                borderColor: 'rgb(112,20,146)',
                data: memory.map((e) => e.value)
            }]
        },
        options: {
            legend: {
                display: true
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            scales: {
                yAxes: [{
                    id: 'CPU',
                    ticks: {
                        max: 1,
                        callback: function(value, index, values) {
                            return `${(value * 100).toFixed(0)}%`
                        }
                    }
                },{
                    id: 'MEM',
                    position: 'right',
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value / 1024 / 1024).toFixed(1)}Mb`
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: linespace[linespace.length - 100],
                        max: linespace[linespace.length - 1],
                        callback: function(value, index, values) {
                            return value ? value : '';
                        }
                    }
                }]
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: false,
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

const timestamp = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

export default SectionMonitor;