import React, {useEffect, useState} from 'react'
import {useParams} from "react-router";
import ModuleProfile from "./modules/ModuleProfile";

const SectionProfile = ({ myProfile }) => {
    const { friendId } = useParams();
    const [ profile, setProfile ] = useState();
    const viewedProfile = !myProfile ? {} :
        myProfile.userId == friendId ? myProfile :
        myProfile.friends.filter(friend => friend.userId == friendId)[0];

    useEffect(() => {
        if (!profile || profile.userId !== viewedProfile.userId)
            setProfile(viewedProfile)
    }, [friendId])

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            {profile && <ModuleProfile
                myProfile={ myProfile }
                profile={ profile }
            />}
        </div>)
}

export default SectionProfile;