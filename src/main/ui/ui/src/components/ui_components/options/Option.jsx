import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Option = ({ icon, text, callback }) => {
    return (
        <span style={{ cursor: 'pointer' }}  onClick={ callback }>
            <FontAwesomeIcon icon={icon} style={{ marginRight: '0.5em' }} /> {text}
        </span>
    );
}

export default Option;