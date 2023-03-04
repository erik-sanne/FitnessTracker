import React, {useEffect, useState} from 'react'
import ModuleWorkoutDays from "./modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "./modules/ModuleWorkoutDistribution";
import Module from "./modules/Module";
import ModuleSetAverages from "./modules/ModuleProgression";
import useFetch from "../services/useFetch";
import ModuleBSD from "./modules/ModuleBSD";
import ModulePRs from "./modules/ModulePRs";
import get from "../services/Get";
import ModuleORM from "./modules/ModuleORM";
import ModuleExerciseInfo from "./modules/ModuleExerciseInfo";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink} from "react-router-dom";
import LocalStorage from "../services/LocalStorage";
import ModuleExerciseDistribution from "./modules/ModuleExerciseDistribution";

const SectionStatistics = () => {
    const { data: selfWorkoutsPerWeek, loading: loadingWorkouts  } = useFetch(`/api/workoutsPerWeek`);
    const [ workoutDistribution, setWorkoutDistribution ] = useState([]);
    const { data: selfRecords, loading: loadingRecords  } = useFetch(`/api/records`);
    const [ , setDimensions ] = useState([])

    useEffect(()=>{
        let from = new Date();
        from.setDate(from.getDate() - 30)
        let to = new Date();
        updateDistRange(from, to);
        window.addEventListener('resize', () => setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
        }))
    }, [])

    const updateDistRange = (fromDate, toDate) => {
        fromDate = fromDate.toISOString().split('T')[0];
        toDate = toDate.toISOString().split('T')[0];
        get(`/api/distribution?from=${fromDate}&to=${toDate}`).then((value) => {
            setWorkoutDistribution([value])
        });
    }

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "Weekly workouts" className={ "weekly" }>
                <ModuleWorkoutDays data={ !loadingWorkouts ? [ selfWorkoutsPerWeek ] : [] } />
            </Module>
            <Module title="Workout distribution" className={ "distribution" }>
                <ModuleWorkoutDistribution data={ workoutDistribution } rangeCallback={ updateDistRange } />
            </Module>
            <Module title="Progression" className={ "progression" }>
                <ModuleSetAverages />
            </Module>
            <Module title="Exercise distribution" className={ "exercise-distribution" }>
                <ModuleExerciseDistribution />
            </Module>
            {
                !loadingRecords &&
                selfRecords.filter(e => e.exercise === "BENCH_PRESS").length > 0 &&
                selfRecords.filter(e => e.exercise === "SQUAT").length > 0 &&
                selfRecords.filter(e => e.exercise === "DEADLIFT").length > 0 ?
                <Module title="Powerlift ratios" className={ "ratios" }>
                    <ModuleBSD data={loadingRecords ? [] : [ selfRecords ]}/>
                </Module> : <></>
            }
            {
                !loadingRecords && selfRecords.length > 0 ?
                <Module title="Personal records" className={ "records" }>
                    <ModulePRs data={loadingRecords ? [] : selfRecords}/>
                </Module> : <></>
            }

            <Module title="One Repetition Max" className={ "orm" }>
                <ModuleORM />
            </Module>

            <Module title="Exercise information" className={ "info" }>
                <ModuleExerciseInfo />
            </Module>

            { !LocalStorage.get("user_preferences", 'noQuickNew', false) &&
                <NavLink to="/new">
                    <div style={addWrapStyle}>
                            <FontAwesomeIcon icon={ faPlus } style={addInnerStyle}/>
                    </div>
                </NavLink>
            }
        </div>
    );
}

const addWrapStyle = {
    backgroundColor: 'rgb(39 69 107 / 88%)',
    border: '1px solid rgba(107,166,239,0.5)',
    fontSize: 'min(12vw, 3rem)',
    borderRadius: '10rem',
    textAlign: 'center',
    width: 'min(24vw, 6rem)',
    height: 'min(24vw, 6rem)',
    right: 'min(5vw, 2rem)',
    bottom: 'min(5vw, 2rem)',
    position: 'fixed',
    cursor: 'pointer',
    filter: 'drop-shadow(0px 0px 5px black)',
    zIndex: 8,
    "&:hover": {
        width: 'min(30vw, 10rem)',
        height: 'min(30vw, 10rem)'
    },
}

const addInnerStyle = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        WebkitTransform: 'translate(-50%, -50%)',
        transform: 'translate(-50%, -50%)'
}

export default SectionStatistics;