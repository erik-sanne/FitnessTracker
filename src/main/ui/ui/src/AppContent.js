import React, {useEffect, useState} from 'react';
import Header from "./components/ui_components/Header";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
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
import {faExclamationTriangle, faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SectionAchievements from "./components/SectionAchievements";
import SectionProfile from "./components/SectionProfile";
import ModalLoader from "./components/ui_components/ModalLoader";
import {faGem} from "@fortawesome/free-regular-svg-icons";
import Spinner from "react-bootstrap/Spinner";
import FooterMenu from "./components/ui_components/FooterMenu";
import SectionChallenge from "./components/SectionChallenge";
import SectionGoals from './components/SectionGoals';

const AppContent = ({ logoutCallback }) => {
    const NOT_LOADED = "NOT_LOADED";
    const NO_PROFILE = "NO_PROFILE";
    const CONNECTION_LOSS = "CONNECTION_LOSS";
    const [ connectionStatus, setConnectionStatus ] = useState("")
    const [ menuOpen, setMenuOpen ] = useState(false)
    const [ currentUserProfile, setCurrentUserProfile ] = useState(NOT_LOADED)
    const [ currentRecords, setCurrentRecords ] = useState(null)
    const [ newRecords, setNewRecords ] = useState(null)
    const [ currentAchievements, setCurrentAchievements ] = useState(null)
    const [ newAchievements, setNewAchievements ] = useState([])
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
        get('/users/profile').then(profile => {
            setCurrentUserProfile(profile)
            setConnectionStatus("HEALTHY");
        }).catch(() => {
            setCurrentUserProfile(current => {
                if (current === NOT_LOADED || current === NO_PROFILE) {
                    setConnectionStatus("HEALTHY");
                    return NO_PROFILE
                }
                setConnectionStatus(CONNECTION_LOSS);
                return current
            })
        });

        if (currentUserProfile === NO_PROFILE)
            return; // No point continuing

        get('/api/achievements').then((achievements) => {
            const unlocked = achievements.filter(ach => ach.date)

            if (currentAchievements) {
                const newAchievements = unlocked.filter(ach => !currentAchievements.some(old => old.name === ach.name ));

                if (newAchievements.length > 0) {
                    setNewAchievements(newAchievements);
                }
            }

            setCurrentAchievements(unlocked);
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
        });
    };

    useEffect(() => {
        updateUserProfile();
        setLoading(false);
        let inter = setInterval(updateUserProfile, 10000);
        return () => clearInterval(inter);
    }, [])


    if (loading)
        return <Splash />

    if (currentUserProfile === NOT_LOADED) {
        return <ModalLoader text={ 'Loading configuration...' } visible={true}/>
    }

    if (currentUserProfile === NO_PROFILE)
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
                            <Header title={ "My Dashboard" } onClick={ burgerClick } />
                            <SectionStatistics />
                        </Route>
                        <Route path="/history">
                            <Header title={ "Logbook" } onClick={ burgerClick } />
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
                            <Header title={ "Socials & Friends" } onClick={ burgerClick } />
                            <SectionFriends userProfile={ currentUserProfile } updateUserProfile={ updateUserProfile } />
                        </Route>
                        <Route path="/settings">
                            <Header title={ "User Settings" } onClick={ burgerClick } />
                            <SectionSettings userProfile={ currentUserProfile } updateUserProfile={ updateUserProfile } />
                        </Route>
                        <Route path="/friend/:friendId">
                            <Header title={ "Compare stats" } onClick={ burgerClick } />
                            <SectionStatisticsWithFriend userProfile={ currentUserProfile } />
                        </Route>
                        <Route path="/profile/:friendId">
                            <Header title={ "User profile" } onClick={ burgerClick } />
                            <SectionProfile myProfile={ currentUserProfile } />
                        </Route>
                        <Route path="/goals">
                            <Header title={ "My goals" } onClick={ burgerClick } />
                            <SectionGoals />
                        </Route>
                        <Route path="/challenge">
                            <Header title={ "Weekly challenges" } onClick={ burgerClick } />
                            <SectionChallenge />
                        </Route>
                        <Route path="/achievements">
                            <Header title={ "My Achievements" } onClick={ burgerClick } />
                            <SectionAchievements userProfile={ currentUserProfile } updateUserProfile={ updateUserProfile }/>
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
                    <FooterMenu />
                </section>
                <Menu open={ menuOpen } logoutCallback={ logoutCallback } onNavigate={ onNavigate } userProfile={ currentUserProfile } />
                <Burger onClick={ burgerClick } open={ menuOpen } userProfile={ currentUserProfile } />
            </BrowserRouter>
            <Modal visible={ !newAchievements[0] && newRecords } title="New Personal Best!" onClose={ () => setNewRecords(null) }>
                <h4 style={{ padding: '0.5em 0' }}>Congratulations!<FontAwesomeIcon icon={ faStar } style={{ paddingLeft: '12px', color: '#ffc877', width: 'inherit'}}/> </h4>
                <p>Your hard work is paying off! You just hit a new personal record in {newRecords && newRecords.map((pr, idx, arr) =>
                    <>
                        <span>{(idx > 0 ? idx === arr.length-1 ? ' and ' : ', ' : '')}</span>
                        <strong>{ camelCase(pr.exercise.replace(/_/g, ' '))}</strong>
                    </>)}
                </p>
            </Modal>
            <Modal visible={ newAchievements[0] } title="Achievement unlocked!" onClose={ () => setNewAchievements((achievements) => achievements.slice(1)) }>
                { newAchievements && newAchievements[0] && <>
                        <h4 style={{padding: '0.5em 0'}}> {newAchievements[0].name} <FontAwesomeIcon icon={ faGem } style={{ paddingLeft: '12px', width: 'inherit'}}/> </h4>
                        <p><i> {newAchievements[0].description} </i></p>
                    </>
                }
            </Modal>
            { connectionStatus === CONNECTION_LOSS && <div className={'alert-msg'}>
                <FontAwesomeIcon icon={ faExclamationTriangle } style={{ color: '#ff8f00' }} /> <Spinner animation={"border"} style={{
                width: '1em',
                height: '1em',
                border: '0.1em solid currentcolor',
                borderRightColor: 'transparent'
            }}/> Connection Loss... </div> }
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default AppContent;