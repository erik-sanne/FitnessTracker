import React, {useEffect, useState} from "react";
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

const SectionNewWorkout = ({updateUserProfile}) => {
    const { workoutId } = useParams();
    const SubmitStatus = {
        NOT_SUBMITTED: "not submitted",
        ERROR: "submit error",
        SUBMITTING: "submitting",
        SUBMITTED: "submitted"
    }

    const LS_KEY_SETS = "saved_workout_sets"
    const LS_KEY_DATE = "saved_workout_date"

    const todaysDate = new Date().toISOString().split('T')[0];

    const { data: names, loading } = useFetch('/api/exercises');
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
        fetch(`${ process.env.REACT_APP_API_BASE }/api/saveWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            },
            body: JSON.stringify(workout)
        }).then(response => {
            if (response.ok) {
                localStorage.removeItem(LS_KEY_SETS);
                localStorage.removeItem(LS_KEY_DATE);
                updateUserProfile();
                setSubmitStatus(SubmitStatus.SUBMITTED);
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
        } else
            setSets(sets => [...sets, {...set}])
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
            setCurrentEdit(null)
            setCurrentSet({
                reps: '',
                weight: '',
                type: ''
            });
        }
    }

    useEffect(() => {
        const saved_sets = JSON.parse(localStorage.getItem(LS_KEY_SETS))
        const saved_date = JSON.parse(localStorage.getItem(LS_KEY_DATE))
        if (saved_sets && saved_sets.length > 0) {
            setSets(saved_sets);
            setDate(saved_date);
        }
    }, [])

    useEffect(() => {
        if (sets.length > 0)
            setCurrentSet({...sets[sets.length - 1]})
        localStorage.setItem(LS_KEY_SETS, JSON.stringify(sets));
        localStorage.setItem(LS_KEY_DATE, JSON.stringify(date));
    }, [ sets, date ])

    useEffect(() => {
        if (!loading) {
            const options = names.map(name => name.replace(/_/g, ' '));
            setExerciseOptions(options)
        }

    }, [names, loading])

    if (workoutId)
        return (<div className={ 'page-wrapper' } style={{ minHeight: '0vh', paddingBottom: '30vh'}}><div>Not yet implemented</div></div>)

    if (submitStatus === SubmitStatus.SUBMITTED)
        return <Redirect to='/' />

    return (
        <>
            <div className={ 'page-wrapper' } style={{ minHeight: '0vh', paddingBottom: '30vh'}}>
                <Module title={"Workout details"}>
                    <label>Date</label>
                    <input type={'date'} value={ date } max={ todaysDate } onChange={ e => setDate(e.target.value) } style={{ width: '100%' }}/>
                    {sets.length !== 0 &&
                    <>
                    <table>
                        <thead>
                        <tr>
                            <th> Exercise</th>
                            <th style={{textAlign: 'right', width: 'auto'}}> Repetitions</th>
                            <th> Weight</th>
                            <th> </th>
                        </tr>
                        </thead>
                        <tbody>
                        {sets.map((set, key) =>
                            <tr key={key} style={currentEdit === key ? {
                                background: 'rgba(107,166,239,0.1)',
                                boxShadow: '0px 0px 2px inset rgb(107 166 239 / 50%)',
                                cursor: 'pointer'
                            } : { cursor: 'pointer' }} onClick={ () => toggleEdit(key) }>
                                <td> {currentEdit === key ? currentSet.type : set.type} </td>
                                <td> {currentEdit === key ? currentSet.reps : set.reps} </td>
                                <td> {currentEdit === key ? currentSet.weight : set.weight !== '' ? set.weight : '-'} </td>
                                <td> <FontAwesomeIcon icon={ faTrash } style={{...trashCanStyle, visibility: currentEdit === key ? 'visible' : 'hidden'}} onClick={(e) => removeSet(e, key)}/> </td>
                            </tr>)
                        }
                        </tbody>
                    </table>
                        <input type="submit" value="Create and Save" onClick={ () => setModalVisible(true) }/>
                    </>
                }
                </Module>
                <Module title={""} style={{
                    position: 'fixed',
                    bottom: '0px',
                    margin: '0px',
                    width: 'min(100vw, 1400px)',
                    borderRadius: '0px',
                    background: '#16171af5',
                    paddingBottom: '12px'
                }}>
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
                submitStatus === SubmitStatus.ERROR
            } text={ "Saving workout..." } error={ submitStatus === SubmitStatus.ERROR && "An error occurred :(" } onClose={
                () => setSubmitStatus(SubmitStatus.NOT_SUBMITTED)
            }/>
        </>
    )

}

const trashCanStyle = {
    color: '#ad3f3f',
    fontSize: '24px',
    cursor: 'pointer'
}

export default SectionNewWorkout;