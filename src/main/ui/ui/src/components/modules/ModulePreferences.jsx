import React, {useEffect, useState} from "react";
import Module from "./Module";
import {Switch} from "@material-ui/core";

const ModulePreferences = () => {
    const LS_KEY_UP = "user_preferences"

    const [ highContrast, setHighContrast ] = useState(false);

    useEffect(() => {
        const userPreferences = JSON.parse(localStorage.getItem(LS_KEY_UP));
        if (!userPreferences)
            return;

        setHighContrast(userPreferences.highContrast);
    }, [])


    const save = () => {
        localStorage.setItem(LS_KEY_UP, JSON.stringify({
            highContrast: highContrast
        }));
        window.location.reload();
    }

    return (
        <Module title={"Preferences"}>
            <div className={'centerC'} style={{ justifyContent: 'start' }}>
                <div onClick={ () => { setHighContrast(!highContrast) }}>
                    <label style={{ cursor: 'pointer' }}>
                        Enable high contrast
                    </label>
                    <Switch color="primary" checked={ highContrast }/>
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