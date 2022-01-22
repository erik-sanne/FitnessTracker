import React, {useState} from "react";
import ModuleEditProfile from "./modules/ModuleEditProfile";
import { Redirect } from "react-router-dom";
import ModulePreferences from "./modules/ModulePreferences";
import ModuleHardStats from "./modules/ModuleHardStats";

const SectionSettings = ({ userProfile, updateUserProfile }) => {
    const [ redirect, setRedirect ] = useState(false);

    const saveInterceptor = (profile) => {
        updateUserProfile(profile);
        setRedirect(true);
    }

    if (redirect)
        return (
            <Redirect to='general' />
        );

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <ModuleEditProfile userProfile={ userProfile } updateUserProfile={ saveInterceptor } />
            <ModulePreferences/>
            <ModuleHardStats title="General stats" className={ "genstats" } />
        </div>)
}

export default SectionSettings;