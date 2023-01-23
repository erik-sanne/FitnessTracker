import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Calendar from "../calendar/Calendar";
import Module from "./Module";
import get from "../../services/Get";

const PAGE_SIZE = 14;

const ModuleCalendar = ({profile}) => {
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [page, setPage] = useState(1);
    const [pagesLoaded, setPagesLoaded] = useState(1);
    const [loading, setLoading] = useState(false)

    if (resources.length === 0) {
        const res = profile.friends.map(friend => ({id: friend.userId, text: friend.displayName}));
        res.push({id: profile.userId, text: profile.displayName})
        setResources(res);
    }

    const onMaxScrollLeft = () => {
        if (!loading) {
            setLoading(true);
            setPage(page => page + 1)
        }
    }

    useEffect(() => {
        resources.forEach((resource) => {
            get(`/api/workouts/${resource.id}?from=${(page-1) * PAGE_SIZE}&to=${page * PAGE_SIZE}`).then((workouts) => {
                const resource_events = workouts.map(workout => ({resourceId: resource.id, date:workout.date, text:workout.description}));
                setEvents((oldSate) => oldSate.concat(resource_events));
                setLoading(false);
                setPagesLoaded(page);
            });
        });
    }, [resources, page])

    return (
        <Module title={ "Calendar" } className={ "friends-calendar" }>
            <div>
                <Calendar resources={ resources } events={ events } days={ pagesLoaded * PAGE_SIZE } scrollCallback={ onMaxScrollLeft }/>
            </div>
        </Module>
    )
}

export default ModuleCalendar;