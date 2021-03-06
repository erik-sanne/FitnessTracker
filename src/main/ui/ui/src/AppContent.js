import React, {useEffect, useState} from 'react';
import Header from "./components/ui_components/Header";
import { Redirect, BrowserRouter, Route, Switch } from "react-router-dom";
import SectionStatistics from "./components/SectionStatistics";
import Menu from "./components/Menu";
import Burger from "./components/ui_components/Burger";
import SectionNewWorkout from "./components/SectionNewWorkout";
import SectionHistory from "./components/SectionHistory";
import Splash from "./components/Splash";
import ModuleEditProfile from "./components/modules/ModuleEditProfile";
import SectionSettings from "./components/SectionSettins";
import SectionFriends from "./components/SectionFriends";
import SectionStatisticsWithFriend from "./components/SectionStatisticsWithFriend";
import SectionUpdates from "./components/SectionUpdates";
import SectionMonitor from "./components/SectionMonitor";
import get from "./services/Get.jsx"
import Modal from "./components/ui_components/Modal";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const AppContent = ({ logoutCallback }) => {
    const [ menuOpen, setMenuOpen ] = useState(false)
    const [ currentUserProfile, setCurrentUserProfile ] = useState(null)
    const [ currentRecords, setCurrentRecords ] = useState(null)
    const [ newRecords, setNewRecords ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const burgerClick = () => {
        setMenuOpen(!menuOpen);
    }

    const clickOutside = () => {
        if (menuOpen) setMenuOpen(false)
    }

    const onNavigate = () => {
        setMenuOpen(false)
    }

    const updateUserProfile = () => {
        setLoading(true);
        get('/users/profile').then(profile => {
            setCurrentUserProfile(profile)
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });

        get('/api/records').then(records => {
            if (currentRecords) {
                const newRecords = records.filter(newPR => {
                    return !currentRecords.some(oldPR => {
                        return newPR.date === oldPR.date &&
                            newPR.weight === oldPR.weight &&
                            newPR.exercise === oldPR.exercise;
                    })
                });

                if (newRecords.length > 0) {
                    setNewRecords(newRecords);
                }
            }

            setCurrentRecords(records);
        })
    };

    useEffect(() => {
        updateUserProfile();
    }, [])


    if (loading)
        return <Splash />

    if (currentUserProfile == null)
        return ( <section className={"page-wrapper"}>
                    <ModuleEditProfile required={true} updateUserProfile={ updateUserProfile }/>
                </section>
        )

    return(
        <>
        <BrowserRouter>
            <section onClick={ clickOutside } >
                <Switch>
                    <Route path="/general">
                        <Header title={ "My Statistics" } onClick={ burgerClick } />
                        <SectionStatistics />
                    </Route>
                    <Route path="/history">
                        <Header title={ "History" } onClick={ burgerClick } />
                        <SectionHistory userProfile={ currentUserProfile }  />
                    </Route>
                    <Route path="/new">
                        <Header title={ "New Workout" } onClick={ burgerClick }  />
                        <SectionNewWorkout updateUserProfile={ updateUserProfile }/>
                    </Route>
                    <Route path="/edit/:workoutId">
                        <Header title={ "Edit Workout" } onClick={ burgerClick }  />
                        <SectionNewWorkout updateUserProfile={ updateUserProfile }/>
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
                    <Route path="/updates">
                        <Header title={ "Version History" } onClick={ burgerClick } />
                        <SectionUpdates/>
                    </Route>
                    <Route path="/monitor">
                        <Header title={ "Health check" } onClick={ burgerClick } />
                        <SectionMonitor/>
                    </Route>
                    <Redirect from="/" to="/general" />
                </Switch>
            </section>
            <Menu open={ menuOpen } logoutCallback={ logoutCallback } onNavigate={ onNavigate } userProfile={ currentUserProfile } />
            <Burger onClick={ burgerClick } open={ menuOpen }/>
        </BrowserRouter>
            <Modal visible={ newRecords } title="New Personal Best!" onClose={ () => setNewRecords(null) }>
                <h2>Congratulations!<FontAwesomeIcon icon={ faStar } style={{ paddingLeft: '12px', color: '#ffc877', width: 'inherit'}}/> </h2>
                <p>Your hard work is paying off! You just hit a new personal record in {newRecords && newRecords.map((pr, idx, arr) =>
                    <>
                        <span>{(idx > 0 ? idx === arr.length-1 ? ' and ' : ', ' : '')}</span>
                        <strong>{ camelCase(pr.exercise.replace(/_/g, ' '))}</strong>
                    </>)}
                </p>
            </Modal>
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default AppContent;