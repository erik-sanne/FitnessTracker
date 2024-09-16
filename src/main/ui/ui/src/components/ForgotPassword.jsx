import React, {useState} from 'react';
import ModalLoader from "./ui_components/ModalLoader";

const ForgotPassword = () => {

    const LOADING = "LOADING", SUCCESS = "SUCCESS", ERROR = "ERROR", NONE = "NONE";

    const [ state, setState ] = useState({
        email: '',
        status: NONE,
    })

    const onChange = (event) => {
        setState(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const onSubmit = (event) => {
        event.preventDefault();

        setState(prev => ({...prev, status: LOADING}))

        fetch(`${ process.env.REACT_APP_API_BASE }/forgot-password`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: state.email
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
        <>
            <div className={ 'login-background' } >
                <div id='stars'></div>
                <div id='stars2'></div>
                <div id='stars3'></div>
            </div>
            <section className={'page-wrapper login'} style={{ grid: 'none' }}>
                <form onSubmit={ onSubmit } className={ 'login-form' }>
                    <h4 style={{ textAlign: 'center' }}>Reset Password</h4>
                    <p style={{ textAlign: 'center' }}>Enter the email address of the account you wish to reset the password for. A link to reset the password will be sent shortly.</p>
                    <br/>
                    <label htmlFor="email">Email:</label>
                    <input name="email" id="email" type="email" autoFocus={ true } value={ state.email } onChange={ onChange }/>
                    <br/>
                    <label><p /></label>
                    <input type={ 'submit' } value={ 'Send reset password link' }/>
                </form>
                <ModalLoader
                    visible={ state.status !== NONE }
                    onClose={ () => setState({
                        email: '',
                        status: NONE,
                    })}
                    error={ state.status === ERROR && "Could not send reset password link" }
                    success={ state.status === SUCCESS && "An email has been sent with a link to reset your password" }
                />
            </section>
        </>
    );

}

export default ForgotPassword;