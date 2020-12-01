import React, {useEffect, useState} from "react";
import SetInput from "../modules/SetInput";
import useFetch from "../../services/useFetch";
import Module from "../modules/Module";
import { getCookie } from "react-use-cookie";
import { Redirect } from "react-router-dom";
import { faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SectionNewWorkout = () => {
    const LS_KEY_SETS = "saved_workout_sets"
    const LS_KEY_DATE = "saved_workout_date"

    const todaysDate = new Date().toISOString().split('T')[0];

    const { data: names, loading } = useFetch('/api/exercises');
    const [ exerciseOptions, setExerciseOptions ] = useState([]);
    const [ date, setDate] = useState(todaysDate);
    const [ sets, setSets ] = useState([]);
    const [ submitted, setSubmitted ] = useState(false)
    const [ currentSet, setCurrentSet ] = useState({
        reps: '',
        weight: '',
        type: ''
    });

    const postWorkout = () => {

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
                setSubmitted(true);
            }
        }).catch(error => {
            console.log("error", error)
        });
    }

    const removeSet = (index) => {
        const newArray = sets.filter((set, idx) => idx !== index).map((set => ({...set})));
        setSets(newArray);
    }

    const submitSet = (set) => {
        setSets(sets => [...sets, {...set}])
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

    if (submitted)
        return <Redirect to='/' />

    return (
        <>
            <div className={ 'page-wrapper' } style={{ minHeight: '0vh', paddingBottom: '30vh'}}>
                <Module title={"Workout details"}>
                    <label>Date</label>
                    <input type={'date'} value={ date } max={ todaysDate } onChange={ e => setDate(e.target.value) } />
                    {sets.length !== 0 &&
                    <>
                    <table>
                        <thead>
                        <tr>
                            <th> Exercise</th>
                            <th> Repetitions</th>
                            <th> Weight</th>
                            <th> </th>
                        </tr>
                        </thead>
                        <tbody>
                        {sets.map((set, key) =>
                            <tr key={key}>
                                <td> {set.type} </td>
                                <td> {set.reps} </td>
                                <td> {set.weight !== '' ? set.weight : '-'} </td>
                                <td> <FontAwesomeIcon icon={ faTrash } style={trashCanStyle} onClick={() => removeSet(key)}/> </td>
                            </tr>)
                        }
                        </tbody>
                    </table>
                        <input type="submit" value="Create and Save" onClick={ postWorkout }/>
                    </>
                }
                </Module>
                <Module title={"Add set "} style={{
                    position: 'fixed',
                    bottom: '0px',
                    background: '#282c34'
                }}>
                    <SetInput
                        type={ currentSet.type }
                        reps={ currentSet.reps }
                        weight={ currentSet.weight }
                        exerciseOptions={ exerciseOptions }
                        onSubmit={ submitSet } />
                </Module>
            </div>
        </>
    )

}

const trashCanStyle = {
    color: '#ad3f3f',
    fontSize: '24px',
    cursor: 'pointer'
}

export default SectionNewWorkout;