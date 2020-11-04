import './styles/App.css';
import React, {useEffect, useState} from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import SectionStart from "./components/SectionStart";
import Splash from "./components/Splash";
import Login from "./components/Login";

const authorizationStatus = {
    AUTHORIZED: "authorized",
    UN_AUTORIZED: "unauthorized",
    PENDING: "pending"
}

function App() {
    const [ authorized, setAuthorised ] = useState(authorizationStatus.PENDING);

    useEffect(() => {
        const exec = async () => {
            /*const resp = await fetch(`http://localhost:8080/api/test/${1}`, {
                method: 'GET',
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const data = await resp.json();

            */

            // TEMP
            setAuthorised(authorizationStatus.UN_AUTORIZED);
        }

        exec();

    },[])


    if (authorized === authorizationStatus.PENDING)
        return <Splash />;

    if (authorized === authorizationStatus.UN_AUTORIZED)
        return <Login />

    return (
      <BrowserRouter>
          <Header />
          <p>{ `authorized: ${authorized}` }</p>
          <section className={ 'container' }>
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
