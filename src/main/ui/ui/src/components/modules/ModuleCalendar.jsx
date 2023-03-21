import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Calendar from "../calendar/Calendar";
import Module from "./Module";
import get from "../../services/Get";
import Multiselect from 'multiselect-react-dropdown';
import LocalStorage from "../../services/LocalStorage";

const PAGE_SIZE = 14;
const CACHE_KEY = "calendar.selected"

const ModuleCalendar = ({profile}) => {
    const [selected, setSelected] = useState([]);
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [page, setPage] = useState(1);
    const [pagesLoaded, setPagesLoaded] = useState(1);
    const [loading, setLoading] = useState(false)

    let initialResources = [];
    let initialSelected = [];
    if (resources.length === 0) {
        initialResources = profile.friends.map(friend => ({id: friend.userId, name: friend.displayName}));
        initialResources.push({id: profile.userId, name: profile.displayName})
        setResources(initialResources);
        initialSelected = LocalStorage.get(CACHE_KEY, null, initialResources);
        setSelected(initialSelected)
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

    const onSelect = (selectedList, selectedItem) => {
        setSelected( selectedList )
        LocalStorage.set(CACHE_KEY, selectedList)
    }

    const onRemove = (selectedList, selectedItem) => {
        setSelected( selectedList )
        LocalStorage.set(CACHE_KEY, selectedList)
    }

    const thisOrElse = (arr1, arr2) => {
        if (arr1.length < 1)
            return arr2;
        return arr1;
    }

    return (
        <Module title={ "Shared Calendar" } className={ "friends-calendar" }>
            <div>
                <Calendar resources={ selected } events={ events } days={ pagesLoaded * PAGE_SIZE } scrollCallback={ onMaxScrollLeft }/>
            </div>
            <Multiselect
                options={ thisOrElse(resources, initialResources) }
                selectedValues={ thisOrElse(selected, initialSelected) }
                onSelect={ onSelect }
                onRemove={ onRemove }
                displayValue="name"
            />
        </Module>
    )

}

export default ModuleCalendar;