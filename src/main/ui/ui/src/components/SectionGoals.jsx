import React, { useEffect, useState } from "react";
import doDelete from "../services/DoDelete";
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

    const goalTemplate = {
        id: -1,
        name: "",
        type: "WORKOUTS",
        start: currentDate(),
        end: undefined,
        target: undefined
    }

    const [ loading, setLoading ] = useState(false);
    const [ goals, setGoals ] = useState([]);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ newGoal, setNewGoal ] = useState(goalTemplate)
    const [ isEditMode, setEditMode ] = useState(false)
    const [ isSubitting, setSubmitting ] = useState(false);
    const [ err, setErr ] = useState(false)

    // For now...
    const defaultValue = {
        value: "WORKOUTS", 
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

        const url = isEditMode ? `/goal/${payload.id}/update` : `/goal/create`;

        delete payload.id;
        post(url, JSON.stringify(payload))
        .then(() => {
            setSubmitting(false)
            setModalVisible(false)
            setErr(false)
            setEditMode(false);
            setNewGoal(goalTemplate);
            fetchGoals();
        }).catch((_) => {
            setErr(true)
        })
    }

    const toggleTracking = (id) => {
        post(`/goal/${id}/track`).then(() => {
            fetchGoals();
        })
    }

    const edit = (goal) => {
        setEditMode(true);
        setNewGoal({
            id: goal.id,
            type: goal.type,
            name: goal.name,
            start: new Date(goal.startDate),
            end: new Date(goal.endDate),
            target: goal.targetValue
        });
        setModalVisible(true)
    }

    const remove = () => {
        setModalVisible(true)
        doDelete(`/goal/${newGoal.id}/delete`).then(() => {
            setModalVisible(false)
            setEditMode(false);
            fetchGoals();
        })
    }

    const suggestedName = () => {
        return newGoal.type === "WORKOUTS" ? `${ newGoal.target } workouts registered` : `${ newGoal.target } workouts a week`
    }

    return (
        <div className={ 'page-wrapper section-goals' } style={{ justifyContent: 'normal'}}>
            <Module title = "My current goals" className={ "my-goals" }>
                { loading ? <Loader /> : goals.length > 0 ? goals.map((goal, idx) => 
                    <GoalProgression key={idx} id={ goal.id } type={ goal.type } name={ goal.name } startDate={ goal.startDate } endDate={ goal.endDate } currentDate={ new Date() } progress={ goal.currentValue } target={ goal.targetValue } tracked={ goal.tracked } toggleCallback={ toggleTracking } onClick={ (_) => edit(goal) }/>
                ) : <p style={{ textAlign: 'center', marginBottom: 0 }}>You do not currently have any goals</p> }
                <br />
                <TextButton onClick={ () => { setModalVisible(true) }}>Create Goal</TextButton>
            </Module>
            <Modal title={ isEditMode ? "Update goal" : "Create goal" } visible={modalVisible} onClose={ () => { setModalVisible(false); setEditMode(false); setNewGoal(goalTemplate); }}>
                <label htmlFor="type">Type of goal:</label>
                <Select
                    id="type"
                    menuPosition={'fixed'} 
                    defaultValue={ defaultValue }
                    onChange={ opt => setNewGoal({...newGoal, type: opt.value }) }
                    options={ 
                        [defaultValue, { value: "WORKOUTS_WEEKLY", label: "Weekly workouts"}]
                    }
                    className="select-container"
                    classNamePrefix="select"
                    isDisabled={ isEditMode } />
                <label htmlFor="startdate">Start date:</label>
                <input id="startdate" type={'date'} value={ newGoal.start.toDateInputValue() } onChange={ e => setNewGoal({...newGoal, start: e.target.valueAsDate})}/>
                <label htmlFor="enddate">End date:</label>
                <input id="enddate" type={'date'} value={ newGoal.end ? newGoal.end.toDateInputValue() : "" } onChange={ e => setNewGoal({...newGoal, end: e.target.valueAsDate})}/>
                <label htmlFor="target">Target:</label>
                <input id="target" type={'number'} value={ newGoal.target } onChange={ e => setNewGoal({...newGoal, target: e.target.value})} min={ 0 } max={ newGoal.type === "WORKOUTS" ? 9999 : 7 }/>
                <br />
                <label htmlFor="name">Custom name (optional):</label>
                <input id="name" type={ 'text' } value={ newGoal.name } onChange={ e => setNewGoal({...newGoal, name: e.target.value})} maxlength="32" placeholder={ newGoal.target ? suggestedName() : ""} />
                <div style={{ display: "flex" }}>
                <TextButton onClick={ () =>{ validateAndPublish() }}>{ isEditMode ? "Update" : "Create" }</TextButton>
                {isEditMode && <div style={{ margin: "0.5em" }}></div> }
                {isEditMode && <TextButton onClick={ () =>{ remove(); }}>{ "Delete" }</TextButton> }
                </div>
            </Modal>
            <ModalLoader visible={ isSubitting } error={ err ? "Could not save goal" : "" } onClose={() => { setSubmitting(false); setEditMode(false); setNewGoal(goalTemplate); }}>{ isEditMode ? "Updating goal" : "Creating goal"}</ModalLoader>
        </div>)
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

export default SectionGoals;