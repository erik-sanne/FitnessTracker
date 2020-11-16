import React from 'react'
import ModuleWorkoutDays from "./modules/ModuleWorkoutDays";
import ModuleSetsBodypart from "./modules/ModuleSetsBodypart";
import Module from "./modules/Module";

const SectionStart = () => {
    return (
        <div className={ 'page-wrapper' }>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays />
            </Module>
            <Module title="Workout distribution">
                <ModuleSetsBodypart />
            </Module>
        </div>
    );
}

export default SectionStart;