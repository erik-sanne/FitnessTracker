import React from 'react';
import {NavLink} from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faChartPie, faPlusCircle, faTrophy, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import {useMediaQuery} from 'react-responsive';
import '../styles/glitch.css';
import ProfileDisplay from "./ui_components/ProfileDisplay";
import {faHeartbeat} from "@fortawesome/free-solid-svg-icons/faHeartbeat";
import {faCodeBranch} from "@fortawesome/free-solid-svg-icons/faCodeBranch";
import useFetch from "../services/useFetch";

const activeClass = {
    //bac: '#007bff'
    //background: 'rgba(107,166,239,0.7)'
    background: '#111'
}

const Menu = ({ open, logoutCallback, onNavigate, userProfile }) => {
    const { data: version, loading } = useFetch(`https://api.github.com/repos/erik-sanne/FitnessTracker/commits?per_page=1`, 'GET', true);
    const smallScreen = useMediaQuery({ query: '(max-width: 400px)' });

    const trans = {
        transform: open ? 'translateX(0)' : 'translateX(+100%)',
        width: smallScreen ? '100vw' : '300px'
    }

    return (
        <div style={ trans } className={ 'menu' }>
            <NavLink to={ `/profile/${userProfile.userId}` } onClick={ onNavigate }>
                <div style={{ padding: '0px 36px', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{flex: '1'}}>
                        <ProfileDisplay profilePicture={ userProfile.profilePicture } title={ userProfile.title }  displayName={ userProfile.displayName } userId={ userProfile.userId } permissionLevel={ userProfile.permissionLevel } />
                    </div>
                    <div style={{margin: 'auto' }}>

                    </div>
                  </div>
            </NavLink>
            <hr />
            <div>
                <ul>
                    <li>
                        <NavLink to="/general" activeStyle={activeClass} onClick={ onNavigate }>
                            <FontAwesomeIcon icon={ faChartPie } style={{ width: '1em', marginRight: '25px'}}/>
                            My Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/history" activeStyle={activeClass} onClick={ onNavigate }>
                            <FontAwesomeIcon icon={ faBook } style={{ width: '1em', marginRight: '25px'}}/>Logbook</NavLink>
                    </li>
                    <li>
                        <NavLink to="/social" activeStyle={ activeClass } onClick={ onNavigate } style={{ position: 'relative' }} >

                            <FontAwesomeIcon icon={ faUserFriends } style={{ width: '1em', marginRight: '25px'}}/>{ userProfile.notices.length > 0 && <span className={'counter'} style={{left: '60px',
                            bottom: '8px', background: 'rgb(166 32 0 / 71%)'}}> { userProfile.notices.length }</span> }Socials & Friends
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/achievements" activeStyle={ activeClass } onClick={ onNavigate } >
                            <FontAwesomeIcon icon={ faTrophy } style={{ width: '1em', marginRight: '25px'}}/>Achievements
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/new" activeStyle={activeClass} onClick={ onNavigate }>
                            <FontAwesomeIcon icon={ faPlusCircle } style={{ width: '1em', marginRight: '25px'}}/>New Workout</NavLink>
                    </li>
                    { userProfile.permissionLevel === 'ADMIN' &&
                        <>
                            <li>
                            </li>
                            <li>
                                <NavLink to="/monitor" activeStyle={ activeClass } onClick={ onNavigate } >
                                    <FontAwesomeIcon icon={ faHeartbeat } style={{ width: '1em', marginRight: '25px'}}/>Sys-health & Metrics
                                </NavLink>
                            </li>
                        </>
                        }
                </ul>
            </div>
            {
                <NavLink to="/updates" activeStyle={ activeClass } onClick={ onNavigate } >
                    <p style={{
                        position: 'absolute',
                        left: '45px',
                        bottom: '20px',
                        cursor: "pointer",
                        color: '#555'
                    }}> <FontAwesomeIcon icon={ faCodeBranch }/> {!loading && ` v.${version[0].sha.slice(-10)}`}
                    </p>
                </NavLink>
            }
            <p onClick={ logoutCallback } style={ {position: 'absolute', right: '45px', bottom: '20px', cursor: "pointer" } } >Logout</p>
        </div>
    )
}


export default Menu;