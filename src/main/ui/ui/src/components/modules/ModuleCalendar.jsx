import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Calendar from "../calendar/Calendar";
import Module from "./Module";
import get from "../../services/Get";


const ModuleCalendar = ({profile}) => {
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);

    if (resources.length === 0) {
        const res = profile.friends.map(friend => ({id: friend.userId, text: friend.displayName}));
        res.push({id: profile.userId, text: profile.displayName})
        setResources(res);
    }

    useEffect(() => {
        resources.forEach((resource) => {
            get(`/api/workouts/${resource.id}?from=${0}&to=${14}`).then((workouts) => {
                const resource_events = workouts.map(workout => ({resourceId: resource.id, date:workout.date, text:workout.description}));
                setEvents((oldSate) => oldSate.concat(resource_events));
            });
        });
    }, [resources])

    return (
        <Module title={ "Calendar" } className={ "friends-calendar" }>
            <div>
                <Calendar resources={ resources } events={ events } />
            </div>
        </Module>
    )
}

export default ModuleCalendar;