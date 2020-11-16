import React from 'react';
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChartPie, faHistory, faPlusCircle} from "@fortawesome/free-solid-svg-icons";

const activeClass = {
    color: '#007bff'
}

const Menu = ({ open, logoutCallback }) => {
    const trans = {
        transform: open ? 'translateX(0)' : 'translateX(+100%)'
    }

    return (
        <div style={ trans } className={ 'menu' }>
            <ul>
                <p> Menu will be styled soon enough... </p>
                <li>
                    <NavLink to="/general" activeStyle={activeClass}>
                        <FontAwesomeIcon icon={ faChartPie } style={{ marginRight: '5px'}}/>
                        My Statistics
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/history" activeStyle={activeClass}>
                        <FontAwesomeIcon icon={ faHistory } style={{ marginRight: '5px'}}/>History</NavLink>
                </li>
                <li>
                    <NavLink to="/new" activeStyle={activeClass}>
                        <FontAwesomeIcon icon={ faPlusCircle } style={{ marginRight: '5px'}}/>New Workout</NavLink>
                </li>
            </ul>
            <p onClick={ logoutCallback } style={ {position: 'absolute', right: '45px', bottom: '20px' } } >Logout</p>
        </div>
    )
}

export default Menu;