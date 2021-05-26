import React from "react";
import Spinner from "../ui_components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {faTimesCircle} from "@fortawesome/free-regular-svg-icons";

const ModalLoader = ({ visible=false, text="", error="", onClose }) => {

    if (!visible)
        return null;

    return (
        <div style={ wrapperStyle }>
            {
                error &&
                <FontAwesomeIcon
                    icon={ faTimes }
                    style={{ position: 'absolute', right: '24px', top: '24px', fontSize: 'min(calc(8px + 3.5vmin), 30px)' }}
                    onClick={ onClose }/>
            }

            { !error &&
                <>
                    <Spinner />
                    <p>{ text }</p>
                </>
            }

            { error &&
                <>
                    <FontAwesomeIcon icon={ faTimesCircle } style={{ ...errorStyle, fontSize: '32px' }}/>
                    <p style={ errorStyle } > { error }</p>
                </>
            }
        </div>
    );
}

const errorStyle = {
    color: "rgb(215,73,105)"
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

export default ModalLoader