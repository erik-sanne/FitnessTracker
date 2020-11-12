import './styles/App.css';
import React, {useEffect, useState} from 'react';
import { getCookie } from 'react-use-cookie';
import Splash from "./components/Splash";
import Login from "./components/Login";
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

    useEffect(() => {
        if (authorized !== authorizationStatus.PENDING)
            return

        const token = getCookie('session_token')
        fetch(`http://localhost:8080/validate`, {
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

    if (authorized === authorizationStatus.UNAUTHORIZED)
        return <Login submitLoginCredentials={ credentialsSuccessfullySubmitted }/>

    return (
        <AppContent />
    );
}

export default App;
