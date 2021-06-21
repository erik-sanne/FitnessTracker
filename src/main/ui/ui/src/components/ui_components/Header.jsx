import React from 'react';
import {NavLink} from "react-router-dom";

const Header = ({ title }) => {
    return (
        <header>
                <h2 className={ 'header' }>
                    <NavLink to="/general" style={{ color: 'inherit', textDecoration: 'none'}}>
                       { title }
                    </NavLink>
                </h2>
        </header>
    );
}

export default Header;