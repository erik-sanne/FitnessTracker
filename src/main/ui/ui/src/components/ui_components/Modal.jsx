import React from "react";
import Module from "../modules/Module";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ visible=false, title="", children, onClose }) => {

    if (!visible)
        return null;

    return (
        <div style={ wrapperStyle } onClick={ (e) => { e.target === e.currentTarget && onClose() } }>
            <Module title={ title } style={{ width: 'min(90vw, 1000px)'}} >
                <FontAwesomeIcon
                    icon={ faTimes }
                    style={{ position: 'absolute', right: 'min(4vw, 32px)', top: 'min(4vw, 32px)', fontSize: 'min(calc(8px + 3.5vmin), 30px)' }}
                    onClick={ onClose }/>
                { children }
            </Module>
        </div>
    );
}

const wrapperStyle = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100vw',
    height: '100vh',
    background: "rgba(0, 0, 0, 0.9)",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5
}

export default Modal