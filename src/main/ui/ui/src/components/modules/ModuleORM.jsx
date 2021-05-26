import '../../styles/Module.css';
import 'chartjs-plugin-zoom'
import Spinner from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import React, {useEffect, useState} from "react";
import DataSelect from "../ui_components/DataSelect";
import {getCookie} from "react-use-cookie";
import DisplayValue from "./DisplayValue";

const ModuleORM = () => {
    const { data: exercises, loading } = useFetch('/api/exercises');
    const [ selectedExercise, setSelectedExercise ] = useState(null);
    const [ result, setResult ] = useState(null);

    const getPrediction = async (ex) => {
        const token = getCookie('session_token');
        const response = await fetch( process.env.REACT_APP_API_BASE + `/api/predictORM/${ex.replace(/ /g, '_')}`, {
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
                    <div style={{height: 'min(65vw, 500px)'}} className={'centerC'}>
                        {
                            !result ?
                            <DisplayValue text={"Select an exercise"} value={""}
                                          style={{textAlign: "center", padding: '32% 0%'}}/> :
                            result.weight === 0 ?
                                <DisplayValue text={"Insufficient data"} value={""}
                                              style={{textAlign: "center", padding: '32% 0%'}}/> :
                                <DisplayValue text={`Your max lift for ${ selectedExercise && camelCase(selectedExercise) } is`}
                                              value={`${result.weight.toFixed(0)}kg`}
                                              style={{textAlign: "center", padding: '32% 0%'}}/>

                        }
                    </div>
                    <div style={{display: "flex", marginTop: "10px"}}>
                        <DataSelect options={exercises.map(e => e.replace(/_/g, ' '))} onSelect={ (ex) => setSelectedExercise(ex) } style={selectStyle} />
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

const selectStyle = {
    width: '100vw'
}

export default ModuleORM;