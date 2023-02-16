import React from 'react';
import {setCookie} from "react-use-cookie";
import Loader from "./ui_components/Loader";

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
            <section className={'page-wrapper'}>
                <form onSubmit={ this.onSubmit }>
                    <h2>Sign in</h2>
                    { this.state.reason && !this.state.msg && <p style={styleStatus}>Your credentials has expired and you need to login again</p>}
                    { this.state.loading && <Loader/>}
                    { this.state.msg && <span style={ styleError }> { this.state.msg } </span>}
                    <label htmlFor="username">Email</label>
                    <input name="username" type="email" autoFocus={ true } value={ this.state.username } onChange={ this.onChange }/>
                    <br/>
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" value={ this.state.password } onChange={ this.onChange }/>
                    <br/>
                    <input type="submit" value="Log in" className={'btn-form'}/>
                    <a href="/register">New user? Sign up here!</a>
                </form>
            </section>
        );
    }
}

const styleError = {
    background: '#f16b719e',
    border: '1px solid #f16b719e',
    padding: '5px'
}

const styleStatus = {
    background: 'rgba(255,173,2,0.44)',
    border: '1px solid #f16b719e',
    padding: '5px'
}

export default Login;