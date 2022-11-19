import React from 'react';
import {NavLink} from "react-router-dom";

const Header = ({ title }) => {

    const { text, color } = getCelebrationText();
    return (
        <header>
                <h2 className={ 'header' }>
                    <NavLink to="/general" style={{ color: 'inherit', textDecoration: 'none'}}>
                       { title } { text && <span className={'pulsate'} style={{...celebrationStyle, color: color}}>{text}</span> }
                    </NavLink>
                </h2>
        </header>
    );
}

const getCelebrationText = () => {
    const date = new Date();
    if (date.getMonth() === 10)
        return { text: `✨ Happy ${date.getFullYear()-2020} year anniversary! ✨`, color: "#ffd200"}

    if (date.getMonth() === 11 && [23,24,25].includes(date.getDate()))
        return { text: `❄️ Marry christmas! ☃️❄️`, color: "#fff"}

    if (date.getMonth() === 11 && [31].includes(date.getDate()) || date.getMonth() === 0 && [1].includes(date.getDate()))
        return { text: `🎇 Happy new year! 🎆`, color: "#469DAB"}

    return {text: "", color: ""};
}

//#469DAB
const celebrationStyle = {
    fontSize: '0.4em',
    color: '#ffd200',
    position: 'absolute',
    left: '2em',
    bottom: '1em',
    filter: 'drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black)'
}

export default Header;