import React, { useEffect, useState } from "react";
import get from "../services/Get";
import Module from "./modules/Module";
import Loader from "./ui_components/Loader";
import post from "../services/Post";
import Select from "react-select";
import TextButton from "./ui_components/TextButton";
import Modal from "./ui_components/Modal";
import ModalLoader from "./ui_components/ModalLoader";
import GoalProgression from "./ui_components/GoalProgression";

const SectionGoals = () => {
    const currentDate = () => {
        let now = new Date();
        now.setUTCHours(0,0,0,0);
        return now
    }
    const [ loading, setLoading ] = useState(false);
    const [ goals, setGoals ] = useState([]);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ newGoal, setNewGoal ] = useState({
        name: "",
        start: currentDate(),
        end: undefined,
        target: undefined
    })
    const [ isSubitting, setSubmitting ] = useState(false);
    const [ err, setErr ] = useState(false)

    // For now...
    const defaultValue = {
        value: "", 
        label: "Workouts until date",
    };

    useEffect(() => {
        fetchGoals();
    }, [])

    const fetchGoals = () => {
        setLoading(true)
        get(`/goal/progress`).then(resp => {
            setLoading(false)
            setGoals(resp)
        })
    }

    const validateAndPublish = () => {
        setSubmitting(true)
        let payload = newGoal;
        if (!payload.name || payload.name == "") {
            payload.name = suggestedName();
        }
        post(`/goal/create`, JSON.stringify(payload))
        .then(() => {
            setSubmitting(false)
            setModalVisible(false)
            setErr(false)
            fetchGoals();
        }).catch((_) => {
            setErr(true)
        })
    }

    const suggestedName = () => {
        return `${ newGoal.target } workouts registered`
    }

    return (
        <div className={ 'page-wrapper section-goals' } style={{ justifyContent: 'normal'}}>
            <Module title = "My current goals" className={ "my-goals" }>
                { loading ? <Loader /> : goals.length > 0 ? goals.map((goal, idx) => 
                    <GoalProgression key={idx} type="WORKOUTS" name={ goal.name } startDate={ goal.startDate } endDate={ goal.endDate } currentDate={ new Date() } progress={ goal.currentValue } target={ goal.targetValue }/>
                ) : <p style={{ textAlign: 'center', marginBottom: 0 }}>You do not currently have any goals</p> }
                <br />
                <TextButton onClick={ () => { setModalVisible(true) }}>Create Goal</TextButton>
            </Module>
            <Modal title="Create Goal" visible={modalVisible} onClose={ () => {setModalVisible(false)}}>
                <label htmlFor="type">Type of goal:</label>
                <Select
                    id="type"
                    menuPosition={'fixed'} 
                    defaultValue={ defaultValue }
                    onChange={ () => {} }
                    options={ 
                        [defaultValue]
                    }
                    className="select-container"
                    classNamePrefix="select" />
                <label htmlFor="startdate">Start date:</label>
                <input id="startdate" type={'date'} value={ newGoal.start.toDateInputValue() } onChange={ e => setNewGoal({...newGoal, start: e.target.valueAsDate})}/>
                <label htmlFor="enddate">End date:</label>
                <input id="enddate" type={'date'} value={ newGoal.end ? newGoal.end.toDateInputValue() : "" } onChange={ e => setNewGoal({...newGoal, end: e.target.valueAsDate})}/>
                <label htmlFor="target">Target:</label>
                <input id="target" type={'number'} value={ newGoal.target } onChange={ e => setNewGoal({...newGoal, target: e.target.value})} min={ 0 } max={ 9999 }/>
                <br />
                <label htmlFor="name">Custom name (optional):</label>
                <input id="name" type={ 'text' } value={ newGoal.name } onChange={ e => setNewGoal({...newGoal, name: e.target.value})} maxlength="32" placeholder={ newGoal.target ? suggestedName() : ""} />
                <TextButton onClick={ () =>{ validateAndPublish() }}>Create</TextButton>
            </Modal>
            <ModalLoader visible={ isSubitting } error={ err ? "Could not save goal" : "" } onClose={() => { setSubmitting(false)}}>Creating goal</ModalLoader>
        </div>)
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

export default SectionGoals;