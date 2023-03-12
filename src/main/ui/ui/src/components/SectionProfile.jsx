import React from 'react'
import {useParams} from "react-router";
import ModuleProfile from "./modules/ModuleProfile";

const SectionProfile = ({ myProfile }) => {
    const { friendId } = useParams();
    const friend = myProfile && myProfile.friends.filter(friend => friend.userId == friendId)[0];

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <ModuleProfile profile={ friend } />
        </div>)
}

export default SectionProfile;