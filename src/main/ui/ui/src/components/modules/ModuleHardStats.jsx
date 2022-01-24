import '../../styles/Module.css';
import React from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Module from "./Module";


const ModuleHardStats = () => {
    const { data, loading } = useFetch('/api/stats');

    if (loading)
        return <Loader />

    const setdata = Object.keys(data.setTypes).map(key =>  {
        return { exercise: key, sets: data.setTypes[key], workouts: data.setWorkouts[key] }
    });

    return  <Module title={ "General statistics" } style={{ gridRow: '2' }}>
                <div style={{height: 'min(65vw, 500px)'}} className={'centerC'}>
                    <p> You registered your first workout on {data.firstWorkout.split("T")[0]}. Since then you've achieved the following:</p>
                    <p>Total number of registered workouts: <b>{data.workouts}</b></p>
                    <p>Total number of registered sets: <b>{data.sets}</b></p>
                    <div style={{ paddingLeft: '1rem' }}>
                        {
                            setdata
                                .sort((a, b) => a.exercise.localeCompare(b.exercise))
                                .map(({exercise, sets, workouts}) => sets !== 0 &&
                                    <>
                                        <span key={exercise}>
                                            {format(exercise)}: <b>{sets}</b> sets (<b>{workouts}</b> workouts)
                                        </span> <br/>
                                    </>)
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