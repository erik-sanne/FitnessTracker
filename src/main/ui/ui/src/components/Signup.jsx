import React, {useState} from 'react';
import ModalLoader from "./ui_components/ModalLoader";
import '../styles/stars.css';

const Signup = () => {

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        password_verification: ''
    });

    const [errorMessage, setErrorMessage ] = useState()
    const [responseMessage, setResponse ] = useState()
    const [loading, setLoading ] = useState(false)

    const changeHandler = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        });
    }

    const submitHandler = (event) => {
        event.preventDefault();
        if (userInfo.password !== userInfo.password_verification) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setErrorMessage(null);
        setResponse(null);
        setLoading(true)

        fetch(`${ process.env.REACT_APP_API_BASE }/register`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userInfo.email,
                password: userInfo.password
            })
        }).then((response) => {
            if (response.status === 202) {
                response.text().then( (notice) => {
                    setResponse(notice)
                });
                setUserInfo({
                    email: '',
                    password: '',
                    password_verification: ''
                });
                setLoading(false)
                return;
            }

            response.text().then( (reason) => {
                setErrorMessage(reason)
                setLoading(false)
            });
        }).catch((_) => {
            setErrorMessage("An error occurred, please try again later.")
            setLoading(false)
        })
    }

    return (
        <>
            <div className={ 'login-background' } >
                <div id='stars'></div>
                <div id='stars2'></div>
                <div id='stars3'></div>
            </div>
            <section className={'page-wrapper login'}>
                <form onSubmit={ submitHandler } className={ 'login-form' }>
                    <div className={ 'login-header' }>
                        <h4><a href="/login">Sign in</a></h4>
                        <h4 className={ 'login-header-selected' }>Sign up</h4>
                    </div>
                    <label htmlFor="email">Email</label>
                    <input name="email" type="email" autoFocus={ true } value={ userInfo.email } onChange={ changeHandler } disabled={ loading ? "disabled" : "" }/>
                    <br/>
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" value={ userInfo.password } onChange={ changeHandler } disabled={ loading ? "disabled" : "" }/>
                    <br/>
                    <label htmlFor="password_verification">Verify password</label>
                    <input name="password_verification" type="password" value={ userInfo.password_verification } onChange={ changeHandler } disabled={ loading ? "disabled" : "" }/>
                    <br/>
                    <label><p /></label>
                    <input type="submit" value="Register" className={'btn-form'}/>
                    <p /><p /><p />
                    { errorMessage && <span style={ styleError }> { errorMessage } </span>}
                    { responseMessage && <span style={ styleSuccess }> { responseMessage } </span>}
                    { loading && <ModalLoader visible={ loading } />}
                </form>
            </section>
        </>
    );
}

const styleError = {
    color: '#f16b719e',
    padding: '5px',
    textAlign: 'center'
}

const styleSuccess = {
    color: 'rgb(157 236 130 / 62%)',
    padding: '5px',
    textAlign: 'center'
}


export default Signup;