import React from 'react'
import ModuleWorkoutDays from "./modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "./modules/ModuleWorkoutDistribution";
import Module from "./modules/Module";
import ModuleSetAverages from "./modules/ModuleSetAverages";
import useFetch from "../services/useFetch";
import ModuleBSD from "./modules/ModuleBSD";
import ModulePRs from "./modules/ModulePRs";

const SectionStatistics = () => {
    const { data: selfWorkoutsPerWeek, loading: loadingWorkouts  } = useFetch(`/api/workoutsPerWeek`);
    const { data: selfWorkoutDistribution, loading: loadingDistribution  } = useFetch(`/api/distribution`);
    const { data: selfRecords, loading: loadingRecords  } = useFetch(`/api/records`);

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays data={ !loadingWorkouts ? [ selfWorkoutsPerWeek ] : [] } />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution data={ !loadingDistribution ? [ selfWorkoutDistribution ] : [] } />
            </Module>
            {
                !loadingRecords &&
                selfRecords.filter(e => e.exercise === "BENCH_PRESS").length > 0 &&
                selfRecords.filter(e => e.exercise === "SQUAT").length > 0 &&
                selfRecords.filter(e => e.exercise === "DEADLIFT").length > 0 ?
                <Module title="Powerlift ratios">
                    <ModuleBSD data={loadingRecords ? [] : selfRecords}/>
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
        </div>
    );
}

export default SectionStatistics;