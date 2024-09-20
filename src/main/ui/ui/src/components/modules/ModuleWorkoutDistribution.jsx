import '../../styles/Module.css';
import 'chartjs-plugin-zoom' //It says that its not used, but it is
import Spinner from "../ui_components/Loader";
import DisplayValue from "./DisplayValue";
import Graph from "./Graph";
import React, {useEffect, useState} from "react";
import Slider from "@material-ui/core/Slider";
import TextButton from "../ui_components/TextButton";
import body from "../../resources/bodyparts/svg/body.svg";
import SwiperWrapper from "../ui_components/swiper/SwiperWrapper";
import {SwiperSlide} from "swiper/react";

const manualOrderingPass = (data, ppl=false) => {
    if (ppl) {
        return [
            { x: "LEGS", y: (data["GLUTES"] +
                            data["HAMSTRINGS"] +
                            data["QUADS"] +
                            data["CALVES"]) / 4 },
            { x: "PULL", y: (data["TRAPS"] +
                            data["RHOMBOIDS"]+
                            data["LATS"]+
                            data["REAR_DELTS"] +
                            data["BICEPS"]) / 5 },
            { x: "PUSH", y: (data["TRICEPS"] +
                            data["SIDE_DELTS"] +
                            data["FRONT_DELTS"] +
                            data["UPPER_CHEST"] +
                            data["LOWER_CHEST"]) / 5 },
        ].map(it => { it.x = camelCase(it.x); return it;})
    }

    return [
        { x: "CORE", y: data["CORE"]},
        //{ x: "OBLIQUES", y: data["OBLIQUES"] },
        { x: "GLUTES", y: data["GLUTES"] },
        { x: "HAMSTRINGS", y: data["HAMSTRINGS"] },
        { x: "QUADS", y: data["QUADS"] },
        { x: "CALVES", y: data["CALVES"]},
        { x: "TRAPS", y: data["TRAPS"] },
        { x: "RHOMBOIDS", y: data["RHOMBOIDS"] },
        { x: "LATS", y: data["LATS"] },
        { x: "REAR DELTS", y: data["REAR_DELTS"] },
        { x: "BICEPS", y: data["BICEPS"] },
        { x: "TRICEPS", y: data["TRICEPS"] },
        { x: "SIDE DELTS", y: data["SIDE_DELTS"] },
        { x: "FRONT DELTS", y: data["FRONT_DELTS"] },
        { x: "UPPER CHEST", y: data["UPPER_CHEST"] },
        { x: "LOWER CHEST", y: data["LOWER_CHEST"] },
    ].map(it => { it.x = camelCase(it.x); return it;})
};

