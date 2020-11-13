import React, {useState} from 'react';
import Header from "./components/Header";
import {Redirect, BrowserRouter, Route, Switch} from "react-router-dom";
import SectionStart from "./components/SectionStart";
import Menu from "./components/Menu";
import Burger from "./components/Burger";

const AppContent = ({ logoutCallback }) => {
    const [menuOpen, setMenuOpen] = useState(false)

    const burgerClick = () => {
        setMenuOpen(!menuOpen);
    }

    return(
        <BrowserRouter>
            <Header title={ "General Stats" } onClick={ burgerClick } />
            <section>
                <Switch>
                    <Route path="/general">
                        <SectionStart />
                    </Route>
                    <Route path="/history">
                        <section className={ 'page-wrapper' }>
                            <p> To be created... </p>
                        </section>
                    </Route>
                    <Redirect from="/" to="/general" />
                </Switch>
            </section>
            <Menu open={ menuOpen } logoutCallback={ logoutCallback } />
            <Burger onClick={ burgerClick } open={ menuOpen }/>
        </BrowserRouter>
    );
}

export default AppContent;