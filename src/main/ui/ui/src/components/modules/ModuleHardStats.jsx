import '../../styles/Module.css';
import React from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Module from "./Module";


const ModuleHardStats = () => {
    const { data, loading } = useFetch('/api/stats');

    if (loading)
        return <Loader />

    return  <Module title={ "General statistics" }>
                <div style={{height: 'min(65vw, 500px)'}} className={'centerC'}>
                    <p> You registered your first workout on {data.firstWorkout.split("T")[0]}. Since then you've achieved the following:</p>
                    <p>Total number of registered workouts: <b>{data.workouts}</b></p>
                    <p>Total number of registered sets: <b>{data.sets}</b></p>
                    <div style={{ paddingLeft: '1rem' }}>
                        {
                            Object.keys(data.setTypes).sort().map((key) => data.setTypes[key] !== 0 && <><span key={key}>{format(key)}: <b>{data.setTypes[key]}</b> sets</span><br/></>)
                        }
                    </div>
                </div>
            </Module>

}

const format = (text) => {
    text = text.replaceAll("_", " ")
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default ModuleHardStats;