import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH} from "@fortawesome/free-solid-svg-icons";

const OptionsButton = ({ style, children }) => {
    const [ showOptions, setShowOptions ] = useState(false);

    const toggleShow = () => {
        setShowOptions(!showOptions)
    }

    return (
        <div style={{...style, position: 'absolute'}} onClick={ toggleShow }>
            <FontAwesomeIcon icon={faEllipsisH} style={ optionButtonStyle } />
            { showOptions &&
                <div style={popupStyle}>
                    { children }
                </div>
            }
        </div>
    );
}

const popupStyle = {
    position: 'absolute',
    top: '1em',
    right: '0',
    width: '10em',
    padding: '1em',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '1em 0em 1em 1em'
}

const optionButtonStyle = {
    cursor: 'pointer',
    color: 'rgb(204, 204, 204)',
    filter: 'drop-shadow(0px 0px 2px black)',
}


export default OptionsButton;