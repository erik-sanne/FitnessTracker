import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import DataSelect from "../ui_components/DataSelect";
import useFetch from "../../services/useFetch";
import {getCookie} from "react-use-cookie";
import Loader from "../ui_components/Loader";
import body from "../../resources/bodyparts/body.png";

const ModuleExerciseInfo = () => {
    const { data: exercises, loading } = useFetch('/api/exercises');
    const [ selectedExercise, setSelectedExercise ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);

    useEffect(() => {
        if (!loading)
            setLoading(false);
    }, [loading])

    const getExercise = async (ex) => {
        setLoading(true);
        const token = getCookie('session_token');
        const response = await fetch( process.env.REACT_APP_API_BASE + `/exerciseinfo/${ex.replace(/ /g, '_')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        });

        const data = await response.json();
        setSelectedExercise(data)

        setLoading(false);
    }

    const getImage = (name) => {
        try {
            const img = require(`../../resources/bodyparts/${name}.png`);
            return img.default
        } catch (e) {
            return '';
        }
    }

    if (isLoading)
        return ( <Loader /> );

    return (
        <>
            <div className={ 'centerC' }>

                {
                    !selectedExercise && <p style={{ textAlign: 'center'}}> Check which muscle groups your exercises target </p>
                }

                <div style={ wrapperStyle }>
                    {
                        selectedExercise &&
                        <div style={{ paddingTop: '1rem'}}>
                            <p> <strong> Name: </strong> <br />{ camelCase(selectedExercise.name.replace(/_/g, ' ')) } </p>
                            <p> <strong> Primarily targets: </strong> <br />{ selectedExercise.primaryTargets.map(muscle =>
                                camelCase(muscle.name.replace(/_/g, ' '))
                            ).join(", ") } </p>
                            {
                                selectedExercise.secondaryTargets.length > 0 &&
                                <p><strong> Also targets: </strong> <br />{selectedExercise.secondaryTargets.map(muscle =>
                                camelCase(muscle.name.replace(/_/g, ' '))
                                ).join(", ")} </p>
                            }
                            {
                                <p><strong> Associated splits: </strong> <br />{ [...new Set([ ...selectedExercise.primaryTargets, ...selectedExercise.secondaryTargets].flatMap(muscle =>
                                    muscle.wtypes.map((type) => camelCase(type.name.replace(/_/g, ' ')) )
                                ))].join(", ")}
                                </p>
                            }
                        </div>
                    }
                    <div style={{ position: 'relative' }}>
                        {
                            selectedExercise && selectedExercise.secondaryTargets.map(muscle => {
                                return <img src={ getImage(muscle.name) } style={imgSecStyle}/>
                            })
                        }


                        {
                            selectedExercise && selectedExercise.primaryTargets.map(muscle => {
                                return <img src={ getImage(muscle.name) } style={ imgPrimStyle }/>
                            })
                        }

                        <img src={ body } style={ imgStyle } />
                    </div>
                </div>
            </div>

            <DataSelect value={ selectedExercise ? selectedExercise.name.replace(/_/g, ' ') : null } onSelect={ (ex) => ex && getExercise(ex) } options={ exercises.map(e => e.replace(/_/g, ' ')) } />
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const wrapperStyle = {
    justifyContent: 'center',
    display: 'flex'
}

const imgStyle = {
    filter: 'invert(1) drop-shadow(0px 0px 5px black)'
}

const imgPrimStyle = {
    filter: 'brightness(0.5)',
    position: 'absolute',
    top: 0,
    left: 0
}

const imgSecStyle = {
    filter: 'hue-rotate(45deg)',
    position: 'absolute',
    top: 0,
    left: 0,
}

export default ModuleExerciseInfo;