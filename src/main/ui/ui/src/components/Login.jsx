import React from 'react';

const Login = () => {
    return (
        <section className={ 'container' }>
            <form action="/login" method="POST">
                <label htmlFor="username">Email</label>
                <input name="username" type="email"/>
                <br />
                <label htmlFor="password">Password</label>
                <input name="password" type="password"/>
                <br />
                <input type="submit" value="Log in" className={'btn-form'}/>
                <a href="/">New user? Sign up here!</a>
            </form>
        </section>
    );
}

export default Login;