import React, {useState} from "react";
import Module from "./Module";
import {getCookie} from "react-use-cookie";
import { Buffer } from 'buffer';
import post from "../../services/Post";
import ModalLoader from "../ui_components/ModalLoader";

const AccountSettings = () => {
    const ERR_EMPTY_FIELD = "empty_field", ERR_CONFIRM_MISMATCH = "conf_mismatch", ERR_PASSWORD = "err_pass", ERR_EMAIL="err_email", SUCCESS_PASSWORD = "success_password", SUCCESS_EMAIL="success_email", NONE = ""

    const registeredEmail = String(Buffer.from(getCookie('session_token'), 'base64')).split(":")[0]
    const [ status, setStatus ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ state, setState ] = useState({
        newEmail: "",
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

    const submitEmail = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading)
            return

        if (state.newEmail.trim() === "") {
            setStatus(ERR_EMPTY_FIELD);
            return;
        }

        setLoading(true)

        post(`/change-email`, JSON.stringify({ email: state.newEmail })
        ).then(() => {
            setState(prevState => {
                return { ...prevState,
                    newEmail: ""
                }})
            setLoading(false)
            setStatus(SUCCESS_EMAIL)
            return
        }).catch((_) => {
            setLoading(false)
            setStatus(ERR_EMAIL);
        })
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
            setState(prevState => {
                return { ...prevState,
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
            }})
            setLoading(false)
            setStatus(SUCCESS_PASSWORD)
            return
        }).catch((_) => {
            setLoading(false)
            setStatus(ERR_PASSWORD);
        })

        return false;
    }

    return (
        <Module title={ "Account settings" }>
            <br />
            <h5>Change email:</h5>
            <form style={formStyle} onSubmit={ submitEmail }>
                <p>Registered email: { registeredEmail }</p>
                <label htmlFor={ 'new-email' }>New email:</label>
                <input id={'new-email'} type={ 'email' } className={'mini'} onChange={ e => changeHandler('newEmail', e.target.value) }/>
                <input type={ 'submit' } className={ 'mini' } value={ 'Send verification email' }/>
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
                status === SUCCESS_PASSWORD ? <>
                    <p style={{ textAlign: 'center' }}>Password changed!</p>
                    <p style={{ textAlign: 'center' }}>The next time you log in you will use your new password. We suggest that you manually log out your account now.</p>
                </> : status === SUCCESS_EMAIL ? <>
                    <p style={{ textAlign: 'center' }}>A verification email has been sent to your new email address. Follow the included link to complete your change.</p>
                </> : null
            } error={
                ![NONE, SUCCESS_PASSWORD, SUCCESS_EMAIL].includes(status) && <>
                { status === ERR_EMPTY_FIELD && <p>Required fields are empty</p> }
                { status === ERR_CONFIRM_MISMATCH && <p>Confirm password does not match new password</p> }
                { status === ERR_PASSWORD && <div style={{ padding: '1em'}}>
                    <p style={{ textAlign: 'center' }}>Password change failed. Either your current password did not match, or the new password did not meet the criteria of a valid password.</p>
                    A valid password must satisfy the following rules:
                    <ul>
                        <li>Password must be 8-32 characters</li>
                        <li>Password must contain a digit</li>
                        <li>Password must contain a lower case letter</li>
                        <li>Password must contain an upper case letter</li>
                        <li>Password must not contain whitespaces</li>
                    </ul>
                </div> }
                { status === ERR_EMAIL && <div style={{ padding: '1em'}}>
                    <p style={{ textAlign: 'center' }}>Failed to change email address</p>
                    Possible causes:
                    <ul>
                        <li>The submitted email address is not valid</li>
                        <li>The submitted email address is already used</li>
                    </ul>
                </div> }
            </>} onClose={ () => setStatus(NONE)} />
        </Module>
    )
}

const formStyle = { width: 'inherit', maxWidth: 'inherit', boxShadow: '0px 0px 0px' }

export default AccountSettings;