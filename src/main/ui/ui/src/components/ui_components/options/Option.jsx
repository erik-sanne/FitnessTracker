import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Option = ({ icon, text, callback }) => {
    return (
        <span style={{ cursor: 'pointer', margin: '5px' }}  onClick={ callback }>
            <FontAwesomeIcon icon={icon} style={{ marginRight: '0.5em' }} /> {text}
        </span>
    );
}

export default Option;