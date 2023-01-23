import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Calendar from "../calendar/Calendar";
import Module from "./Module";
import get from "../../services/Get";
import Multiselect from 'multiselect-react-dropdown';

const PAGE_SIZE = 14;

const ModuleCalendar = ({profile}) => {
    const [exclude, setExclude] = useState([]);
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [page, setPage] = useState(1);
    const [pagesLoaded, setPagesLoaded] = useState(1);
    const [loading, setLoading] = useState(false)

    if (resources.length === 0) {
        const res = profile.friends.map(friend => ({id: friend.userId, name: friend.displayName}));
        res.push({id: profile.userId, name: profile.displayName})
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

    const intersect = (a1, a2) => {
        const b = a1.filter(value => !a2.includes(value));
        return b;
    }

    const onSelect = (selectedList, selectedItem) => {
        setExclude( intersect(resources, selectedList) )
    }

    const onRemove = (selectedList, selectedItem) => {
        setExclude( intersect(resources, selectedList) )
    }

    return (
        <Module title={ "Calendar" } className={ "friends-calendar" }>
            <div>
                <Calendar resources={ intersect(resources, exclude) } events={ events } days={ pagesLoaded * PAGE_SIZE } scrollCallback={ onMaxScrollLeft }/>
            </div>
            <Multiselect
                options={ resources }
                selectedValues={ resources }
                onSelect={ onSelect }
                onRemove={ onRemove }
                displayValue="name"
            />
        </Module>
    )

}

export default ModuleCalendar;