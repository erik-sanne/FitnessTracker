import React from "react";
import Module from "./Module";
import {getCookie} from "react-use-cookie";
import { Buffer } from 'buffer';

const AccountSettings = () => {

    const registeredEmail = String(Buffer.from(getCookie('session_token'), 'base64')).split(":")[0]

    return (
        <Module title={ "Account" }>
            <br />
            <p>Registered email: { registeredEmail }</p>
            <p>Modifications unavailable at this time</p>
        </Module>
    )
}


export default AccountSettings;