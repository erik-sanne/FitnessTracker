import './styles/App.css';
import React, {useEffect, useState} from 'react';
import { setCookie, getCookie } from 'react-use-cookie';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Splash from "./components/Splash";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AppContent from "./AppContent";
import './styles/snow.css';
import Background from "./Background";
import Activate from "./components/Activate";

const authorizationStatus = {
    AUTHORIZED: "authorized",
    UNAUTHORIZED: "unauthorized",
    PENDING: "pending"
}

function App() {

    const [ authorized, setAuthorised ] = useState(authorizationStatus.PENDING);
    const [ showSplash, setShowSplash ] = useState(true);

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
        fetch(`${ process.env.REACT_APP_API_BASE }/validate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }).then(response => {

            if (response.ok) {
                setAuthorised(authorizationStatus.AUTHORIZED);
                setShowSplash(false);
        }else
                throw new Error('Unauthorized');

        }).catch(_ => {
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
                    <Route path="/activate/:token">
                        <Activate/>
                    </Route>
                    <Route path="/">
                        <Redirect to="/login" />
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }

    return (
        <>
            <Background />
            <AppContent logoutCallback={ logoutCallback } />
            <Splash show={ showSplash } />
        </>
    );
}

export default App;
