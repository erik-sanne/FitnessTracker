import '../../styles/Module.css';
import React from "react";
import useFetch from "../../services/useFetch";
import Loader from "../ui_components/Loader";
import Mission from "../ui_components/Mission";

const ModuleWeeklyMissions = () => {
    const { data: data, loading } = useFetch("/api/missions")

    if (loading)
        return <div>
            <div className={ 'mission-container loading' }><Loader /></div>
            <div className={ 'mission-container loading' }><Loader /></div>
            <div className={ 'mission-container loading' }><Loader /></div>
        </div>


    return (<div style={{ margin: window.innerWidth < 600 ? '-1.5rem -1rem -1.4rem -1rem' : '' }}>
        {
            data.map((mission, key) =>
                <Mission key={key} name={mission.name} description={mission.description} progress={mission.progress} goal={mission.goal} completed={ mission.completed } reward={ mission.reward } />
            )
        }
    </div>)
}

export default ModuleWeeklyMissions;