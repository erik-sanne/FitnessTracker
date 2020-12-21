import React, { useState } from "react";
import Module from "./modules/Module";
import useFetch from "../services/useFetch";
import Spinner from "react-bootstrap/cjs/Spinner";
import Card from "react-bootstrap/cjs/Card";
import Accordion from "react-bootstrap/cjs/Accordion";
import { getCookie } from "react-use-cookie";

const SectionHistory = () => {

    const { data: summaries, loading } = useFetch('/api/workouts');
    const [ sets, setSets ] = useState(null);

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

    return (<div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
        <Module title = "Previous workouts">
            { loading ? <Spinner animation="grow" /> :
                <>
                    <Accordion>
                        { summaries.map(( summary ) =>
                            <Card key={ summary.workout_id } style={{ background: '#282c3487' }}>
                                <Accordion.Toggle as={ Card.Header } style={{ display:'flex' }} eventKey={ summary.workout_id } onClick={ () => onToggle( summary.workout_id ) }>
                                    <span style={{ flex: '1'}}>{ summary.date.split('T')[0] }</span>
                                    <span>{ summary.description }</span>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={ summary.workout_id }>
                                    <Card.Body>
                                        {sets === null ? <Spinner animation="grow"/> :
                                            sets.length === 0 ? <p> No data available </p> :
                                                <table style={{ width: '100%', fontSize: 'calc(10px + 0.5vmin)'}}>
                                                    <thead>
                                                        <tr>
                                                            <th>Exercise</th>
                                                            <th>Reps</th>
                                                            <th>Weight</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        sets.map((set, key) =>
                                                        <tr key={key}>
                                                            <td>{set.exercise.replace(/_/g, ' ')}</td>
                                                            <td>{set.reps}</td>
                                                            <td>{set.weight}</td>
                                                        </tr>)
                                                    }

                                                    </tbody>
                                                </table>
                                        }
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        ) }
                    </Accordion>
                </>
            }

        </Module>
    </div>)
}

export default SectionHistory;