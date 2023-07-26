import React, {useState} from "react";
import ModuleEditProfile from "./modules/ModuleEditProfile";
import {Redirect} from "react-router-dom";
import ModulePreferences from "./modules/ModulePreferences";
import AccountSettings from "./modules/AccountSettings";

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
            <AccountSettings userProfile={ userProfile }/>
            <ModulePreferences userProfile={ userProfile }/>
        </div>)
}

export default SectionSettings;