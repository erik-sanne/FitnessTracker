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

const SectionStatistics = () => {
    const { data: selfWorkoutsPerWeek, loading: loadingWorkouts  } = useFetch(`/api/workoutsPerWeek`);
    const [ workoutDistribution, setWorkoutDistribution ] = useState([]);
    const { data: selfRecords, loading: loadingRecords  } = useFetch(`/api/records`);

    useEffect(()=>{
        let from = new Date();
        from.setDate(from.getDate() - 30)
        let to = new Date();
        updateDistRange(from, to);
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
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays data={ !loadingWorkouts ? [ selfWorkoutsPerWeek ] : [] } />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution data={ workoutDistribution} rangeCallback={ updateDistRange } />
            </Module>
            {
                !loadingRecords &&
                selfRecords.filter(e => e.exercise === "BENCH_PRESS").length > 0 &&
                selfRecords.filter(e => e.exercise === "SQUAT").length > 0 &&
                selfRecords.filter(e => e.exercise === "DEADLIFT").length > 0 ?
                <Module title="Powerlift ratios">
                    <ModuleBSD data={loadingRecords ? [] : [ selfRecords ]}/>
                </Module> : <></>
            }
            {
                !loadingRecords && selfRecords.length > 0 ?
                <Module title="Weight records">
                    <ModulePRs data={loadingRecords ? [] : selfRecords}/>
                </Module> : <></>
            }
            <Module title="Progression">
                <ModuleSetAverages />
            </Module>

            <Module title="One Repetition Max">
                <ModuleORM />
            </Module>

            <Module title="Exercise information">
                <ModuleExerciseInfo />
            </Module>
        </div>
    );
}

export default SectionStatistics;