import React from 'react';
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faHistory, faPlusCircle, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from 'react-responsive';
import '../styles/glitch.css';

const activeClass = {
    //bac: '#007bff'
    //background: 'rgba(107,166,239,0.7)'
    background: '#111'
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
                    <NavLink to="/social" activeStyle={ activeClass } onClick={ onNavigate } className={ 'glitch' }>
                        <FontAwesomeIcon icon={ faQuestion } style={{ marginRight: '25px'}}/>
                    </NavLink>
                </li>
            </ul>
            <p onClick={ logoutCallback } style={ {position: 'absolute', right: '45px', bottom: '20px', cursor: "pointer" } } >Logout</p>
        </div>
    )
}

export default Menu;