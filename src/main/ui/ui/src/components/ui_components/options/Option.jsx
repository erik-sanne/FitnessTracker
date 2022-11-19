import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Option = ({ icon, text, disabled=false, callback }) => {
    return (
        <span style={{ cursor: !disabled && 'pointer', margin: '5px', color: disabled && '#777' }}  onClick={ callback }>
            <FontAwesomeIcon icon={icon} style={{ marginRight: '0.5em' }} /> {text}
        </span>
    );
}

export default Option;