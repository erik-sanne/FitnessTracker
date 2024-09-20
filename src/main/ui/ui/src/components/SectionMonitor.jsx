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
    PROCESS_CPU_USAGE: "process_cpu_usage",
    JVM_MEMORY_USED_BYTES: "jvm_memory_used_bytes",
    JVM_MEMORY_MAX_BYTES: "jvm_memory_max_bytes",
    SERVER_REQUEST_COUNT: "http_server_requests_seconds_count",
    SERVER_REQUEST_SUM: "http_server_requests_seconds_sum",
    SERVER_REQUEST_MAX: "http_server_requests_seconds_max",
    DB_INVOCATIONS_SUM: "spring_data_repository_invocations_seconds_sum",
    DB_INVOCATIONS_COUNT: "spring_data_repository_invocations_seconds_count",
    GC_PAUSE_COUNT: "jvm_gc_pause_seconds_count",
    GC_PAUSE_SUM: "jvm_gc_pause_seconds_sum",
    LOGBACK_EVENTS: "logback_events_total",
    JVM_THREAD_STATES: "jvm_threads_states_threads"
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
    const [ clientInfo, setClientInfo ] = useState({})

    useEffect(() => {
        setClientInfo(createClientInfo(window))
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
            cpu: cpuConfig(metrics),
            serverRequestCounts: serverRequestCountConfig(metrics),
            serverRequestMax: serverRequestMaxConfig(metrics),
            dbInvocations: dbInvocationsConfig(metrics),
            gcPause: gcPauseConfig(metrics),
            logbackEvents: logbackEventsConfig(metrics),
            jvmThreadStates: jvmThreadStatesConfig(metrics)
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
                    <div className={ 'health-status-table-wrapper' }>
                        <div className={ 'health-status-table' }>
                            <h4>API</h4>
                            <div>
                                <span>Last Restart: </span><span>{ time && new Date(new Date() - new Date((time * 1000))).toLocaleString('sv-SE') }</span>
                            </div>
                            <div>
                                <span>Uptime: </span><span>{ time && new Date((time * 1000)).toISOString().substr(11, 8) }</span>
                            </div>
                            <div><p /></div>
                            <div>
                                <span>Response time: </span><span>{ responseTime > 0 && responseTime + " ms"}</span>
                            </div>
                            <div>
                                <span>Health check:</span><span>{ health === 'UP' ? <FontAwesomeIcon icon={faCheckCircle} style={{color: "green" }}/> : <FontAwesomeIcon icon={faExclamationTriangle} style={{color: "orange" }}/> }</span>
                            </div>
                        </div>
                        <div className={ 'health-status-table' }>
                            <h4>Client</h4>
                            <div>
                                <span>Built at: </span><span>{preval`module.exports = new Date().toLocaleString('sv-SE', {timeZone: "Europe/Berlin"});`}</span>
                            </div>
                            <div>
                                <span>Uptime: </span><span>{ time && new Date(new Date() - new Date(preval`module.exports = new Date()`)).toISOString().substr(11, 8) }</span>
                            </div>
                            <div><p /></div>
                            <div>
                                <span>OS: </span><span>{ clientInfo.os } { clientInfo.osVersion }</span>
                            </div>
                            <div>
                                <span>Browser: </span><span>{ clientInfo.browser } { clientInfo.browserMajorVersion } ({clientInfo.browserVersion })</span>
                            </div>
                            <div>
                                <span>Resolution: </span><span>{ clientInfo.screen } { clientInfo.mobile ? "(mobile)" : "" } </span>
                            </div>
                        </div>
                    </div>
                }
            </Module>
            <Module title = "Errors & Warnings" className={ "health-status" }>
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.logbackEvents } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
            <Module title = "Reponse time">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.serverRequestMax } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
            <Module title = "Request rate">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.serverRequestCounts } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
            <Module title = "CPU Usage">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.cpu } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
            <Module title = "JVM Memory Usage">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.memory } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
            <Module title = "GC Pause">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.gcPause } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
            <Module title = "Thread States">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.jvmThreadStates } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
            <Module title = "Database IO">
                { metrics.length === 0 ? <h4><Loader animation={"grow"}/></h4> :
                    <div className={ 'primary-content-wrapper' }>
                        <Graph data={ chartConfigs.dbInvocations } style={{ height: '300px'}} />
                    </div>
                }
            </Module>
        </div>
    );
}

