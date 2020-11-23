import React from "react";
import Module from "../modules/Module";
import useFetch from "../../services/useFetch";
import Spinner from "react-bootstrap/cjs/Spinner";
import Card from "react-bootstrap/cjs/Card";
import Accordion from "react-bootstrap/cjs/Accordion";

const SectionHistory = () => {

    const { data: workouts, loading, error } = useFetch('/api/workouts');

    return (<div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
        <Module title = "Previous workouts">
            { loading ? <Spinner animation="grow" /> :
                <>
                    <Accordion>
                        { workouts.map( (workout ) =>
                            <Card key={ workout.id } style={{ background: '#282c34' }}>
                                <Accordion.Toggle as={ Card.Header } eventKey={ workout.id }>
                                    { workout.date.split('T')[0] }
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={ workout.id }>
                                    <Card.Body>Testing...</Card.Body>
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