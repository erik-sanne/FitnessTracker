import React from 'react'
import ModuleWorkoutDays from "./modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "./modules/ModuleWorkoutDistribution";
import Module from "./modules/Module";
import {useParams} from "react-router";
import useFetch from "../services/useFetch";
import ProfileDisplay from "./ui_components/ProfileDisplay";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDumbbell} from "@fortawesome/free-solid-svg-icons";

const SectionStatisticsWithFriend = ({ userProfile }) => {
    const { friendId } = useParams();
    const { data: selfWorkoutsPerWeek, loading: lswpw } = useFetch(`/api/workoutsPerWeek`);
    const { data: friendWorkoutsPerWeek, loading: lfwpw } = useFetch(`/api/workoutsPerWeek/${friendId}`);
    const { data: selfWorkoutDistribution, loading: lsdis  } = useFetch(`/api/distribution`);
    const { data: friendWorkoutDistribution, loading: lfdis } = useFetch(`/api/distribution/${friendId}`);

    const friendProfile = userProfile.friends.filter(friend => {
        const temp = friend.userId == friendId
        return temp;
    })[0];

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <Module title={ "Parties" }>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                    <ProfileDisplay profilePicture={ userProfile.profilePicture }/>
                    <p> { userProfile.displayName } </p>
                    </div>
                    <div>
                        <p style={{ lineHeight: '56px' }}>
                            <FontAwesomeIcon icon={ faDumbbell } />
                        </p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                    { friendProfile &&
                        <>
                            <ProfileDisplay profilePicture={ friendProfile.profilePicture } />
                            <p> { friendProfile.displayName } </p>
                        </> }
                    </div>
                </div>
            </Module>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays data={ !lswpw && !lfwpw ? [selfWorkoutsPerWeek, friendWorkoutsPerWeek] : [] } />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution data={ !lsdis && !lfdis ? [selfWorkoutDistribution, friendWorkoutDistribution] : [] } />
            </Module>
        </div>
    );
}

export default SectionStatisticsWithFriend;