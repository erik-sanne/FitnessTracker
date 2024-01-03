import { faDotCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';


const GoalProgression = ({ id, type, name, startDate, endDate, currentDate, progress, target, tracked, toggleCallback, onClick }) => {

    const progressPercent = (progress / target) * 100;
    const targetPercent = ((new Date(currentDate) - new Date(startDate)) / (new Date(endDate) - new Date(startDate))) * 100

    const renderProgressbar = () => {
        if (progressPercent >= 100) {
            return (
                <>
                    <p>You've registered {progress} out of {target} workouts and have threrefor reached your goal!</p>
                    <ProgressBar>
                        <ProgressBar animated variant="surplus" now={ progressPercent } key={1} />
                    </ProgressBar>
                </>
            )
        }
        else if (progressPercent < targetPercent) {
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
            <h5>
                <span onClick={ onClick } style={{ cursor: "pointer" }}>
                    {name ? name : `${ target } workouts registered`}
                </span>
                <span style={{float: 'right'}}>
                    <FontAwesomeIcon icon={ faDotCircle } style={{ color: tracked ? "#ffc877" : "rgb(61 65 72)", cursor: "pointer" }} title={tracked ? "Prority Tracking" : "Toggle to track manually" } onClick={ () => { toggleCallback(id) } }/>
                </span>
            </h5>
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