const createConfig = (data=[], usePPL = false, useBody = false) => {
    const sorted = manualOrderingPass(data[0], usePPL);
    const xLabels = sorted.map( entry => entry.x)

    const datasets = data.map((set, idx) => {
        const sorted = manualOrderingPass(set, usePPL);

        let maxval = 0;
        sorted.forEach(e => { maxval = e.y > maxval ? e.y : maxval });
        const yValues = sorted.map( entry => maxval === 0 ? 0 : entry.y / maxval);
        return {
            label: 'Sets per bodypart',
            backgroundColor: idx === 0 ? 'rgba(107,166,239,0.1)' : 'rgba(70,131,58,0.1)',
            borderColor: idx === 0 ? 'rgba(107,166,239,0.5)' : 'rgba(70,131,58,0.5)',
            data: yValues,
            tension: 0.1,
            borderWidth: useBody ? 1 : 2
        }
    })

    return {
        type: 'radar',
        data: {
            labels: xLabels,
            datasets: datasets
        },
        options: {
            responsive:true,
            maintainAspectRatio: false,
            //aspectRatio: window.innerWidth < 600 ? 1.5 : 1.5,
            scales: {
                r: {
                    max: 1,
                    min: 0,
                    ticks: {
                        display: false,
                    },
                    pointLabels: {
                        font: {
                            size: 12,
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
                    display: false,
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        }
    }
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const calculateImpr = (mapping) => {
    let lowest = 99;
    let str = "";
    mapping.map(({x: name, y: value}) => {
        if (value <= lowest) {
            lowest = value;
            str = name;
        }
        return null;
    })
    let res = str.split('_')[1] || str.split('_')[0];
    return camelCase(res);
}

const bestImprovement = (data) => {
    const mapping = manualOrderingPass(data);
    return calculateImpr(mapping);
}

const bestImprovementMulti = (data) => {
    let merged = {};
    data.forEach(person => {
        person = manualOrderingPass(person);
        person.forEach((ex, idx) => {
            if (!isNaN(ex.y)) {
                if (merged[idx]) {
                    merged[idx].y += ex.y;
                } else
                    merged[idx] = ex;
            }
        })
    });

    return calculateImpr(Object.values(merged));
}

const ModuleWorkoutDistribution = ({ data=[], rangeCallback }) => {
    const LS_KEY_UP = "user_preferences"

    const [ chartData, setChartData ] = useState(null);
    const [ usePPL, setUsePPL ] = useState(false)
    const [ useBody, setUseBody ] = useState(true)
    const [ maxRange, ] = useState(365)
    const [ range, setRange ] = useState([maxRange-30, maxRange]);
    const [ timer, setTimer] = useState(null)
    const [ fullColorManikin, setFullColorManikin ] = useState(false);

    useEffect(() => {
        const userPreferences = JSON.parse(localStorage.getItem(LS_KEY_UP));
        if (userPreferences) {
            setFullColorManikin(userPreferences.fullColorManikin);
        }
    })

    useEffect(() => {
        if (data.length > 1)
            setUseBody(false);

        if (data.length > 0) {
            setChartData(createConfig(data, usePPL, useBody));
        }
    }, [data])

    useEffect(() => {
        if (timer)
            clearTimeout(timer);
        setTimer(setTimeout(() => { submitDates(); }, 250));
    }, [range])

    useEffect(() => {
        if (useBody)
            setUsePPL(false);

        if (data.length > 0) {
            setChartData(createConfig(data, usePPL, useBody));
        }
    }, [usePPL, useBody])

    const valuetext = (value) => {
        let date = new Date();
        date.setDate(date.getDate() - maxRange + value);
        let parts = date.toISOString().split('T')[0].split("-");
        let dateString = `${parts[2]}/${parts[1]}`
        return `${dateString}`;
    }

    const submitDates = () => {
        let from = new Date();
        let to = new Date();
        from.setDate(from.getDate() - maxRange + range[0]);
        to.setDate(to.getDate() - maxRange + range[1]);
        rangeCallback(from, to);
    }

    return (
        <>
            { data.length < 1 || !chartData ? <Spinner /> :
                <>
                    <div className={ 'primary-content-wrapper' }>
                        <SwiperWrapper>
                            <SwiperSlide style={{ background: '#00000030', borderRadius: '1rem 1rem 0 0' }}>
                                <div className={ 'swiper-page' } style={{ width: 'auto' }}>
                                { chartData.data.datasets.map((dataset, index) =>
                                    <div key={index} style={{ position: 'relative', height: '100%' }}>
                                        {
                                            dataset.data.map((val, idx) => {
                                                return <img key={idx} src={getImage(chartData.data.labels[idx])} style={ getImgCss(val, index, fullColorManikin && chartData.data.datasets.length < 2) }/>
                                            })
                                        }
                                        <img src={body} style={imgStyle} />
                                    </div>
                                )}
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className={ 'swiper-page radar' }>
                                    <Graph data={chartData} style={{ padding: '2rem' }}/>
                                </div>
                            </SwiperSlide>
                        </SwiperWrapper>
                    </div>
                    <div style={{display: "flex"}}>
                        { data.length > 1 ?
                            <DisplayValue text={"You could both focus on"} value={ bestImprovementMulti(data) } />
                            :
                            bestImprovement(data[0]) ?
                                <DisplayValue text={"You could focus more on"} value={bestImprovement(data[0])} /> :
                                <DisplayValue text={"No data for this period"} value={ null } />
                        }
                    </div>
                    { data.length > 0 &&  <>
                        <Slider
                            value={range}
                            onChange={(event, val) => setRange([ val[0], val[1] ]) }
                            valueLabelDisplay="auto"
                            valueLabelFormat={valuetext}
                            min={0}
                            max={maxRange}
                            />
                            <div style={{ float: 'right' }}>
                                <TextButton style={{ marginLeft: '0 !important' }} mini onClick={ () => setRange([maxRange - 180, maxRange])}> 180 days </TextButton>
                                <TextButton mini onClick={ () => setRange([maxRange - 90, maxRange])}> 90 days </TextButton>
                                <TextButton mini onClick={ () => setRange([maxRange - 30, maxRange])}> 30 days </TextButton>
                            </div>
                        </>
                    }
                </>
            }
        </>
    );
}

const getImgCss = (val, idx, fullColor) => {
    if (fullColor) {
        return {
            //filter: `hue-rotate(${(1-val)*90}deg) brightness(3) saturate(${(val)*0.5 + 0.5}) drop-shadow(black 0px 0px 1px)`,
            filter: `invert(0.5) sepia(1) contrast(5) hue-rotate(${(val)*120 - 50}deg)  opacity(0.9) drop-shadow(black 0px 0px 1px)`,
            position: 'absolute',
            top: 0,
            left: 0
        }
    }
    return {
        //filter: `opacity(${val}) invert(1) hue-rotate(50deg) drop-shadow(black 0px 0px 1px) `,
        filter: `invert(0.5) sepia(1) contrast(2) hue-rotate(${ idx === 0 ? '160deg' : '80deg'}) opacity(${(val)}) drop-shadow(black 0px 0px 1px)`,
        position: 'absolute',
        top: 0,
        left: 0
    }
}

const getImage = (name) => {
    try {
        const img = require(`../../resources/bodyparts/svg/${name.toUpperCase().replace(" ", "_")}.svg`);
        return img
    } catch (e) {
        return '';
    }
}

const imgStyle = {
    filter: 'invert(1) contrast(0.5) drop-shadow(0px 0px 2px black)'
}

export default ModuleWorkoutDistribution;