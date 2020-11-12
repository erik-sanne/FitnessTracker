import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Burger = ({ onClick, open }) => {

    const styleBurger = {
        position: open ? 'fixed' : 'absolute',
        top: '19px',
        fontSize: '2rem',
        right: '20px',
    }

    return (
        <FontAwesomeIcon onClick={ onClick } icon={ open ? faTimes : faBars } style={ styleBurger }/>
    );
}

export default Burger;