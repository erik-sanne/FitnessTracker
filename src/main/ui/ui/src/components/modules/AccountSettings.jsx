import React, {useState} from "react";
import Module from "./Module";
import {getCookie} from "react-use-cookie";
import { Buffer } from 'buffer';
import post from "../../services/Post";
import ModalLoader from "../ui_components/ModalLoader";

const AccountSettings = () => {
    const ERR_EMPTY_FIELD = "empty_field", ERR_CONFIRM_MISMATCH = "conf_mismatch", ERR_UNKNOWN = "unknown", SUCCESS = "success", NONE = ""

    const registeredEmail = String(Buffer.from(getCookie('session_token'), 'base64')).split(":")[0]
    const [ status, setStatus ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ state, setState ] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const changeHandler = (field, val) => {
        setState(prev => { return {
            ...prev,
            [field]: val
        }});
    }


    const changePassword = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading)
            return

        if (state.newPassword.trim() === "" || state.oldPassword.trim() === "") {
            setStatus(ERR_EMPTY_FIELD);
            return;
        }

        if (state.confirmPassword !== state.newPassword) {
            setStatus(ERR_CONFIRM_MISMATCH);
            return;
        }

        setLoading(true)

        post(`/change-password`, JSON.stringify({ newPassword: state.newPassword, oldPassword: state.oldPassword })
        ).then(() => {
            setState({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
            setLoading(false)
            setStatus(SUCCESS)
            return
        }).catch((_) => {
            setLoading(false)
            setStatus(ERR_UNKNOWN);
        })

        return false;
    }

    return (
        <Module title={ "Account settings" }>
            <br />
            <h5>Change email:</h5>
            <form style={formStyle}>
                <p>Registered email: { registeredEmail }</p>
                <label htmlFor={ 'new-email' }>New email:</label>
                <input id={'new-email'} type={ 'email' } className={'mini'} disabled={ 'disabled' } placeholder={ 'Feature not complete' } />
                <input type={ 'submit' } className={ 'mini' } disabled={ 'disabled' } value={ 'Send verification email' }/>
            </form>
            <hr style={{ width: '100%' }}/>
            <h5>Change password:</h5>
            <form style={formStyle} onSubmit={ changePassword }>
                <label htmlFor={ 'current-pwd' }>Current password:</label>
                <input id={'current-pwd'} type={ 'password' } className={'mini'} value={ state.oldPassword } onChange={ e => changeHandler('oldPassword', e.target.value) }/>
                <label htmlFor={ 'new-pwd' }>New password:</label>
                <input id={'new-pwd'} type={ 'password' } className={'mini'} value={ state.newPassword } onChange={ e => changeHandler('newPassword', e.target.value) }/>
                <label htmlFor={ 'confirm-pwd' }>Confirm new password:</label>
                <input id={'confirm-pwd'} type={ 'password' } className={'mini'} value={ state.confirmPassword } onChange={ e => changeHandler('confirmPassword', e.target.value) }/>
                <input type={ 'submit' } className={ 'mini' } value={ 'Submit new password' }/>
            </form>
            <ModalLoader visible={ loading || status } text={ 'Submitting new password' } success={
                status === SUCCESS && <>
                    <p style={{ textAlign: 'center' }}>Password changed!</p>
                    <p style={{ textAlign: 'center' }}>The next time you log in you will use your new password. We suggest that you manually log out your account now.</p>
                </>
            } error={
                ![NONE, SUCCESS].includes(status) && <>
                { status === ERR_EMPTY_FIELD && <p>Required fields are empty</p> }
                { status === ERR_CONFIRM_MISMATCH && <p>Confirm password does not match new password</p> }
                { status === ERR_UNKNOWN && <div style={{ padding: '1em'}}>
                    <p style={{ textAlign: 'center' }}>Password change failed. Either your current password did not match, or the new password did not meet the criteria of a valid password.</p>
                    A valid password must satisfy the following rules:
                    <ul>
                        <li>Password must be 8-32 characters</li>
                        <li>Password must contain a digit</li>
                        <li>Password must contain a lower case letter</li>
                        <li>Password must contain an upper case letter</li>
                        <li>Password must not contain whitespaces</li>
                    </ul>
                </div>}
            </>} onClose={ () => setStatus(NONE)} />
        </Module>
    )
}

const formStyle = { width: 'inherit', maxWidth: 'inherit', boxShadow: '0px 0px 0px' }

export default AccountSettings;