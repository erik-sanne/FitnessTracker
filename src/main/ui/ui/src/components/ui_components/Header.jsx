import React from 'react';
import {NavLink} from "react-router-dom";

const Header = ({ title }) => {
    return (
        <header>
                <h2 className={ 'header' }>
                    <NavLink to="/general" style={{ color: 'inherit', textDecoration: 'none'}}>
                       { title } { getCelebrationText() && <span className={'pulsate'} style={celebrationStyle}>{getCelebrationText()}</span> }
                    </NavLink>
                </h2>
        </header>
    );
}

const getCelebrationText = () => {
    const date = new Date();
    if (date.getMonth() == 10)
        return `✨ Happy ${date.getFullYear()-2020} year anniversary! ✨`
    return "";
}


const celebrationStyle = {
    fontSize: '0.4em',
    color: '#ffd200',
    position: 'absolute',
    left: '2em',
    bottom: '1em',
    filter: 'drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black)'
}

export default Header;