import React from 'react';
import {setCookie} from "react-use-cookie";
import ModalLoader from "./ui_components/ModalLoader";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.submitLoginCredentials = props.submitLoginCredentials;
        this.state = {
            username: '',
            password: '',
            msg: null,
            loading: false,
            reason: new URLSearchParams(window.location.search).get('status')
        }
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit = (event) => {
        event.preventDefault();

        this.setState({...this.state, loading: true, msg: null})

        fetch(`${ process.env.REACT_APP_API_BASE }/authenticate`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    response.text().then(reason => {
                        this.setState({ ...this.state, msg: reason, loading: false, password: "" });
                    });

                    return;
                } else {
                    throw Error();
                }
            }

            response.json().then(tokenData => {
                this.setState({ ...this.state,  msg: null, loading: false });
                const token = tokenData.token;
                setCookie('session_token', token);
                this.submitLoginCredentials();
            })

        }).catch(_ => {
            this.setState({  ...this.state, msg: "An error occurred, please try again later.", loading: false, password: "" });
        });
    }

    render() {
        return (
            <>
                <div className={ 'login-background' } >
                    <div id='stars'></div>
                    <div id='stars2'></div>
                    <div id='stars3'></div>
                </div>
                <section className={'page-wrapper login'} style={{ grid: 'none' }}>
                    <form onSubmit={ this.onSubmit } className={ 'login-form' }>
                        <div className={ 'login-header' }>
                            <h4 className={ 'login-header-selected' }>Sign in</h4>
                            <h4><a href="/register">Sign up</a></h4>
                        </div>
                        <label htmlFor="username">Email</label>
                        <input name="username" type="email" autoFocus={ true } value={ this.state.username } onChange={ this.onChange }/>
                        <br/>
                        <label htmlFor="password">Password</label>
                        <input name="password" type="password" value={ this.state.password } onChange={ this.onChange }/>
                        <br/>
                        <label><p /></label>
                        <input type="submit" value="Log in" className={'btn-form'}/>
                        <div className={ 'hl' } />
                        <div style={{ display: 'flex', justifyContent: 'center'}}>
                            <i><a href="/forgot-password">Forgot password?</a></i>
                        </div>
                    </form>
                    { this.state.reason && !this.state.msg && <p style={styleStatus}>Your credentials has expired and you need to login again</p>}
                    { this.state.msg && <span style={ styleError }> { this.state.msg } </span>}
                    { this.state.loading && <ModalLoader visible={ this.state.loading } />}
                </section>
            </>
        );
    }
}

const styleError = {
    background: 'rgb(83 37 37 / 30%)',
    border: '1px solid rgb(91 52 52)',
    borderRadius: '5px',
    color: 'rgb(161 129 129)',
    padding: '0.5em 1em',
    margin: '0em 1em'
}

const styleStatus = {
    background: 'rgba(255,173,2,0.44)',
    border: '1px solid #f16b719e',
    borderRadius: '5px',
    color: 'rgb(161 129 129)',
    padding: '0.5em 1em',
    margin: '0em 1em'
}

export default Login;