const getLabelValues = (metrics, metricName, ...labels) => {
    const res = []
    for (let scrape of metrics) {
        const thisMetric = scrape.metrics.filter(metric => metric.metricName === metricName)

        for (let metric of thisMetric) {
            const comb = {}
            for (let label of labels) {
                const labelValue = metric[label]
                comb[label] = labelValue
            }
            const exists = res.filter(a => {
               for (const label of labels) {
                    if (comb[label] !== a[label]) {
                        return false
                    }
               }
               return true
            }).length > 0;

            if (!exists) {
                res.push(comb)
            }
        }
    }
    return res;
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
                   label: 'Heap',
                   yAxisID: 'y',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(23, 105, 138)',
                   backgroundColor: 'rgba(23, 105, 138, 0.3)',
                   tension: 0,
                   data: heapUsage
                },
                {
                    label: 'Non-heap',
                    yAxisID: 'y',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(69, 36, 77)',
                    backgroundColor: 'rgba(69, 36, 77, 0.3)',
                    tension: 0,
                    data: nonHeapUsage
                },
                {
                   label: 'Max Heap',
                   yAxisID: 'y',
                   hidden: true,
                   borderDash: [3],
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   fill: false,
                   borderColor: 'rgb(23, 105, 138)',
                   tension: 0,
                   data: heapMax
                },
                {
                    label: 'Max Non-heap',
                    yAxisID: 'y',
                    hidden: true,
                    borderDash: [3],
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    fill: false,
                    borderColor: 'rgb(69, 36, 77)',
                    tension: 0,
                    data: nonHeapMax
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value).toFixed(0)}Mb`
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
                }
            }
        }
    }
}

const cpuConfig = (metrics) => {
    const heapUsage = pad(aggMetric(metrics, Aggs.SUM, Metrics.PROCESS_CPU_USAGE)).map((metric) => { return { x: metric.time, y: (metric.value * 100)}})
    return {
        type: 'line',
        data: {
            datasets: [
                {
                   label: 'CPU Usage',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(105, 138, 32)',
                   backgroundColor: 'rgba(105, 138, 32, 0.3)',
                   tension: 0,
                   data: heapUsage
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value).toFixed(0)}%`
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
                }
            }
        }
    }
}

const getColor = (idx) => {
    if (idx === 0) {
        return 'rgb(138, 105, 32)'
    } else if (idx === 1) {
        return 'rgb(105, 138, 32)'
    } else if (idx === 2) {
        return 'rgb(138, 32, 105)'
    } else if (idx === 3) {
        return 'rgb(32, 138, 105)'
    } else if (idx === 4) {
        return 'rgb(32, 105, 138)'
    } else if (idx === 5) {
        return 'rgb(105, 32, 138)'
    }
}

const gcPauseConfig = (metrics) => {
    const combinations = getLabelValues(metrics, Metrics.GC_PAUSE_COUNT, "cause", "gc")

    if (combinations === 0)
        return

    const datasets = combinations.map((comb, idx) => {
        const cause = comb["cause"]
        const gc = comb["gc"]
        const avgGCPause = pad(
                    division(
                        rate(aggMetric(metrics, Aggs.SUM, Metrics.GC_PAUSE_SUM, { "cause": cause }, { "gc": gc })),
                        rate(aggMetric(metrics, Aggs.SUM, Metrics.GC_PAUSE_COUNT, { "cause": cause }, { "gc": gc }))
                    )
                ).map((metric) => { return { x: metric.time, y: (metric.value * 1000)}})
        return {
                   label: cause + ", " + gc,
                   yAxisID: 'GC',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: window.innerWidth < 600 ? 1 : 2,
                   barThickness: window.innerWidth < 600 ? 1 : 2,
                   showLine: false,
                   borderColor: getColor(idx),
                   tension: 0,
                   data: avgGCPause
                }
    })

    return {
        type: 'bar',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                GC: {
                    id: 'GC',
                    position: 'left',
                    min: 0,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value)}ms`
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "chartArea",
                    align: "start",
                    reverse: false,
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
                }
            }
        }
    }
}

const dbInvocationsConfig = (metrics) => {
    const dbLatency = pad(
            division(
                rate(aggMetric(metrics, Aggs.SUM, Metrics.DB_INVOCATIONS_SUM)),
                rate(aggMetric(metrics, Aggs.SUM, Metrics.DB_INVOCATIONS_COUNT))
            )
        ).map((metric) => { return { x: metric.time, y: (metric.value * 1000)}})

    const dbIO = pad(
                rate(aggMetric(metrics, Aggs.SUM, Metrics.DB_INVOCATIONS_COUNT))
        ).map((metric) => { return { x: metric.time, y: (metric.value)}})

    return {
        type: 'line',
        data: {
            datasets: [
                {
                   label: 'Avg latency',
                   yAxisID: 'DBLatency',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(23, 105, 138)',
                   tension: 0,
                   fill: false,
                   data: dbLatency
                },
                {
                   label: 'Invocations',
                   yAxisID: 'DBIO',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(69, 36, 77)',
                   tension: 0,
                   fill: false,
                   data: dbIO
                }
            ]
        },
        options: {
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
                DBLatency: {
                    id: 'DBLatency',
                    position: 'left',
                    min: 0,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value)}ms`
                        }
                    }
                },
                DBIO: {
                      id: 'DBIO',
                      position: 'right',
                      min: 0,
                      ticks: {
                          callback: function(value, index, values) {
                              return `${(value).toFixed(0)}iops`
                          }
                      }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
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
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(23, 105, 138)',
                   tension: 0,
                   fill: false,
                   data: getRequests
                },
                {
                    label: 'POST',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(69, 36, 77)',
                    tension: 0,
                    fill: false,
                    data: postRequests
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value)}rps`
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
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
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgba(23, 105, 138, 0.5)',
                   tension: 0,
                   borderDash: [3],
                   fill: false,
                   data: maxGetRequests
                },
                {
                    label: 'POST Max',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgba(69, 36, 77, 0.5)',
                    tension: 0,
                    borderDash: [3],
                    fill: false,
                    data: maxPostRequests
                },
                {
                    label: 'GET Avg',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(23, 105, 138)',
                    tension: 0,
                    fill: false,
                    data: avgGetRequests
                },
                {
                    label: 'POST Avg',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(69, 36, 77)',
                    tension: 0,
                    fill: false,
                    data: avgPostRequests
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value)}ms`
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
                }
            }
        }
    }
}

