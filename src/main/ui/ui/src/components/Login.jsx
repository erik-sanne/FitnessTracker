import React from 'react';
import { setCookie } from "react-use-cookie";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.submitLoginCredentials = props.submitLoginCredentials;
        this.state = {
            username: '',
            password: '',
            msg: null
        }
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const tokenResponse = await fetch(`${ process.env.API_BASE }/authenticate`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })

        if (!tokenResponse.ok) {
            if (tokenResponse.status === 401) {
                tokenResponse.text().then(reason => {
                    this.setState({ msg: reason, password: "" });
                })
            }
            return;
        }

        this.setState({ error: null });

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;
        setCookie('session_token', token);
        this.submitLoginCredentials();
    }

    render() {
        return (
            <section className={'page-wrapper'}>
                <form onSubmit={ this.onSubmit }>
                    <h2>Sign in</h2>
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

export default Login;