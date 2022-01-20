import React, {useEffect, useRef, useState} from "react";
import SetInput from "./modules/SetInput";
import useFetch from "../services/useFetch";
import Module from "./modules/Module";
import { getCookie } from "react-use-cookie";
import { Redirect } from "react-router-dom";
import { faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "./ui_components/Modal";
import ModalLoader from "./ui_components/ModalLoader";
import {useParams} from "react-router";
import get from "../services/Get";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";

const SectionNewWorkout = ({updateUserProfile}) => {
    const { workoutId } = useParams();
    const SubmitStatus = {
        NOT_SUBMITTED: "not submitted",
        ERROR: "submit error",
        SUBMITTING: "submitting",
        FETCHING: "fetching",
        SUBMITTED: "submitted"
    }
    const bottomRef = useRef();
    const LS_KEY_UP = "user_preferences"

    const LS_KEY_SETS = "saved_workout_sets"
    const LS_KEY_DATE = "saved_workout_date"

    const todaysDate = new Date().toISOString().split('T')[0];

    const { data: names, loading } = useFetch('/api/exercises');
    const [ collapseSets, setCollapseSets ] = useState(false);
    const [ exerciseOptions, setExerciseOptions ] = useState([]);
    const [ date, setDate] = useState(todaysDate);
    const [ sets, setSets ] = useState([]);
    const [ currentEdit, setCurrentEdit ] = useState(null);
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ submitStatus, setSubmitStatus ] = useState(SubmitStatus.NOT_SUBMITTED)
    const [ currentSet, setCurrentSet ] = useState({
        reps: '',
        weight: '',
        type: ''
    });

    const postWorkout = () => {
        setSubmitStatus(SubmitStatus.SUBMITTING)

        const setArray = sets.map((set) => { return {...set, exercise: set.type.replace(/ /g, '_')}});

        const workout = {
            user: null,
            date: date,
            sets: setArray
        }

        const token = getCookie('session_token')
        fetch(`${ process.env.REACT_APP_API_BASE }/api/${workoutId ? `updateWorkout/${workoutId}` : 'saveWorkout'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            },
            body: JSON.stringify(workout)
        }).then(response => {
            if (response.ok) {
                if (!workoutId) {
                    localStorage.removeItem(LS_KEY_SETS);
                    localStorage.removeItem(LS_KEY_DATE);
                }
                setSubmitStatus(SubmitStatus.SUBMITTED);
                updateUserProfile();
            }
        }).catch(error => {
            console.log("error", error)
            setSubmitStatus(SubmitStatus.ERROR);
        });
    }

    const removeSet = (event, index) => {
        event.stopPropagation();
        const newArray = sets.filter((set, idx) => idx !== index).map((set => ({...set})));
        setSets(newArray);
        setCurrentEdit(null);
    }

    const submitSet = (set) => {
        if (currentEdit !== null) {
            const newArray = sets.map((s, idx) => {
                if (idx === currentEdit)
                    return {...set};
                return {...s};
            })
            setSets(newArray);
            setCurrentEdit(null);
        } else {
            setSets(sets => [...sets, {...set}])
            bottomRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
    }

    const onEditingSet = (set) => {
        setCurrentSet({...set});
    }

    const toggleEdit = (key) => {
        if (currentEdit === null) {
            setCurrentEdit(key)
            console.log(sets[key].type);
            setCurrentSet({...sets[key], type: sets[key].type})
        } else {
            deSelect();
        }
    }

    const deSelect = () => {
        setCurrentEdit(null)
        setCurrentSet({...sets[sets.length - 1]});
    }

    useEffect(() => {
        if (workoutId) {
            setSubmitStatus(SubmitStatus.FETCHING);
            get(`/api/workout/${workoutId}`).then(workout => {
                setSets(workout.sets.map((set) => { return {...set, type: set.exercise.replace(/_/g, ' ') }}));
                setDate(workout.date.split('T')[0]);
                setSubmitStatus(SubmitStatus.NOT_SUBMITTED);
            }).catch(() => setSubmitStatus(SubmitStatus.ERROR) );
            return;
        }
        const saved_sets = JSON.parse(localStorage.getItem(LS_KEY_SETS))
        const saved_date = JSON.parse(localStorage.getItem(LS_KEY_DATE))
        if (saved_sets && saved_sets.length > 0) {
            setSets(saved_sets);
            setDate(saved_date);
        }

        const userPreferences = JSON.parse(localStorage.getItem(LS_KEY_UP));
        if (userPreferences) {
            setCollapseSets(userPreferences.collapseSets);
        }
    }, [])

    useEffect(() => {
        if (sets.length > 0)
            setCurrentSet({...sets[sets.length - 1]})
        if (!workoutId) {
            localStorage.setItem(LS_KEY_SETS, JSON.stringify(sets));
            localStorage.setItem(LS_KEY_DATE, JSON.stringify(date));
        }
    }, [ sets, date ])

    useEffect(() => {
        if (!loading) {
            const options = names.map(name => name.replace(/_/g, ' '));
            setExerciseOptions(options)
        }

    }, [names, loading])

    if (submitStatus === SubmitStatus.SUBMITTED) {
        const url = workoutId ? '/history' : '/';
        return <Redirect to={url}/>
    }

    return (
        <>
            <div className={ 'page-wrapper' } style={{ minHeight: '0vh', paddingBottom: '30vh'}}>
                <Module title={"Workout details"}>
                    <label>Date</label>
                    <input type={'date'} value={ date } max={ todaysDate } onChange={ e => setDate(e.target.value) } style={{ width: '100%' }}/>
                    { sets.length !== 0 &&
                    <>
                        { !collapseSets ? <table>
                            <thead>
                            <tr>
                                <th> Exercise</th>
                                <th style={{textAlign: 'right', width: 'auto'}}> Repetitions</th>
                                <th> Weight</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {sets.map((set, key, array) =>
                                <tr key={key} style={currentEdit === key ? editStyle : {cursor: 'pointer'}}
                                    onClick={() => toggleEdit(key)}>
                                    <td> {currentEdit === key ? currentSet.type : set.type} </td>
                                    <td> {currentEdit === key ? currentSet.reps : set.reps} </td>
                                    <td> {currentEdit === key ? currentSet.weight : set.weight !== '' ? set.weight : '-'} </td>
                                    <td><FontAwesomeIcon icon={faTrash} style={{
                                        ...trashCanStyle,
                                        visibility: currentEdit === key ? 'visible' : 'hidden'
                                    }} onClick={(e) => removeSet(e, key)}/></td>
                                </tr>)
                            }
                            </tbody>
                        </table> :
                            <>
                                <div style={{margin: '1em 0em'}}>
                                { sets.map((set, key, array) => (key === 0 || array.indexOf(array.filter(e => e.type === set.type)[0]) === key) &&
                                    <Accordion square key={set.type} style={collapseStyle} onChange={ deSelect }>
                                        <AccordionSummary aria-controls={`${set.type}-content`}  id={`${set.type}-header`}>
                                            <span style={{margin: 'auto'}}>{set.type}</span>
                                            <span style={{
                                                margin: 'auto',
                                                flex: '1',
                                                paddingLeft: '10px'
                                            }}>{"× " + array.filter((s) => s.type === set.type).length}</span>
                                        </AccordionSummary>
                                        <AccordionDetails style={{display: 'block'}}>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th> Set</th>
                                                    <th style={{textAlign: 'right', width: 'auto'}}> Repetitions</th>
                                                    <th> Weight</th>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                { array.map((s, k) =>
                                                    s.type === set.type && <tr key={k} style={currentEdit === k ? editStyle : {cursor: 'pointer'}} onClick={() => toggleEdit(k)} id={k}>
                                                        <td> #{ 1 } </td>
                                                        <td> {currentEdit === k ? set.reps : s.reps} </td>
                                                        <td> {currentEdit === k ? set.weight : s.weight !== '' ? s.weight : '-'} </td>
                                                        <td><FontAwesomeIcon icon={faTrash} style={{
                                                            ...trashCanStyle,
                                                            visibility: currentEdit === k ? 'visible' : 'hidden'
                                                        }} onClick={(e) => removeSet(e, k)}/></td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </AccordionDetails>
                                    </Accordion> )
                                    }
                                </div>
                            </>
                        }
                    <input type="submit" value={ workoutId ? "Update" : "Create and Save"} onClick={ () => setModalVisible(true) }/>
                    </>
                    }
                    <span ref={bottomRef} />
                </Module>
                <Module title={""} className={ 'bottom-panel' }>
                    <SetInput
                        type={ currentSet.type }
                        reps={ currentSet.reps }
                        weight={ currentSet.weight }
                        buttonText={ currentEdit !== null ? 'Save changes' : 'Add set' }
                        exerciseOptions={ exerciseOptions }
                        onSubmit={ submitSet }
                        onEdit={ onEditingSet }/>
                </Module>
            </div>
            <Modal visible={ modalVisible } title={ "Submit workout?" } onClose={ () => setModalVisible(false) }>
                <input type={ 'submit' } value={ 'Yes!' } className={ 'themed' } onClick={ () => {
                        setModalVisible(false);
                        postWorkout();
                    }
                }/>
            </Modal>
            <ModalLoader visible={
                submitStatus === SubmitStatus.SUBMITTING ||
                submitStatus === SubmitStatus.FETCHING ||
                submitStatus === SubmitStatus.ERROR
            } text={ submitStatus === SubmitStatus.SUBMITTING ?
                "Saving workout..." :
                "Fetching workout" } error={ submitStatus === SubmitStatus.ERROR && "An error occurred :(" } onClose={
                () => setSubmitStatus(SubmitStatus.NOT_SUBMITTED)
            }/>
        </>
    )

}

const collapseStyle = { background: '#282c3400', color: 'inherit', border: '1px solid #cccccc10' }

const editStyle = {
    background: 'rgba(107,166,239,0.1)',
    boxShadow: '0px 0px 2px inset rgb(107 166 239 / 50%)',
    cursor: 'pointer'
}

const trashCanStyle = {
    color: '#ad3f3f',
    fontSize: '24px',
    cursor: 'pointer'
}

export default SectionNewWorkout;