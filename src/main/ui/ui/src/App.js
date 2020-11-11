import './styles/App.css';
import React, {useEffect, useState} from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { getCookie, setCookie } from 'react-use-cookie';
import Base64 from 'base-64';
import Header from "./components/Header";
import Menu from "./components/Menu";
import SectionStart from "./components/SectionStart";
import Splash from "./components/Splash";
import Login from "./components/Login";

const authorizationStatus = {
    AUTHORIZED: "authorized",
    UNAUTHORIZED: "unauthorized",
    PENDING: "pending"
}

function App() {

    const [ authorized, setAuthorised ] = useState(authorizationStatus.PENDING);
    const [ err, setError ] = useState([]);

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
        return <Login errors={ err } submitLoginCredentials={ credentialsSuccessfullySubmitted }/>

    return (
      <BrowserRouter>
          <Header />
          <section>
              <Switch>
                  <Route path="/history">
                      <h2>History</h2>
                  </Route>
                  <Route path="/">
                      <SectionStart />
                  </Route>
              </Switch>
          </section>
          <Menu />
      </BrowserRouter>
    );
}

export default App;
