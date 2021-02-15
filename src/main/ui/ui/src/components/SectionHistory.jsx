import React, { useState } from "react";
import Module from "./modules/Module";
import useFetch from "../services/useFetch";
import Spinner from "react-bootstrap/cjs/Spinner";
import Card from "react-bootstrap/cjs/Card";
import Accordion from "react-bootstrap/cjs/Accordion";
import { getCookie } from "react-use-cookie";
import { faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "./ui_components/Modal";
import ModalLoader from "./ui_components/ModalLoader";

const SectionHistory = () => {

    const RemoveStatus = {
        NONE: "none",
        LOADING: "loading",
        ERROR: "error"
    }

    const { data: summaries, loading } = useFetch('/api/workouts');
    const [ sets, setSets ] = useState(null);
    const [ toRemove, setToRemove ] = useState(null);
    const [ removeStatus, setRemoveStatus ] = useState(RemoveStatus.NONE);

    const onToggle = (eventKey) => {
        setSets(null);

        const token = getCookie('session_token')
        fetch(`${ process.env.REACT_APP_API_BASE }/api/setsForWorkout/${ eventKey }`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(sets => setSets(sets));
            }
        }).catch(error => {
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
                window.location.reload(); //There are probably better ways
            }
        }).catch(error => {
            setToRemove(null);
            setRemoveStatus(RemoveStatus.ERROR);
        });
    }

    let setCounter = 0;
    return (
        <>
            <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
                <Module title = "Previous workouts">
                    { loading ? <Spinner animation="grow" /> :
                        <Accordion>
                            { summaries.map(( summary ) =>
                                <Card key={ summary.workout_id } style={{ background: '#282c3487' }}>
                                    <Accordion.Toggle as={ Card.Header } style={{ display:'flex' }} eventKey={ summary.workout_id } onClick={ () => {onToggle( summary.workout_id )} }>
                                        <span style={{ flex: '1'}}>{ summary.date.split('T')[0] }</span>
                                        <span>{ summary.description }</span>
                                        <span style={{ width: '32px', textAlign: 'right' }}>
                                            <FontAwesomeIcon icon={faTrash} style={trashCanStyle} onClick={ () => setToRemove(summary) } />
                                        </span>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={ summary.workout_id }>
                                        <Card.Body>
                                            {sets === null ? <Spinner animation="grow"/> :
                                                <>
                                                    { sets.length === 0 ? <p> No data available </p> :
                                                            <table style={{ width: '100%', fontSize: 'calc(10px + 0.5vmin)'}}>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Exercise</th>
                                                                        <th>Set</th>
                                                                        <th colSpan={2} style={{ textAlign: 'left' }}>Reps</th>
                                                                        <th colSpan={2} style={{ textAlign: 'left' }}>Weight</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {
                                                                    sets.map((set, index, arr) =>
                                                                    <tr key={index}>
                                                                        <td style={{fontWeight: 'bold'}}>{
                                                                            !arr[index - 1] || set.exercise !== arr[index - 1].exercise ? camelCase(set.exercise.replace(/_/g, ' ')) : ''}
                                                                        </td>
                                                                        <td>
                                                                            #{
                                                                                !arr[index - 1] || set.exercise !== arr[index - 1].exercise ? setCounter = 1 : ++setCounter
                                                                            }
                                                                        </td>
                                                                        <td style={{width: '1px'}}>{set.reps}</td>
                                                                        <td style={{paddingLeft: 0, textAlign: "left", color: 'rgba(255, 255, 255, 0.5)'}}>{!arr[index - 1] || set.exercise !== arr[index - 1].exercise ? '' :
                                                                            ' (' + (((set.reps / arr[index - 1].reps) - 1) < 0 ? '' : '+') + (((set.reps / arr[index - 1].reps) - 1)*100).toFixed(0) + '%)'
                                                                        }</td>
                                                                        <td style={{width: '1px'}}>{set.weight}</td>
                                                                        <td style={{paddingLeft: 0, textAlign: "left", color: 'rgba(255, 255, 255, 0.5)'}}>{!arr[index - 1] || set.exercise !== arr[index - 1].exercise ? '' :
                                                                            ' (' + (((set.weight / arr[index - 1].weight) - 1) < 0 ? '' : '+') + (((set.weight / arr[index - 1].weight) - 1)*100).toFixed(0) + '%)'
                                                                        }</td>
                                                                    </tr>)
                                                                }
                                                                </tbody>
                                                            </table>
                                                    }
                                                </>
                                            }
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            ) }
                        </Accordion>
                    }
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
    marginLeft: '8px'
}

export default SectionHistory;
