import React from 'react';
import { NavLink } from 'react-router-dom'

const activeClass = {
    color: 'green'
}

const Menu = () => {
    return (
        <ul>
            <li>
                <NavLink to="/history" activeStyle={activeClass}>History</NavLink>
            </li>
            <li>
                <NavLink to="/temp1" activeStyle={activeClass}>TEMP1</NavLink>
            </li>
            <li>
                <NavLink to="/temp2" activeStyle={activeClass}>TEMP2</NavLink>
            </li>
        </ul>
    )
}

export default Menu;