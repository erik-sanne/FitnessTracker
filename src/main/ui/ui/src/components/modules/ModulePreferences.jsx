import React, {useEffect, useState} from "react";
import Module from "./Module";
import {Switch} from "@material-ui/core";
import LocalStorage from "../../services/LocalStorage";

const ModulePreferences = () => {
    const LS_KEY_UP = "user_preferences"

    const [ highContrast, setHighContrast ] = useState(false);
    const [ collapseSets, setCollapseSets ] = useState(false);
    const [ fullColorManikin, setFullColorManikin ] = useState(false);
    const [ noQuickNew, setNoQuickNew ] = useState(false);

    useEffect(() => {
        const userPreferences = LocalStorage.get(LS_KEY_UP);
        if (!userPreferences)
            return;

        setHighContrast(userPreferences.highContrast);
        setCollapseSets(userPreferences.collapseSets);
        setFullColorManikin(userPreferences.fullColorManikin);
        setNoQuickNew(userPreferences.noQuickNew);
    }, [])


    const save = () => {
        LocalStorage.set(LS_KEY_UP, {
            highContrast: highContrast,
            collapseSets: collapseSets,
            fullColorManikin: fullColorManikin,
            noQuickNew: noQuickNew
        });
        window.location.reload();
    }

    return (
        <Module title={"Preferences"}>
            <div className={'centerC'} style={{ justifyContent: 'start' }}>
                <p>General UI</p>
                <div>
                    <Switch color="primary" checked={ highContrast } disabled={ true }/>
                    <label style={{ cursor: 'pointer' }}>
                        Enable high contrast
                    </label>
                </div>
                <br />
                <p>Statistics</p>
                <div onClick={ () => setFullColorManikin(!fullColorManikin) }>
                    <Switch color="primary" checked={ fullColorManikin }/>
                    <label style={{ cursor: 'pointer' }}>
                        Full color manikin
                    </label>
                </div>
                <div onClick={ () => setNoQuickNew(!noQuickNew) }>
                    <Switch color="primary" checked={ noQuickNew }/>
                    <label style={{ cursor: 'pointer' }}>
                        Hide quick-button for new workout
                    </label>
                </div>
                <p>New workout</p>
                <div onClick={ () => setCollapseSets(!collapseSets) }>
                    <Switch color="primary" checked={ collapseSets }/>
                    <label style={{ cursor: 'pointer' }}>
                        Collapse consecutive sets
                    </label>
                </div>

            </div>
            <div style={buttonWrapperStyle}>
                <input
                    style={ submitButtonStyle }
                    type={"submit"}
                    value={ "Save changes & reload" }
                    onClick={ save }
                />
            </div>
        </Module>
    )
}

const buttonWrapperStyle = {
    display: 'flex',
    flexDirection: 'row-reverse'
}

const submitButtonStyle = {
    flex: 1,
    maxWidth: '300px'
}

export default ModulePreferences;