const logbackEventsConfig = (metrics) => {
    const errors = pad(rate(aggMetric(metrics, Aggs.SUM, Metrics.LOGBACK_EVENTS, { "level": "error" }))).map((metric) => { return { x: metric.time, y: metric.value}})
    const warnings = pad(rate(aggMetric(metrics, Aggs.SUM, Metrics.LOGBACK_EVENTS, { "level": "warn" }))).map((metric) => { return { x: metric.time, y: metric.value}})
    return {
        type: 'line',
        data: {
            datasets: [
                {
                   label: 'Errors',
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: 'rgb(128, 0, 0)',
                   tension: 0,
                   fill: false,
                   data: errors
                },
                {
                    label: 'Warnings',
                    borderWidth: window.innerWidth < 600 ? 1 : 2,
                    pointRadius: 0,
                    borderColor: 'rgb(179, 71, 0)',
                    tension: 0,
                    fill: false,
                    data: warnings
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth > 1900 ? 8 : window.innerWidth < 600 ? 2 : window.innerWidth < 900 ? 4 : 6,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    min: 0,
                    stepSize: 1,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value)}`
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
                }
            }
        }
    }
}

const jvmThreadStatesConfig = (metrics) => {
    const combinations = getLabelValues(metrics, Metrics.JVM_THREAD_STATES, "state")

    if (combinations === 0)
        return

    const datasets = combinations.map((comb, idx) => {
        const state = comb["state"]
        const threadStates = pad(
           aggMetric(metrics, Aggs.SUM, Metrics.JVM_THREAD_STATES, { "state": state })
        ).map((metric) => { return { x: metric.time, y: (metric.value)}})
        return {
                   label: state.charAt(0).toUpperCase() + state.slice(1),
                   borderWidth: window.innerWidth < 600 ? 1 : 2,
                   pointRadius: 0,
                   borderColor: getColor(idx),
                   tension: 0,
                   borderDash: [1],
                   fill: false,
                   data: threadStates
                }
    })

    return {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth > 1900 ? 2 : window.innerWidth < 600 ? 1.5 : 2.5,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        callback: function(value, index, values) {
                            return `${(value).toFixed(0)}`
                        }
                    }
                },
                x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                          millisecond: 'HH:mm:ss',
                          second: 'HH:mm:ss',
                          minute: 'HH:mm',
                          hour: 'HH'
                      }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    align: "end",
                    labels: {
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
                        enabled: false,
                        mode: 'x'
                    },
                }
            }
        }
    }
}

const createClientInfo = (window) => {
    var unknown = '-';

    // screen
    var screenSize = '';
    let screen = window.screen;
    let width, height;
    if (screen.width) {
        width = (screen.width) ? screen.width : '';
        height = (screen.height) ? screen.height : '';
        screenSize += '' + width + " x " + height;
    }

    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(nVer);
    var nameOffset, verOffset, ix;

    // Yandex Browser
    if ((verOffset = nAgt.indexOf('YaBrowser')) !== -1) {
        browser = 'Yandex';
        version = nAgt.substring(verOffset + 10);
    }
    // Samsung Browser
    else if ((verOffset = nAgt.indexOf('SamsungBrowser')) !== -1) {
        browser = 'Samsung';
        version = nAgt.substring(verOffset + 15);
    }
    // UC Browser
    else if ((verOffset = nAgt.indexOf('UCBrowser')) !== -1) {
        browser = 'UC Browser';
        version = nAgt.substring(verOffset + 10);
    }
    // Opera Next
    else if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 4);
    }
    // Opera
    else if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Legacy Edge
    else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
        browser = 'Microsoft Legacy Edge';
        version = nAgt.substring(verOffset + 5);
    }
    // Edge (Chromium)
    else if ((verOffset = nAgt.indexOf('Edg')) !== -1) {
        browser = 'Microsoft Edge';
        version = nAgt.substring(verOffset + 4);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') !== -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() === browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

    let majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(nVer);
        majorVersion = parseInt(nVer, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // cookie
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') !== -1) ? true : false;
    }

    // system
    var os = unknown;
    var clientStrings = [
        {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 3.11', r:/Win16/},
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Chrome OS', r:/CrOS/},
        {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    var osVersion = "unknown";

    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    }

    switch (os) {
        case 'Mac OS':
        case 'Mac OS X':
        case 'Android':
            osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([._\d]+)/.exec(nAgt)[1];
            break;

        case 'iOS':
            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
            break;
    }

    return {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled
    };
}

export default SectionMonitor;