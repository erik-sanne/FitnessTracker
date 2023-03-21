import React, {useEffect, useState} from "react";
import Module from "./modules/Module";
import useFetch from "../services/useFetch";
import Spinner from "react-bootstrap/cjs/Spinner";
import {getCookie} from "react-use-cookie";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "./ui_components/Modal";
import ModalLoader from "./ui_components/ModalLoader";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {faEdit} from "@fortawesome/free-regular-svg-icons";
import {Redirect} from "react-router-dom";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import Loader from "./ui_components/Loader";
import GetCache from "../services/GetCache";

const SectionHistory = ({ userProfile }) => {

    const RemoveStatus = {
        NONE: "none",
        LOADING: "loading",
        ERROR: "error"
    }

    const FetchStatus = {
        NONE: 0, LOADING: 1, MAX_REACHED: 2
    }

    const [ summaries, setSummaries ] = useState([]);
    const [ fetchStatus, setFetchStatus] = useState(FetchStatus.NONE);
    const { data: personalRecords, loadingPRs } = useFetch(`/api/records`);
    const [ sets, setSets ] = useState(null);
    const [ toRemove, setToRemove ] = useState(null);
    const [ redirectEdit, setRedirectEdit ] = useState(null);
    const [ removeStatus, setRemoveStatus ] = useState(RemoveStatus.NONE);
    const [ loadingStatus, setLoadingStatus ] = useState(-1);
    const [ currentEventKey, setCurrentEventKey ] = useState(false);
    const [ expanded, setExpanded ] = useState(false);

    useEffect(() => {
        getSummaries();
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [summaries, fetchStatus])


    const handleScroll = () => {
        const isBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2;
        if (isBottom) {
            getSummaries();
        }
    }

    const getSummaries = () => {
        if (fetchStatus !== FetchStatus.NONE)
            return;

        setFetchStatus(FetchStatus.LOADING)

        const from = summaries.length;
        const to = from === 0 ? 25 : from+10;
        GetCache.get(`/api/workouts?from=${from}&to=${to}`).then(resp => {
            const newState = [...summaries, ...resp]
            setSummaries(newState);
            if (newState.length < to) {
                setFetchStatus(FetchStatus.MAX_REACHED);
            } else {
                setFetchStatus(FetchStatus.NONE);
            }
        })
    }

    const onToggle = (eventKey) => {
        if (currentEventKey === eventKey) {
            setExpanded(expanded === eventKey ? false : eventKey);
            return;
        }

        setExpanded(false);
        setSets(null);
        setLoadingStatus(eventKey)
        setCurrentEventKey(eventKey)

        GetCache.get(`/api/setsForWorkout/${ eventKey }`).then(sets => {
            setSets(sets);
            setLoadingStatus(-1);
            setExpanded(eventKey)
        }).catch(error => {
            setLoadingStatus(-1);
            setSets(null);
        });
    }

    const remove = () => {
        setRemoveStatus(RemoveStatus.LOADING);
        const token = getCookie('session_token')
        fetch(`${ process.env.REACT_APP_API_BASE }/api/removeWorkout/${ toRemove.workout_id }`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }).then(response => {
            if (response.ok) {
                setToRemove(null);
                GetCache.invalidate();
                window.location.reload(); //There are probably better ways
            }
        }).catch(error => {
            setToRemove(null);
            setRemoveStatus(RemoveStatus.ERROR);
        });
    }

    const added = [];
    const isRecord = (profile, summary, set) => {
        if (loadingPRs)
            return false;
        const temp = personalRecords.filter(rec => rec.exercise === set.exercise)[0];
        const res = temp &&
            temp.date === summary.date &&
            temp.weight === set.weight &&
            !added.includes(set.exercise);
        return res;
    }

    const isNewExercise = (arr, set, index) => {
        return !arr[index - 1] || set.exercise !== arr[index - 1].exercise
    }

    const compPercentageText = (newval, lastval) => {
        if (lastval === 0)
            return '';
        const div = (newval / lastval) - 1;
        return ' (' + (div < 0 ? '' : div === 0 ? '±' :  '+') + (div*100).toFixed(0) + '%)';
    }

    if (redirectEdit)
        return <Redirect to={`/edit/${redirectEdit}`} />

    let setCounter = 0;
    return (
        <>
            <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
                <Module title = "My Workouts">
                        <>
                            { summaries.map(( summary ) =>
                                <Accordion square key={summary.workout_id} expanded={ expanded === summary.workout_id } onChange={ () => { onToggle(summary.workout_id) } }  style={{ background: '#282c3400', color: 'inherit', boxShadow: '0px 0px 10px #00000060', border: '1px solid #cccccc10' }}>
                                    <AccordionSummary aria-controls={`${summary.workout_id}-content`} id={`${summary.workout_id}-header`} style={{ padding: '.75rem 1.25rem' }}>
                                        <span style={{ margin: 'auto' }}>{ summary.date.split('T')[0] }</span>
                                        <span style={{ margin: 'auto', flex: '1', paddingLeft: '10px'}}>{ loadingStatus === summary.workout_id && <Spinner animation="border" style={{ width: '16px', height: '16px', top: 'calc(50% - 8px)', position: 'absolute'}}/> }</span>
                                        <span style={{ margin: 'auto' }}>{ summary.description }</span>
                                    </AccordionSummary>
                                    <AccordionDetails style={{ display: 'block'}}>
                                        { !sets ? <p></p> : sets.length === 0 ? <p> No data available </p> :
                                            <table style={{ width: '100%', fontSize: 'calc(10px + 0.5vmin)'}}>
                                                <thead>
                                                <tr>
                                                    <th colSpan={1}>Set</th>
                                                    <th></th>
                                                    <th colSpan={2} style={{ textAlign: 'left' }}>Reps</th>
                                                    <th colSpan={2} style={{ textAlign: 'left' }}>Weight</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    sets.map((set, index, arr) =>
                                                        <>
                                                            {isNewExercise(arr, set, index)?
                                                                <tr>
                                                                    <td colSpan={6} style={{borderBottom: '1px solid #333', fontWeight: 'bold'}}>
                                                                        {camelCase(set.exercise.replace(/_/g, ' '))}
                                                                    </td>
                                                                </tr>
                                                                : <></>}

                                                            <tr key={index}>
                                                                <td style={{width: '1px'}}>
                                                                    #{
                                                                    isNewExercise(arr, set, index) ? setCounter = 1 : ++setCounter
                                                                }
                                                                </td>
                                                                <td style={{textAlign: 'left'}}>
                                                                    {
                                                                        isRecord(userProfile, summary, set) ? <FontAwesomeIcon icon={ faStar } style={{ color: '#ffc877', width: 'inherit'}}/> : ""
                                                                    }
                                                                </td>
                                                                <td style={{width: '1px'}}>{set.reps}</td>
                                                                <td style={{paddingLeft: 0, textAlign: "left", color: 'rgba(255, 255, 255, 0.5)'}}>{!arr[index - 1] || set.exercise !== arr[index - 1].exercise ? '' :
                                                                    compPercentageText(set.reps, arr[index - 1].reps)
                                                                }</td>
                                                                <td style={{width: '1px'}}>{set.weight === 0 ? 'BW' : set.weight}</td>
                                                                <td style={{paddingLeft: 0, textAlign: "left", color: 'rgba(255, 255, 255, 0.5)'}}>{!arr[index - 1] || set.exercise !== arr[index - 1].exercise ? '' :
                                                                    compPercentageText(set.weight, arr[index - 1].weight)
                                                                }</td>
                                                            </tr>
                                                        </>)
                                                }
                                                </tbody>
                                            </table>
                                        }
                                        { sets &&
                                        <div style={{display: 'flex'}}>
                                            <p style={{ margin: '5px', flex: 1, padding: '12px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer'}} onClick={ () => setToRemove(summary) } >
                                                <FontAwesomeIcon icon={faTrash} style={trashCanStyle}/>
                                            </p>
                                            <p style={{ margin: '5px', flex: 1, padding: '12px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer'}} onClick={ () => setRedirectEdit(summary.workout_id) } >
                                                <FontAwesomeIcon icon={faEdit} style={editStyle}/>
                                            </p>
                                        </div>
                                        }
                                    </AccordionDetails>
                                </Accordion>)
                       }
                       </>
                    { fetchStatus === FetchStatus.LOADING ? <Loader /> : fetchStatus === FetchStatus.MAX_REACHED && summaries.length > 30 ?
                            <p style={ maxReachedStyle }> You've reached the end of time as we know it. You are a different person now </p> : fetchStatus === FetchStatus.MAX_REACHED ?
                            <p style={ maxReachedStyle }> No{summaries.length > 0 ? ' more ' : ' ' }registered workouts</p> : <span></span>}
                </Module>
            </div>
            <Modal visible={ toRemove && removeStatus !== RemoveStatus.LOADING } title={ "Remove workout" } onClose={ () => setToRemove(null) } >
                <p>Are you sure you want to remove your workout from { toRemove && toRemove.date.split('T')[0]}? This operation is irreversible. </p>
                <input type={'submit'} className={ 'themed' } value={ 'Yes!' } onClick={ () => remove() }/>
            </Modal>
            <ModalLoader visible={ removeStatus !== RemoveStatus.NONE } text={ 'Removing workout' } error={ removeStatus === RemoveStatus.ERROR && 'Failed to remove :(' } onClose={
                () => {
                    setRemoveStatus(RemoveStatus.NONE)
                    setToRemove(null);
                }}/>
        </>)
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const trashCanStyle = {
    color: '#ad3f3f',
    cursor: 'pointer',
    fontSize: '16px'
}

const editStyle = {
    color: '#ad8e3f',
    cursor: 'pointer',
    fontSize: '16px'
}

const maxReachedStyle = {
    textAlign: 'center',
    color: '#555',
    padding: '1em',
    margin: '0',
}

export default SectionHistory;
