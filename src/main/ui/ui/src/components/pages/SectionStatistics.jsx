import React from 'react'
import ModuleWorkoutDays from "../modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "../modules/ModuleWorkoutDistribution";
import Module from "../modules/Module";
import ModuleSetAverages from "../modules/ModuleSetAverages";

const SectionStatistics = () => {
    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution />
            </Module>
            <Module title="Progression">
                <ModuleSetAverages />
            </Module>
        </div>
    );
}

export default SectionStatistics;