import React from "react";
import Module from "../modules/Module";
import useFetch from "../../services/useFetch";
import Spinner from "react-bootstrap/cjs/Spinner";
import Card from "react-bootstrap/cjs/Card";
import Accordion from "react-bootstrap/cjs/Accordion";

const SectionHistory = () => {

    const { data: summaries, loading, error } = useFetch('/api/workouts');

    return (<div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
        <Module title = "Previous workouts">
            { loading ? <Spinner animation="grow" /> :
                <>
                    <Accordion>
                        { summaries.map(( summary ) =>
                            <Card key={ summary.workout_id } style={{ background: '#282c34' }}>
                                <Accordion.Toggle as={ Card.Header } style={{ display:'flex' }} eventKey={ summary.workout_id }>
                                    <span style={{ flex: '1'}}>{ summary.date.split('T')[0] }</span>
                                    <span>{ summary.description }</span>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={ summary.workout_id }>
                                    <Card.Body>[Not implemented]</Card.Body>
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