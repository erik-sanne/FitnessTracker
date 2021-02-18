import React from 'react'
import ModuleWorkoutDays from "./modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "./modules/ModuleWorkoutDistribution";
import Module from "./modules/Module";
import ModuleSetAverages from "./modules/ModuleSetAverages";
import useFetch from "../services/useFetch";
import ModuleBSD from "./modules/ModuleBSD";

const SectionStatistics = ({ userProfile }) => {
    const { data: selfWorkoutsPerWeek, loading: loadingWorkouts  } = useFetch(`/api/workoutsPerWeek`);
    const { data: selfWorkoutDistribution, loading: loadingDistribution  } = useFetch(`/api/distribution`);

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays data={ !loadingWorkouts ? [ selfWorkoutsPerWeek ] : [] } />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution data={ !loadingDistribution ? [ selfWorkoutDistribution ] : [] } />
            </Module>
            <Module title="Powerlift ratios">
                <ModuleBSD data={ userProfile ? userProfile.personalRecords : [] } />
            </Module>
            <Module title="Progression">
                <ModuleSetAverages />
            </Module>
        </div>
    );
}

export default SectionStatistics;