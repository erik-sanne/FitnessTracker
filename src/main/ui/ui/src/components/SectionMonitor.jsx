import React, {useEffect, useState} from 'react'
import Module from "./modules/Module";
import Loader from "./ui_components/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Graph from "./modules/Graph";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import get from "../services/Get.jsx";
import preval from 'preval.macro'

const SCRAPE_INTERVAL = 3000
const DATA_POINTS = 150
const Metrics = {
    JVM_MEMORY_USED_BYTES: "jvm_memory_used_bytes",
    JVM_MEMORY_MAX_BYTES: "jvm_memory_max_bytes",
    SERVER_REQUEST_COUNT: "http_server_requests_seconds_count",
    SERVER_REQUEST_SUM: "http_server_requests_seconds_sum",
    SERVER_REQUEST_MAX: "http_server_requests_seconds_max"
}
const Aggs = {
    AVG: "avg",
    SUM: "sum",
    MAX: "max"
}

const SectionMonitor = () => {
    const [ health, setHealth ] = useState('LOADING')
    const [ responseTime, setResponseTime ] = useState(0)
    const [ time, setTime ] = useState(null)
    const [ metrics, setMetrics ] = useState([])
    const [ chartConfigs, setChartConfigs ] = useState({})

    useEffect(() => {
        pollForData();
        const scrapeInterval = setInterval(() => {
            pollForData();
        }, 1000);

        const refreshInterval = setInterval(() => {
            performScrape();
        }, SCRAPE_INTERVAL);

        return () => { clearInterval(scrapeInterval); clearInterval(refreshInterval); }
    }, []);

    useEffect(() => {
        setChartConfigs({
            memory: memoryConfig(metrics),
            serverRequestCounts: serverRequestCountConfig(metrics),
            serverRequestMax: serverRequestMaxConfig(metrics)
        })
    }, [metrics])

    const pollForData = () => {
        const since = new Date().getTime();
        get('/actuator/health').then(health => { setHealth(health.status); setResponseTime( new Date().getTime() - since) }).catch(() => {setHealth('DOWN'); setResponseTime(-1)});
        get('/actuator/metrics/process.uptime').then(time => setTime(time.measurements[0].value));
    }

    const performScrape = () => {
        get('/actuator/prometheus', false, "text/plain").then(scraped => handleScrape(scraped.split('\n').filter(row => !row.startsWith('#'))))
    }

    const handleScrape = (scraped) => {
        const measurement = {}
        measurement['time'] = new Date()
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

        setMetrics((tail) => {
            let arr = [...tail, measurement]
            if (arr.length > DATA_POINTS) {
                arr = arr.slice(arr.length - DATA_POINTS)
            }
            return arr
        })
    }

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "System Info" className={ "health-status" }>
                { health === 'LOADING' ? <h4>Health Status: <Loader animation={"grow"}/></h4> :
                    <>
                        <div className={ 'health-status-table' }>
                            <h4><span>Status:</span><span>{ health === 'UP' ? <FontAwesomeIcon icon={faCheckCircle} style={{color: "green" }}/> : <FontAwesomeIcon icon={faExclamationTriangle} style={{color: "orange" }}/> }</span></h4>
                            <div>
                                <span>API response: </span><span>{ responseTime > 0 && responseTime + " ms"}</span>
                            </div>
                            <div>
                                <span>API uptime: </span><span>{ time && new Date((time * 1000)).toISOString().substr(11, 8) }</span>
                            </div>
                            <div>
                                <span>API build: </span><span>{ time && new Date(new Date() - new Date((time * 1000))).toLocaleString('sv-SE') }</span>
                            </div>
                            <div>
                                <span>UI uptime: </span><span>{ time && new Date(new Date() - new Date(preval`module.exports = new Date()`)).toISOString().substr(11, 8) }</span>
                            </div>
                            <div>
                                <span>UI build: </span><span>{preval`module.exports = new Date().toLocaleString('sv-SE', {timeZone: "Europe/Berlin"});`}</span>
                            </div>
                        </div>
                    </>
                }
            </Module>
            <Module title = "Request rate">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div>
                        <Graph data={ chartConfigs.serverRequestCounts } style={{ margin: '-1em' }}/>
                    </div>
                }
            </Module>
            <Module title = "Reponse time">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div>
                        <Graph data={ chartConfigs.serverRequestMax } style={{ margin: '-1em' }}/>
                    </div>
                }
            </Module>
            <Module title = "JVM Memory Usage">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div>
                        <Graph data={ chartConfigs.memory } style={{ margin: '-1em' }}/>
                    </div>
                }
            </Module>
        </div>
    );
}

