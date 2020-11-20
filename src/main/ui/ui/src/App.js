import './styles/App.css';
import React, {useEffect, useState} from 'react';
import { setCookie, getCookie } from 'react-use-cookie';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Splash from "./components/Splash";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AppContent from "./AppContent";

const authorizationStatus = {
    AUTHORIZED: "authorized",
    UNAUTHORIZED: "unauthorized",
    PENDING: "pending"
}

function App() {

    const [ authorized, setAuthorised ] = useState(authorizationStatus.PENDING);

    const credentialsSuccessfullySubmitted = () => {
        setAuthorised(authorizationStatus.PENDING);
    }

    const logoutCallback = () => {
        setCookie('session_token', null)
        setAuthorised(authorizationStatus.UNAUTHORIZED)
    }

    useEffect(() => {
        if (authorized !== authorizationStatus.PENDING)
            return

        const token = getCookie('session_token')
        fetch(`${ process.env.API_BASE }/validate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }).then(response => {
            if (response.ok)
                setAuthorised(authorizationStatus.AUTHORIZED);
            else
                throw new Error('Unauthorized');
        }).catch(error => {
            setAuthorised(authorizationStatus.UNAUTHORIZED);
        });
    });

    if (authorized === authorizationStatus.PENDING)
        return <Splash />;

    if (authorized === authorizationStatus.UNAUTHORIZED) {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/login">
                        <Login submitLoginCredentials={credentialsSuccessfullySubmitted}/>
                    </Route>
                    <Route path="/register">
                        <Signup/>
                    </Route>
                    <Route path="/">
                        <Redirect to="/login" />
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }

    return (
        <AppContent logoutCallback={ logoutCallback } />
    );
}

export default App;
