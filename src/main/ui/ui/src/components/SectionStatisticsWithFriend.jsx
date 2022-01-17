import React, {useEffect, useState} from 'react'
import ModuleWorkoutDays from "./modules/ModuleWorkoutDays";
import ModuleWorkoutDistribution from "./modules/ModuleWorkoutDistribution";
import Module from "./modules/Module";
import {useParams} from "react-router";
import useFetch from "../services/useFetch";
import ProfileDisplay from "./ui_components/ProfileDisplay";
import ModuleBSD from "./modules/ModuleBSD";
import get from "../services/Get";

const SectionStatisticsWithFriend = ({ userProfile }) => {
    const { friendId } = useParams();
    const { data: selfWorkoutsPerWeek, loading: lswpw } = useFetch(`/api/workoutsPerWeek`);
    const { data: friendWorkoutsPerWeek, loading: lfwpw } = useFetch(`/api/workoutsPerWeek/${friendId}`);
    const [ workoutDistribution, setWorkoutDistribution ] = useState([]);

    const { data: selfRecords, loading: lsrec  } = useFetch(`/api/records`);
    const { data: friendRecords, loading: lfrec  } = useFetch(`/api/records/${friendId}`);

    const friendProfile = userProfile.friends.filter(friend => {
        const temp = friend.userId == friendId
        return temp;
    })[0];

    useEffect(()=>{
        let from = new Date();
        from.setDate(from.getDate() - 30)
        let to = new Date();
        updateDistRange(from, to);
    }, [])

    const updateDistRange = (fromDate, toDate) => {
        fromDate = fromDate.toISOString().split('T')[0];
        toDate = toDate.toISOString().split('T')[0];
        get(`/api/distribution?from=${fromDate}&to=${toDate}`).then((self) => {
            get(`/api/distribution/${friendId}?from=${fromDate}&to=${toDate}`).then((friend) => {
                setWorkoutDistribution([self, friend])
            });
        });
    }

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <Module title={ "Parties" } style={{ background: 'linear-gradient(135deg, rgba(107,166,239,1), rgba(70,131,58,1))' }} headerStyle={{ backgroundImage: 'none' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                    <ProfileDisplay profilePicture={ userProfile.profilePicture } title={ userProfile.title }/>
                    <p> { userProfile.displayName } </p>
                    </div>
                    <div className={ 'glitch-wrapper' }>
                        <p style={{ lineHeight: '56px', fontWeight: 'bold', fontSize: '64px' }} className={ 'glitch' } data-text={ 'VS' }>
                            VS
                        </p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                    { friendProfile &&
                        <>
                            <ProfileDisplay profilePicture={ friendProfile.profilePicture } title={ friendProfile.title } />
                            <p> { friendProfile.displayName } </p>
                        </> }
                    </div>
                </div>
            </Module>
            <Module title = "Weekly workouts">
                <ModuleWorkoutDays data={ !lswpw && !lfwpw ? [selfWorkoutsPerWeek, friendWorkoutsPerWeek] : [] } />
            </Module>
            <Module title="Workout distribution">
                <ModuleWorkoutDistribution data={ workoutDistribution } rangeCallback={ updateDistRange } />
            </Module>
            {
                !lsrec && !lfrec &&
                selfRecords.filter(e => e.exercise === "BENCH_PRESS").length > 0 &&
                selfRecords.filter(e => e.exercise === "SQUAT").length > 0 &&
                selfRecords.filter(e => e.exercise === "DEADLIFT").length > 0 &&
                friendRecords.filter(e => e.exercise === "BENCH_PRESS").length > 0 &&
                friendRecords.filter(e => e.exercise === "SQUAT").length > 0 &&
                friendRecords.filter(e => e.exercise === "DEADLIFT").length > 0 ?
                    <Module title="Powerlift ratios">
                        <ModuleBSD data={lsrec || lfrec  ? [] : [ selfRecords, friendRecords ]}/>
                    </Module> : <></>
            }

        </div>
    );
}

export default SectionStatisticsWithFriend;