import React from 'react';
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faHistory, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from 'react-responsive';

const activeClass = {
    color: '#007bff'
}

const Menu = ({ open, logoutCallback, onNavigate }) => {
    const smallScreen = useMediaQuery({ query: '(max-width: 400px)' });

    const trans = {
        transform: open ? 'translateX(0)' : 'translateX(+100%)',
        width: smallScreen ? '100vw' : '300px'
    }

    return (
        <div style={ trans } className={ 'menu' }>
            <ul>
                <p> Menu will be styled soon enough... </p>
                <li>
                    <NavLink to="/general" activeStyle={activeClass} onClick={ onNavigate }>
                        <FontAwesomeIcon icon={ faChartPie } style={{ marginRight: '5px'}}/>
                        My Statistics
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/history" activeStyle={activeClass} onClick={ onNavigate }>
                        <FontAwesomeIcon icon={ faHistory } style={{ marginRight: '5px'}}/>History</NavLink>
                </li>
                <li>
                    <NavLink to="/new" activeStyle={activeClass} onClick={ onNavigate }>
                        <FontAwesomeIcon icon={ faPlusCircle } style={{ marginRight: '5px'}}/>New Workout</NavLink>
                </li>
            </ul>
            <p onClick={ logoutCallback } style={ {position: 'absolute', right: '45px', bottom: '20px', cursor: "pointer" } } >Logout</p>
        </div>
    )
}

export default Menu;