import React from 'react';
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChartPie, faHistory, faPlusCircle, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from 'react-responsive';
import '../styles/glitch.css';
import ProfileDisplay from "./ui_components/ProfileDisplay";

const activeClass = {
    //bac: '#007bff'
    //background: 'rgba(107,166,239,0.7)'
    background: '#111'
}

const Menu = ({ open, logoutCallback, onNavigate, userProfile }) => {
    const smallScreen = useMediaQuery({ query: '(max-width: 400px)' });

    const trans = {
        transform: open ? 'translateX(0)' : 'translateX(+100%)',
        width: smallScreen ? '100vw' : '300px'
    }

    return (
        <div style={ trans } className={ 'menu' }>
            <NavLink to="/settings" onClick={ onNavigate }>
                <div style={{ paddingLeft: '36px'}}>
                    <ProfileDisplay profilePicture={ userProfile.profilePicture } displayName={ userProfile.displayName } userId={ userProfile.userId } permissionLevel={ userProfile.permissionLevel } />
                </div>
            </NavLink>
            <hr />
            <div>
                <ul>
                    <li>
                        <NavLink to="/general" activeStyle={activeClass} onClick={ onNavigate }>
                            <FontAwesomeIcon icon={ faChartPie } style={{ marginRight: '25px'}}/>
                            My Statistics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/history" activeStyle={activeClass} onClick={ onNavigate }>
                            <FontAwesomeIcon icon={ faHistory } style={{ marginRight: '25px'}}/>History</NavLink>
                    </li>
                    <li>
                        <NavLink to="/new" activeStyle={activeClass} onClick={ onNavigate }>
                            <FontAwesomeIcon icon={ faPlusCircle } style={{ marginRight: '25px'}}/>New Workout</NavLink>
                    </li>
                    <li>
                        <NavLink to="/social" activeStyle={ activeClass } onClick={ onNavigate } >
                            <FontAwesomeIcon icon={ faUserFriends } style={{ marginRight: '25px'}}/>Friends
                        </NavLink>
                    </li>
                </ul>
            </div>
            {
                userProfile.permissionLevel !== 'BASIC' &&
                <p style={{
                    position: 'absolute',
                    left: '45px',
                    bottom: '20px',
                    cursor: "pointer"
                }}>
                    <NavLink to="/updates" onClick={ onNavigate } style={{
                        color: '#fff'
                    }}>
                        Version history
                    </NavLink>
                </p>
            }
            <p onClick={ logoutCallback } style={ {position: 'absolute', right: '45px', bottom: '20px', cursor: "pointer" } } >Logout</p>
        </div>
    )
}

export default Menu;