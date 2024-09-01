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

const SCRAPE_INTERVAL = 10000
const DATA_POINTS = 50
const Metrics = {
    JVM_MEMORY_USED_BYTES: "jvm_memory_used_bytes",
    JVM_MEMORY_MAX_BYTES: "jvm_memory_max_bytes",
}

const SectionMonitor = () => {
    const [ health, setHealth ] = useState('LOADING')
    const [ time, setTime ] = useState(null)
    const [ metrics, setMetrics ] = useState([])

    useEffect(() => {
        pollForData();
        const interval = setInterval(() => {
            pollForData();
        }, SCRAPE_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    const pollForData = () => {
        get('/actuator/health').then(health => setHealth(health.status)).catch(() => setHealth('DOWN'));
        get('/actuator/metrics/process.uptime').then(time => setTime(time.measurements[0].value));
        get('/actuator/prometheus', false, "text/plain").then(scraped => handleScrape(scraped.split('\n').filter(row => !row.startsWith('#'))))
    }

    const handleScrape = (scraped) => {
        const measurement = {}
        measurement['time'] = timestamp()
        measurement['metrics'] = []

        for (let row of scraped) {
            const metric = {}

            if (row.indexOf("{") === -1) {
                metric['metricName'] = row.split(" ")[0]
                metric['value'] = parseFloat(row.split(" ")[1])
                measurement['metrics'].push(metric)
                continue;
            }


            metric['metricName'] = row.split('{')[0]
            metric['value'] = parseFloat(row.split('}')[1])
            const labelstrings = row.substring(row.indexOf("{") + 1, row.lastIndexOf("}")).split(",");
            for (let kv of labelstrings) {
                const [ key, value ] = kv.split("=")
                metric[key] = value.replaceAll("\"", "")
            }
            measurement['metrics'].push(metric)
        }

        const metricsToKeep = []
        for (const [, value] of Object.entries(Metrics)) {
            metricsToKeep.push(value)
        }
        measurement.metrics = measurement.metrics.filter(metric => metricsToKeep.includes(metric.metricName))

        setMetrics((tail) => [...tail, measurement])
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
                        <Graph data={ memoryConfig(metrics) }/>
                    </>
                }
            </Module>
        </div>
    );
}

const sumMetric = (metrics, metricName, ...conditions) => {
    const timeline = []
    for (let scrape of metrics) {
        var values = []
        for (let metric of scrape.metrics.filter(metric => metric.metricName === metricName)) {
            var keep = true
            for (let condition of conditions) {
                const key = Object.keys(condition)[0]
                if (metric[key] !== condition[key]) {
                    keep = false
                    break;
                }
            }

            if (keep && metric.value >= 0) {
                values.push(metric.value)
            }
        }
        timeline.push({time: scrape.time, value: values.reduce((a, b) => a + b, 0)})
    }

    if (timeline.length > DATA_POINTS) {
        timeline.shift()
    }

    while (timeline.length < DATA_POINTS) {
        timeline.unshift({time: null, value: null})
    }

    return timeline;
}


const memoryConfig = (metrics) => {
    const linespace = metrics.map((e) => e.time);
    if (linespace.length > DATA_POINTS) {
        linespace.shift()
    }

    while (linespace.length < DATA_POINTS) {
        linespace.unshift(null)
    }
    const heapUsage = sumMetric(metrics, Metrics.JVM_MEMORY_USED_BYTES, { "area": "heap" }).map(metric => (metric.value / 1024 / 1024).toFixed(1))
    const nonHeapUsage = sumMetric(metrics, Metrics.JVM_MEMORY_USED_BYTES, { "area": "nonheap" }).map(metric => (metric.value / 1024 / 1024).toFixed(1))
    const heapMax = sumMetric(metrics, Metrics.JVM_MEMORY_MAX_BYTES, { "area": "heap" }).map(metric => (metric.value / 1024 / 1024).toFixed(1))
    const nonHeapMax = sumMetric(metrics, Metrics.JVM_MEMORY_MAX_BYTES, { "area": "nonheap" }).map(metric => (metric.value / 1024 / 1024).toFixed(1))
    return {
        type: 'line',
        data: {
            labels: linespace,
            datasets: [
                {
                   label: 'usage heap',
                   yAxisID: 'Memory',
                   borderWidth: 2,
                   pointRadius: 2,
                   backgroundColor: 'rgb(23, 105, 138)',
                   data: heapUsage
                },
                {
                    label: 'usage non-heap',
                    yAxisID: 'Memory',
                    borderWidth: 2,
                    pointRadius: 2,
                    backgroundColor: 'rgb(69, 36, 77)',
                    data: nonHeapUsage
                },
                {
                   label: 'max heap',
                   yAxisID: 'Memory',
                   hidden: true,
                   borderDash: [3],
                   borderWidth: 2,
                   pointRadius: 2,
                   fill: false,
                   borderColor: 'rgb(23, 105, 138)',
                   data: heapMax
                },
                {
                    label: 'max non-heap',
                    yAxisID: 'Memory',
                    hidden: true,
                    borderDash: [3],
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: false,
                    borderColor: 'rgb(69, 36, 77)',
                    data: nonHeapMax
                }
            ]
        },
        options: {
            legend: {
                display: true,
                position: "chartArea",
                align: "center",
                reverse: true,
                labels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            responsive: true,
            aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                yAxes: [{
                    id: 'Memory',
                    ticks: {
                        min: 0,
                        callback: function(value, index, values) {
                            return `${(value).toFixed(1)}Mb`
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
    const hh = `${now.getHours()}`.padStart(2, '0')
    const mm = `${now.getMinutes()}`.padStart(2, '0')
    const ss = `${now.getSeconds()}`.padStart(2, '0')
    return `${hh}:${mm}:${ss}`;
}

export default SectionMonitor;