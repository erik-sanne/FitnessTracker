import React from 'react'
import Module from "./modules/Module";
import ModuleWeeklyMissions from "./modules/ModuleWeeklyMissions";
import ModuleSeason from "./modules/ModuleSeason";

const SectionChallenge = () => {

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title={ "Season statistics" } className={ "season" }>
                <ModuleSeason />
            </Module>
            <Module title = "Weekly missions" className={ "missions" }>
                <ModuleWeeklyMissions />
            </Module>
        </div>
    );
}

export default SectionChallenge;