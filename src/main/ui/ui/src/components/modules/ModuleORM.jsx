import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import Spinner from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import React, {useEffect, useState} from "react";
import {getCookie} from "react-use-cookie";
import DisplayValue from "./DisplayValue";
import Select from "react-select";

const ModuleORM = () => {
    const { data: exercises, loading } = useFetch('/api/exercises');
    const [ selectedExercise, setSelectedExercise ] = useState(null);
    const [ result, setResult ] = useState(null);

    const getPrediction = async (ex) => {
        const token = getCookie('session_token');
        const response = await fetch( process.env.REACT_APP_API_BASE + `/api/predictORM/${ex.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        });

        const data = await response.json();
        setResult(data)
    }

    useEffect(() => {
        if (selectedExercise)
            getPrediction(selectedExercise);
    }, [selectedExercise])

    return (
        <>
            { loading ? <Spinner /> :
                <>
                    <div style={{height: 'min(65vw, 500px)'}} className={'primary-content-wrapper'}>
                        {
                            !result ?
                            <DisplayValue text={"Select an exercise"} value={""}
                                          style={{textAlign: "center", padding: '32% 0%'}}/> :
                            result.weight === 0 ?
                                <DisplayValue text={"Insufficient data"} value={""}
                                              style={{textAlign: "center", padding: '32% 0%'}}/> :
                                <DisplayValue text={`Your max lift for ${ selectedExercise && selectedExercise.label } is`}
                                              value={`${result.weight.toFixed(0)}kg`}
                                              style={{textAlign: "center", padding: '32% 0%'}}/>

                        }
                    </div>
                    <div>
                        <Select
                            menuPortalTarget={document.body}
                            menuPosition={'fixed'}
                            defaultValue={ selectedExercise }
                            onChange={ setSelectedExercise }
                            options={ exercises.map(e =>{ return {value: e, label: camelCase(e.replace(/_/g, ' '))}}) }
                            menuPlacement={"top"}
                            className="select-container"
                            classNamePrefix="select" />
                    </div>
                </>
            }
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}


export default ModuleORM;