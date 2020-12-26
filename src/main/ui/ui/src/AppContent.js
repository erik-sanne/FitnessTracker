import React, {useEffect, useState} from 'react';
import Header from "./components/ui_components/Header";
import { Redirect, BrowserRouter, Route, Switch } from "react-router-dom";
import SectionStatistics from "./components/SectionStatistics";
import Menu from "./components/Menu";
import Burger from "./components/ui_components/Burger";
import SectionNewWorkout from "./components/SectionNewWorkout";
import SectionHistory from "./components/SectionHistory";
import useFetch from "./services/useFetch";
import Splash from "./components/Splash";
import ModuleEditProfile from "./components/modules/ModuleEditProfile";
import SectionSettings from "./components/SectionSettins";
import SectionFriends from "./components/SectionFriends";
import SectionStatisticsWithFriend from "./components/SectionStatisticsWithFriend";

const AppContent = ({ logoutCallback }) => {
    const [ menuOpen, setMenuOpen ] = useState(false)
    const [ currentUserProfile, setCurrentUserProfile ] = useState(null)
    const { data: loadedProfile, loading } = useFetch('/users/profile')

    const burgerClick = () => {
        setMenuOpen(!menuOpen);
    }

    const clickOutside = () => {
        if (menuOpen) setMenuOpen(false)
    }

    const onNavigate = () => {
        setMenuOpen(false)
    }

    const updateUserProfile = (profile) => setCurrentUserProfile(profile);

    useEffect(() => {
        setCurrentUserProfile(loadedProfile);
    }, [loadedProfile, loading])


    if (loading)
        return <Splash />

    if (currentUserProfile == null)
        return ( <section className={"page-wrapper"}>
                    <ModuleEditProfile required={true} updateUserProfile={ updateUserProfile }/>
                </section>
        )

    return(
        <BrowserRouter>
            <section onClick={ clickOutside } >
                <Switch>
                    <Route path="/general">
                        <Header title={ "My Statistics" } onClick={ burgerClick } />
                        <SectionStatistics />
                    </Route>
                    <Route path="/history">
                        <Header title={ "History" } onClick={ burgerClick } />
                        <SectionHistory />
                    </Route>
                    <Route path="/new">
                        <Header title={ "New Workout" } onClick={ burgerClick } />
                        <SectionNewWorkout />
                    </Route>
                    <Route path="/social">
                        <Header title={ "Friends" } onClick={ burgerClick } />
                        <SectionFriends userProfile={ currentUserProfile } updateUserProfile={ updateUserProfile } />
                    </Route>
                    <Route path="/settings">
                        <Header title={ "User Settings" } onClick={ burgerClick } />
                        <SectionSettings userProfile={ currentUserProfile } updateUserProfile={ updateUserProfile } />
                    </Route>
                    <Route path="/friend/:friendId">
                        <Header title={ "Our Statistics" } onClick={ burgerClick } />
                        <SectionStatisticsWithFriend userProfile={ currentUserProfile } />
                    </Route>
                    <Redirect from="/" to="/general" />
                </Switch>
            </section>
            <Menu open={ menuOpen } logoutCallback={ logoutCallback } onNavigate={ onNavigate } userProfile={ currentUserProfile } />
            <Burger onClick={ burgerClick } open={ menuOpen }/>
        </BrowserRouter>
    );
}

export default AppContent;