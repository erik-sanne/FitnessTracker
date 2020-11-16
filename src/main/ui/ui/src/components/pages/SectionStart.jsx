import React from 'react'
import ModuleWorkoutDays from "../modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "../modules/ModuleWorkoutDistribution";
import Module from "../modules/Module";

const SectionStart = () => {
    return (
        <div className={ 'page-wrapper' }>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution />
            </Module>
        </div>
    );
}

export default SectionStart;