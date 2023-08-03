import React, {useState} from 'react';
import ModalLoader from "./ui_components/ModalLoader";
import {useParams} from "react-router";

const ResetPassword = () => {
    const LOADING = "LOADING", SUCCESS = "SUCCESS", ERROR = "ERROR", FAULTY="FAULTY", NONE = "NONE";
    const { token } = useParams();

    const [ state, setState ] = useState({
        newPassword: '',
        confirmPassword: '',
        status: NONE,
    })

    const onChange = (event) => {
        setState(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (state.newPassword.trim() === "" || state.newPassword !== state.confirmPassword) {
            setState(prev => ({...prev, status: FAULTY}))
            return
        }

        setState(prev => ({...prev, status: LOADING}))

        fetch(`${ process.env.REACT_APP_API_BASE }/change-password`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: state.newPassword,
                oldPassword: "",
                token: token
            })
        }).then(response => {
            if (response.ok)
                setState(prev => ({...prev, status: SUCCESS }))
            else
                throw response;
        }).catch(_ => {
            setState(prev => ({  ...prev, status: ERROR }));
        });
    }

    return (
        <section className={'page-wrapper'} style={{ grid: 'none' }}>
            <form onSubmit={ onSubmit }>
                <h2>Enter new Password</h2>
                <label htmlFor="newPassword">New password:</label>
                <input name="newPassword" id="newPassword" type="password" autoFocus={ true } value={ state.newPassword } onChange={ onChange }/>
                <label htmlFor="confirmPassword">Confirm new password:</label>
                <input name="confirmPassword" id="confirmPassword" type="password" autoFocus={ true } value={ state.confirmPassword } onChange={ onChange }/>
                <input type={ 'submit' } value={ 'Change password' }/>
            </form>
            <ModalLoader
                visible={ state.status !== NONE }
                onClose={ () => setState({
                    newPassword: '',
                    confirmPassword: '',
                    status: NONE,
                })}
                error={ state.status === ERROR ? "Could not send reset password link" : state.status === FAULTY ? "Entered passwords does not match" : "" }
                success={ state.status === SUCCESS && "Your password has been changed!" }
            ></ModalLoader>
        </section>
    );

}

export default ResetPassword;