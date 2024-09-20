import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import useFetch from "../../services/useFetch";
import {getCookie} from "react-use-cookie";
import Loader from "../ui_components/Loader";
import body from "../../resources/bodyparts/svg/body.svg";
import Select from "react-select";

const ModuleExerciseInfo = () => {
    const { data: exercises, loading } = useFetch('/api/exercises');
    const [ selectedExercise, setSelectedExercise ] = useState(null);
    const [ data, setData ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);

    useEffect(() => {
        if (!loading)
            setLoading(false);
    }, [loading])

    useEffect(() => {
        getExercise()
    }, [selectedExercise])

    const getExercise = async () => {
        setLoading(true);
        const token = getCookie('session_token');
        const ex = selectedExercise;
        if (!ex) {
            return;
        }

        const response = await fetch( process.env.REACT_APP_API_BASE + `/exerciseinfo/${ex.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        });

        const data = await response.json();
        setData(data)

        setLoading(false);
    }

    const getImage = (name) => {
        try {
            const img = require(`../../resources/bodyparts/svg/${name.toUpperCase().replace(" ", "_")}.svg`);
            return img;
        } catch (e) {
            return '';
        }
    }

    if (isLoading)
        return ( <Loader /> );

    return (
        <>
            <div className={ 'primary-content-wrapper' } style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>

                {
                    !data && <p style={{ textAlign: 'center', marginTop: '0.8rem', padding: '32% 0%'}}> Check which muscle groups your exercises target </p>
                }

                <div style={ wrapperStyle }>
                    {
                        data &&
                        <div style={{ padding: '1rem 0rem 0px 1rem'}}>
                            <p> <strong> Name: </strong> <br />{ camelCase(data.name.replace(/_/g, ' ')) } </p>
                            <p> <strong> Primarily targets: </strong> <br />{ data.primaryTargets.map(muscle =>
                                camelCase(muscle.name.replace(/_/g, ' '))
                            ).join(", ") } </p>
                            {
                                data.secondaryTargets.length > 0 &&
                                <p><strong> Also targets: </strong> <br />{data.secondaryTargets.map(muscle =>
                                camelCase(muscle.name.replace(/_/g, ' '))
                                ).join(", ")} </p>
                            }
                            {
                                <p><strong> Associated splits: </strong> <br />{ [...new Set([ ...data.primaryTargets, ...data.secondaryTargets].flatMap(muscle =>
                                    muscle.wtypes.map((type) => camelCase(type.name.replace(/_/g, ' ')) )
                                ))].join(", ")}
                                </p>
                            }
                        </div>
                    }
                    <div style={{ position: 'relative', margin: '0 -2rem'}}>
                        {
                            data && data.secondaryTargets.map(muscle => {
                                return <img src={ getImage(muscle.name) } style={imgSecStyle}/>
                            })
                        }


                        {
                            data && data.primaryTargets.map(muscle => {
                                return <img src={ getImage(muscle.name) } style={ imgPrimStyle }/>
                            })
                        }
                        {
                            data && <img src={ body } style={ imgStyle } />
                        }
                    </div>
                </div>
            </div>
            <Select
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                defaultValue={ selectedExercise }
                onChange={ setSelectedExercise }
                options={ exercises.map(e =>{ return {value: e, label: camelCase(e.replace(/_/g, ' '))}}) }
                menuPlacement={"top"}
                className="select-container"
                classNamePrefix="select" />

        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const wrapperStyle = {
    justifyContent: 'space-between',
    display: 'flex'
}

const imgStyle = {
    filter: 'invert(1) drop-shadow(0px 0px 5px black)'
}

const imgPrimStyle = {
    filter: `invert(0.35) sepia(1) contrast(5) hue-rotate(328deg) opacity(0.9) drop-shadow(black 0px 0px 1px)`,
    position: 'absolute',
    top: 0,
    left: 0
}

const imgSecStyle = {
    filter: `invert(0.4) sepia(1) contrast(5) hue-rotate(359deg) opacity(0.9) drop-shadow(black 0px 0px 1px)`,
    position: 'absolute',
    top: 0,
    left: 0,
}

export default ModuleExerciseInfo;