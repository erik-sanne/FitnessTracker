import React, {useState, useEffect}  from 'react';
import {NavLink} from "react-router-dom";

const Header = ({ title }) => {
    const [ getScroll, setScroll ] = useState(window.scrollY);
    useEffect(()=>{
        const onScroll = () => setScroll(window.scrollY);
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    },[])

    const { text, color } = getCelebrationText();
    return (
        <div className={ 'header' }>
                <h2 className={ window.innerWidth < 600 && getScroll > 25 ? 'header-text header-text-shrunk' : 'header-text' }>
                    <NavLink to="/general" style={{ color: 'inherit', textDecoration: 'none', position: 'relative'}}>
                       { title } { text && <span className={'pulsate'} style={{...celebrationStyle, color: color}}>{text}</span> }
                    </NavLink>
                </h2>
        </div>
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
    if (daysLeft > -14)
        return { text: `🌸 Happy vacation! 🌸`, color: "#52e759"}


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
    right: '0em',
    bottom: '0em',
    filter: 'drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black)'
}

export default Header;