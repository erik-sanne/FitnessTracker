import React from "react";

const SetDisplay = ({ type, reps, weight }) => {
    return (
        <div style={{display: 'inline-flex'}}>
            <p> {type} </p>
            <p> {reps} </p>
            <p> {weight} </p>
        </div>
    );
}

export default SetDisplay;