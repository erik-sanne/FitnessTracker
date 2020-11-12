import React from 'react'
import ModuleWorkoutDays from "./modules/ModuleWorkoutDays";
import ModuleSetsBodypart from "./modules/ModuleSetsBodypart";

const SectionStart = () => {
    return (
        <div className={ 'page-wrapper' }>
            <ModuleWorkoutDays />
            <ModuleSetsBodypart />
        </div>
    );
}

export default SectionStart;