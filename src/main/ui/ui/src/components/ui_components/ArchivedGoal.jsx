import React from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ArchivedGoal = ({ id, type, name, startDate, endDate, progress, target, completed }) => {

    const progressPercent = (progress / target) * 100;

    const renderProgressbar = () => {
        if (progressPercent >= 100) {
            return (
                <>
                    <p>You registered {progress} out of {target} workouts and have therefore reached your goal!</p>
                    <ProgressBar>
                        <ProgressBar variant="surplus" now={ progressPercent } key={1} />
                    </ProgressBar>
                    <p>
                        <span>{startDate}</span>
                        <span>{endDate}</span>
                    </p>
                </>
            )
        }
        else {
            return (
                <>
                    <p>You registered {progress} out of {target} workouts. The goal was not completed.</p>
                    <ProgressBar>
                        <ProgressBar variant="notreached" now={ progressPercent } key={1} />
                    </ProgressBar>
                    <p>
                        <span>{startDate}</span>
                        <span>{endDate}</span>
                    </p>
                </>
            )
        }
    }

    const renderWeeklyProgress = () => {
        return (
            <>
                <div style={{ display: "flex"}}>
                    <div style={{ maxWidth: "5em"}}>
                        <CircularProgressbar 
                            value={ progressPercent } 
                            text={ `${progress.toFixed(2)}/${target}` }
                            color={ progressPercent < 75 ? "#ffff00" : "rgba(2, 160, 2, 0.7)" }
                        />
                    </div>
                    <div>
                        <p style={{ padding: '1em'}}> You registered on average {progress.toFixed(2)} workout per week between {startDate} - {endDate}.</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className={ `goal-container archived` } >
            <h5>
                <span style={{ cursor: "pointer" }}>
                    {name ? name : `${ target } workouts registered`}
                </span>
            </h5>
            {
                type === "WORKOUTS" ? renderProgressbar() : renderWeeklyProgress()
            }
        </div>
    );
}

export default ArchivedGoal;
