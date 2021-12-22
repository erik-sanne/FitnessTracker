import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import '../../styles/animations.css';

const Burger = ({ onClick, open }) => {

    const styleBurger = {
        cursor: 'pointer',
        position: 'fixed',
        top: '19px',
        fontSize: '2rem',
        right: '20px',
        zIndex: 20,
    }

    return (
        <FontAwesomeIcon onClick={ onClick } icon={ open ? faTimes : faBars } style={ styleBurger }/>
    );
}

export default Burger;