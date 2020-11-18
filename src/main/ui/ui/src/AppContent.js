import React, {useState} from 'react';
import Header from "./components/Header";
import {Redirect, BrowserRouter, Route, Switch} from "react-router-dom";
import SectionStatistics from "./components/pages/SectionStatistics";
import Menu from "./components/Menu";
import Burger from "./components/Burger";
import SectionNewWorkout from "./components/pages/SectionNewWorkout";

const AppContent = ({ logoutCallback }) => {
    const [menuOpen, setMenuOpen] = useState(false)

    const burgerClick = () => {
        setMenuOpen(!menuOpen);
    }

    return(
        <BrowserRouter>
            <section>
                <Switch>
                    <Route path="/general">
                        <Header title={ "My Statistics" } onClick={ burgerClick } />
                        <SectionStatistics />
                    </Route>
                    <Route path="/history">
                        <Header title={ "History " } onClick={ burgerClick } />
                        <section className={ 'page-wrapper' }>
                            <p> To be created... </p>
                        </section>
                    </Route>
                    <Route path="/new">
                        <Header title={ "New workout" } onClick={ burgerClick } />
                        <SectionNewWorkout />
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