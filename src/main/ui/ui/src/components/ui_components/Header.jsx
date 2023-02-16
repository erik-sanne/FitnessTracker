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

    const daysLeft = daysToJapan(date)
    if (daysLeft > 0)
        return { text: `✈️ Only ${daysLeft} days left`, color: "rgb(106 234 246)"}

    return {text: "", color: ""};
}

const daysToJapan = (date) =>{
    const difference = new Date("2023-04-07").getTime() - date.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
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