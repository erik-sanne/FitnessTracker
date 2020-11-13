import React from 'react';
import { NavLink } from 'react-router-dom'

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
                    <NavLink to="/general" activeStyle={activeClass}>General Stats</NavLink>
                </li>
                <li>
                    <NavLink to="/history" activeStyle={activeClass}>History</NavLink>
                </li>
            </ul>
            <p onClick={ logoutCallback } style={ {position: 'absolute', right: '45px', bottom: '20px' } } >Logout</p>
        </div>
    )
}

export default Menu;