const aggMetric = (metrics, agg, metricName, ...conditions) => {
    const timeline = []
    for (let scrape of metrics) {
        var values = []
        const thisMetric = scrape.metrics.filter(metric => metric.metricName === metricName)
        for (let metric of thisMetric) {
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
        let finalValue = 0;
        if (agg === Aggs.SUM) {
            finalValue = values.reduce((a, b) => a + b, 0)
        } else if (agg === Aggs.MAX) {
            finalValue = values.reduce((a, b) => Math.max(a, b), 0)
        } else if (agg === Aggs.AVG) {
            finalValue = values.reduce((a, b) => a + b, 0) / values.length
        }

        timeline.push({time: scrape.time, value: finalValue })
    }
    return timeline;
}

const pad = (metrics) => {
    if (metrics.length < DATA_POINTS) {
        let test = (DATA_POINTS) * SCRAPE_INTERVAL / 1000.0

        let d0 = new Date();
        d0.setSeconds(d0.getSeconds() - test);
        let d1 = metrics.length > 0 ? new Date(metrics[0].time) : new Date();
        d1.setSeconds(d1.getSeconds() - 1)
        if (d0.getTime() < d1.getTime()){
            metrics.unshift({ time: d1, value: 0 })
            metrics.unshift({ time: d0, value: 0 })
        }
    }
    return metrics;
}

const rate = (metrics) => {
    const rated = metrics.map((elem, index) => {
        if (index === 0) {
            return { time: elem.time, value: 0}
        }

        const lastElem = metrics[index - 1]
        const timeDiffInSeconds = (elem.time.getTime() - lastElem.time.getTime()) / 1000.0
        const deltaValue = (elem.value - lastElem.value) / timeDiffInSeconds
        return { time: elem.time, value: deltaValue }
    })
    return rated;
}

const division = (metrics1, metrics2) => {
    const divided = metrics1.map((elem, index) => {
        const other = metrics2[index];
        if (other.value < 0.001) {
            return { time: elem.time, value: 0 }
        }

        return { time: elem.time, value: elem.value / other.value }
    })
    return divided;
}

const memoryConfig = (metrics) => {
    const heapUsage = pad(aggMetric(metrics, Aggs.SUM, Metrics.JVM_MEMORY_USED_BYTES, { "area": "heap" })).map((metric) => { return { x: metric.time, y: (metric.value / 1024 / 1024)}})
    const nonHeapUsage = pad(aggMetric(metrics, Aggs.SUM, Metrics.JVM_MEMORY_USED_BYTES, { "area": "nonheap" })).map((metric) => { return { x: metric.time, y: (metric.value / 1024 / 1024)}})
    const heapMax = pad(aggMetric(metrics, Aggs.SUM, Metrics.JVM_MEMORY_MAX_BYTES, { "area": "heap" })).map((metric) => { return { x: metric.time, y: (metric.value / 1024 / 1024)}})
    const nonHeapMax = pad(aggMetric(metrics, Aggs.SUM, Metrics.JVM_MEMORY_MAX_BYTES, { "area": "nonheap" })).map((metric) => { return { x: metric.time, y: (metric.value / 1024 / 1024)}})
    return {
        type: 'line',
        data: {
            datasets: [
                {
                   label: 'heap',
                   yAxisID: 'Memory',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(23, 105, 138)',
                   backgroundColor: 'rgba(23, 105, 138, 0.3)',
                   lineTension: 0,
                   data: heapUsage
                },
                {
                    label: 'non-heap',
                    yAxisID: 'Memory',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(69, 36, 77)',
                    backgroundColor: 'rgba(69, 36, 77, 0.3)',
                    lineTension: 0,
                    data: nonHeapUsage
                },
                {
                   label: 'max heap',
                   yAxisID: 'Memory',
                   hidden: true,
                   borderDash: [3],
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   fill: false,
                   borderColor: 'rgb(23, 105, 138)',
                   lineTension: 0,
                   data: heapMax
                },
                {
                    label: 'max non-heap',
                    yAxisID: 'Memory',
                    hidden: true,
                    borderDash: [3],
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    fill: false,
                    borderColor: 'rgb(69, 36, 77)',
                    lineTension: 0,
                    data: nonHeapMax
                }
            ]
        },
        options: {
            legend: {
                display: true,
                position: "top",
                align: "end",
                labels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            responsive: true,
            aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
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
                            return `${(value).toFixed(0)}Mb`
                        }
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
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

const serverRequestCountConfig = (metrics) => {
    const getRequests = pad(rate(aggMetric(metrics, Aggs.SUM, Metrics.SERVER_REQUEST_COUNT, { "method": "GET" }))).map((metric) => { return { x: metric.time, y: metric.value}})
    const postRequests = pad(rate(aggMetric(metrics, Aggs.SUM, Metrics.SERVER_REQUEST_COUNT, { "method": "POST" }))).map((metric) => { return { x: metric.time, y: metric.value}})
    return {
        type: 'line',
        data: {
            datasets: [
                {
                   label: 'GET',
                   yAxisID: 'Requests',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(23, 105, 138)',
                   lineTension: 0,
                   fill: false,
                   data: getRequests
                },
                {
                    label: 'POST',
                    yAxisID: 'Requests',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(69, 36, 77)',
                    lineTension: 0,
                    fill: false,
                    data: postRequests
                }
            ]
        },
        options: {
            legend: {
                display: true,
                position: "top",
                align: "end",
                labels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            responsive: true,
            aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                yAxes: [{
                    id: 'Requests',
                    ticks: {
                        min: 0,
                        callback: function(value, index, values) {
                            return `${(value)}rps`
                        }
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
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

const serverRequestMaxConfig = (metrics) => {
    const maxGetRequests = pad(aggMetric(metrics, Aggs.MAX, Metrics.SERVER_REQUEST_MAX, { "method": "GET" })).map((metric) => { return { x: metric.time, y: metric.value * 1000}})
    const maxPostRequests = pad(aggMetric(metrics, Aggs.MAX, Metrics.SERVER_REQUEST_MAX, { "method": "POST" })).map((metric) => { return { x: metric.time, y: metric.value * 1000}})
    const avgGetRequests = pad(division(rate(aggMetric(metrics, Aggs.SUM, Metrics.SERVER_REQUEST_SUM, { "method": "GET" })), rate(aggMetric(metrics, Aggs.SUM, Metrics.SERVER_REQUEST_COUNT, { "method": "GET" })))).map((metric) => { return { x: metric.time, y: metric.value * 1000}})
    const avgPostRequests = pad(division(rate(aggMetric(metrics, Aggs.SUM, Metrics.SERVER_REQUEST_SUM, { "method": "POST" })), rate(aggMetric(metrics, Aggs.SUM, Metrics.SERVER_REQUEST_COUNT, { "method": "POST" })))).map((metric) => { return { x: metric.time, y: metric.value * 1000}})

    return {
        type: 'line',
        data: {
            datasets: [
                {
                   label: 'GET Max',
                   yAxisID: 'Requests',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgba(23, 105, 138, 0.5)',
                   lineTension: 0,
                   borderDash: [3],
                   fill: false,
                   data: maxGetRequests
                },
                {
                    label: 'POST Max',
                    yAxisID: 'Requests',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgba(69, 36, 77, 0.5)',
                    lineTension: 0,
                    borderDash: [3],
                    fill: false,
                    data: maxPostRequests
                },
                {
                    label: 'GET Avg',
                    yAxisID: 'Requests',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(23, 105, 138)',
                    lineTension: 0,
                    fill: false,
                    data: avgGetRequests
                },
                {
                    label: 'POST Avg',
                    yAxisID: 'Requests',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(69, 36, 77)',
                    lineTension: 0,
                    fill: false,
                    data: avgPostRequests
                }
            ]
        },
        options: {
            legend: {
                display: true,
                position: "top",
                align: "end",
                labels: {
                    fontSize: 12,
                    fontFamily: 'Quicksand',
                    fontStyle: 'bold'
                }
            },
            responsive: true,
            aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                yAxes: [{
                    id: 'Requests',
                    ticks: {
                        min: 0,
                        callback: function(value, index, values) {
                            return `${(value)}ms`
                        }
                    }
                }],
                xAxes: [{
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
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

export default SectionMonitor;