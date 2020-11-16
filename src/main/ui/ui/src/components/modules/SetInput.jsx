import React, {useEffect, useState} from 'react';

const SetInput = ({ type, reps, weight, exerciseOptions, onSubmit }) => {
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
        setExerciseState({
            ...exerciseState,
            [event.target.name]: event.target.value
        })
    }

    const Submit = () => {

        const selected_exercise = exerciseOptions.filter( exercise => exercise === exerciseState.type);

        const validError = {
            type: selected_exercise.length === 0,
            reps: exerciseState.reps < 1 || exerciseState.reps === "",
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
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'stretch'
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignContent: 'stretch',
                flex: 2,
                minWidth: '280px'
            }}>
                <div style={{...inputWrap, flex: 2}}>
                    <label>Exercise</label>
                    <input name={"type"}
                           list="exercise_types"
                           placeholder={'Exercise'}
                           value={ exerciseState.type }
                           onChange={ handleInputChange }
                           style={{ width: '100%', background: validationErrors.type ? '#faa' : '' }} />
                    <datalist id="exercise_types">
                        {
                            exerciseOptions.map((name, key) =>
                                <option key={key} value={ name } />
                            )
                        }
                    </datalist>
                </div>
                <div style={inputWrap}>
                    <label>Reps</label>
                    <input name="reps"
                           type="number"
                           placeholder={'Reps'}
                           value={ exerciseState.reps }
                           onChange={ handleInputChange }
                           style={{ width: '100%',  background: validationErrors.reps ? '#faa' : '' }} />
                </div>
                <div style={inputWrap}>
                    <label>Weight</label>
                    <input name="weight"
                           type="number"
                           placeholder={'Weight'}
                           value={ exerciseState.weight }
                           onChange={ handleInputChange }
                           style={{ width: '100%',  background: validationErrors.weight ? '#faa' : '' }}/>
                </div>
            </div>
            <div style={{...inputWrap, width: "10%", justifyContent: "flex-end", minWidth: '100px', flex: '0'}}>
                <input type="submit" value={"Add"} onClick={ Submit }/>
            </div>
        </div>
    );
}

const inputWrap = {
    display: "flex",
    flexDirection: "column",
    flex: 1
}

export default SetInput;