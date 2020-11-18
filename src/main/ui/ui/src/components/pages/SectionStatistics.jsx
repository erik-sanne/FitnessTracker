import React from 'react'
import ModuleWorkoutDays from "../modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "../modules/ModuleWorkoutDistribution";
import Module from "../modules/Module";

const SectionStatistics = () => {
    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution />
            </Module>
        </div>
    );
}

export default SectionStatistics;