import React from 'react'
import {useParams} from "react-router";
import ModuleProfile from "./modules/ModuleProfile";

const SectionProfile = ({ myProfile }) => {
    const { friendId } = useParams();
    const viewedProfile = !myProfile ? {} :
        myProfile.userId == friendId ? myProfile :
        myProfile.friends.filter(friend => friend.userId == friendId)[0];

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <ModuleProfile
                myProfile={ myProfile }
                profile={ viewedProfile }
            />
        </div>)
}

export default SectionProfile;