import React, {useEffect, useState} from 'react';
import Select from "react-select";
import Utils from "../../services/Utils";

const SetInput = ({ type, reps, weight, buttonText, exerciseOptions, onSubmit, onEdit }) => {
    const [ exerciseState, setExerciseState ] = useState({
        type: type,
        reps: reps,
        weight: weight
    })
    const [ validationErrors, setValidationErrors ] = useState({
        type: false,
        reps: false,
        weight: false
    })

    const handleInputChange = (event) => {
        onEdit({
            ...exerciseState,
            [event.target.name]: event.target.value
        })
        setExerciseState({
            ...exerciseState,
            [event.target.name]: event.target.value
        });
    }

    const Submit = () => {

        const selected_exercise = exerciseOptions.filter( exercise => exercise === exerciseState.type);

        const validError = {
            type: selected_exercise.length === 0,
            reps: exerciseState.reps < 1 || exerciseState.reps === "" || exerciseState.reps > Math.floor(exerciseState.reps),
            weight: exerciseState.weight < 0
        };
        setValidationErrors(validError);


        if (validError.type || validError.reps || validError.weight)
            return;

        onSubmit({
            ...exerciseState, type: selected_exercise[0]
        });
    }

    useEffect(()=> {
        setExerciseState({ type: type, reps: reps, weight: weight })
    },[type, reps, weight])

    return (
        <>
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'stretch',
            marginBottom: '8px'
        }}>
            <div style={{...inputWrap, flex: 2}}>
                <label className={ 'default-label' }>Exercise</label>
                <Select
                    menuPosition={'fixed'} 
                    onChange={ (value) => handleInputChange({ target : { name: 'type', value: value.value }}) }
                    options={ exerciseOptions.map(e =>{ return {value: e, label: Utils.camelCase(e.replace(/_/g, ' '))}}) }
                    defaultValue={ Utils.camelCase(type.replace(/_/g, ' ')) || 'Select'}
                    placeholder={ Utils.camelCase(type.replace(/_/g, ' ')) }
                    menuPlacement={"top"}
                    className="select-container"
                    classNamePrefix="select" />
            </div>
            <div style={inputWrap}>
                <label className={ 'default-label' }>Reps</label>
                <input name="reps"
                       type="number"
                       placeholder={'Reps'}
                       min={1}
                       value={ exerciseState.reps }
                       onChange={ handleInputChange }
                       className={ 'default-input' }
                       style={{ width: '100%',  background: validationErrors.reps ? 'rgb(240 0 0 / 10%)' : '' }} />
            </div>
            <div style={{...inputWrap, marginRight: '0px'}}>
                <label className={ 'default-label' }>Weight</label>
                <input name="weight"
                       type="number"
                       placeholder={'Weight'}
                       min={0}
                       max={999.99}
                       value={ exerciseState.weight }
                       onChange={ handleInputChange }
                       className={ 'default-input' }
                       style={{ width: '100%',  background: validationErrors.weight ? 'rgb(240 0 0 / 10%)' : '' }}/>
            </div>
        </div>
        <input type="submit" value={buttonText} onClick={ Submit } className={ 'default-input' }/>
        </>
    );
}

const inputWrap = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginRight: '8px'
}

export default SetInput;