import React from "react";
import Module from "../modules/Module";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";

const Modal = ({ visible=false, title="", children, onClose }) => {

    if (!visible)
        return null;

    return (
        <div style={ wrapperStyle } onClick={ (e) => { e.target === e.currentTarget && onClose() } }>
            <Module title={ title } style={{ width: 'min(90vw, 1000px)'}} className="modal-content">
                <FontAwesomeIcon
                    icon={faTimes}
                    style={{ position: 'absolute', right: '1rem', top: '0.5rem', fontSize: '1.5rem', cursor: "pointer" }}
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
    zIndex: 25
}

export default Modal