import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import '../../styles/animations.css';

const Burger = ({ onClick, open, userProfile }) => {

    const styleBurger = {
        cursor: 'pointer',
        position: 'fixed',
        top: '8px',
        fontSize: '2rem',
        right: '20px',
        zIndex: 20,
        width: '2rem',
        textAlign: 'center'
    }

    return (
        <div style={ styleBurger } onClick={ onClick }>
            <FontAwesomeIcon icon={ open ? faTimes : faBars }/>
            { userProfile.notices.length > 0 && <span className={'counter'} style={{ bottom: '0px', background: 'rgb(166 32 0 / 71%)' }}>{ userProfile.notices.length }</span>}
        </div>
    );
}

export default Burger;