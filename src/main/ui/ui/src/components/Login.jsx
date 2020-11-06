import React from 'react';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.submitLoginCredentials = props.submitLoginCredentials;
        this.state = {
            username: '',
            password: ''
        }
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.submitLoginCredentials( this.state )
    }

    render() {
        return (
            <section className={'container'}>
                <form onSubmit={ this.onSubmit }>
                    <h2>Sign in</h2>
                    <label htmlFor="username">Email</label>
                    <input name="username" type="email" value={ this.state.username } onChange={ this.onChange }/>
                    <br/>
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" value={ this.state.password } onChange={ this.onChange }/>
                    <br/>
                    <input type="submit" value="Log in" className={'btn-form'}/>
                    <a href="/">New user? Sign up here!</a>
                </form>
            </section>
        );
    }
}

export default Login;