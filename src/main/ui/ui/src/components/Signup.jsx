import React, {useState} from 'react';
import Spinner from "react-bootstrap/Spinner";

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

        fetch(`http://localhost:8080/register`, {
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
        })
    }

    return (
        <section className={'page-wrapper'}>
            <form onSubmit={ submitHandler }>
                <h2>Sign up</h2>
                { errorMessage && <span style={ styleError }> { errorMessage } </span>}
                { responseMessage && <span style={ styleSuccess }> { responseMessage } </span>}
                { loading && <Spinner animation="grow" />}
                <label htmlFor="email">Email</label>
                <input name="email" type="email" autoFocus={ true } value={ userInfo.email } onChange={ changeHandler } disabled={ loading ? "disabled" : "" }/>
                <br/>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" value={ userInfo.password } onChange={ changeHandler } disabled={ loading ? "disabled" : "" }/>
                <br/>
                <label htmlFor="password_verification">Verify password</label>
                <input name="password_verification" type="password" value={ userInfo.password_verification } onChange={ changeHandler } disabled={ loading ? "disabled" : "" }/>
                <br/>
                <input type="submit" value="Register" className={'btn-form'}/>

                <a href="/login">I already have an account!</a>
            </form>
        </section>
    );
}

const styleError = {
    background: '#f16b719e',
    border: '1px solid #f16b719e',
    padding: '5px'
}

const styleSuccess = {
    background: 'rgb(157 236 130 / 62%)',
    border: '1px solid rgb(80 193 59 / 62%)',
    padding: '5px'
}


export default Signup;