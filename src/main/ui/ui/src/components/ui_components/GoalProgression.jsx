import React from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';


const GoalProgression = ({ type, name, startDate, endDate, currentDate, progress, target }) => {

    const progressPercent = (progress / target) * 100;
    const targetPercent = ((new Date(currentDate) - new Date(startDate)) / (new Date(endDate) - new Date(startDate))) * 100

    const renderProgressbar = () => {
        if (progressPercent < targetPercent) {
            return (
                <>
                    <p>You've registered {progress} out of {target} workouts so far. Keep it up in order to reach your goal!</p>
                    <ProgressBar>
                        <ProgressBar striped variant="notreached" now={ progressPercent } key={1} />
                        <ProgressBar animated variant="deficit" now={ targetPercent - progressPercent } key={2} />
                    </ProgressBar>
                </>
            )
        } else {
            return (
                <>
                    <p>You've registered {progress} out of {target} workouts so far and are on track with your goal!</p>
                    <ProgressBar>
                        <ProgressBar striped variant="reached" now={ targetPercent } key={1} />
                        <ProgressBar animated variant="surplus" now={ progressPercent - targetPercent } key={2} />
                    </ProgressBar>
                </>
            )
        }
    }

    return (
        <div className={ `goal-container` } >
            <h5>{name ? name : `${ target } workouts registered`}</h5>
            {
                renderProgressbar()
            }
            <p>
                <span>{startDate}</span>
                <span>{endDate}</span>
            </p>
        </div>
    );
}

export default GoalProgression;