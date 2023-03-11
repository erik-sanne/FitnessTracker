import React from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Mission = ({ name, description, progress, goal, completed, reward }) => {

    const percent = progress === 0 ? 0 : (progress / goal) * 100;

    return (
        <div className={ `mission-container ${completed && "complete"}` } >
            <h4>{name}</h4>
            <FontAwesomeIcon icon={ faCheckCircle } className={ 'check' } />
            <p>{description}</p>
            <ProgressBar now={ percent }/>
            <p>{reward} pts</p>
        </div>
    );
}

export default Mission;