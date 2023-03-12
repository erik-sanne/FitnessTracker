import React from 'react'
import {useParams} from "react-router";
import ModuleProfile from "./modules/ModuleProfile";

const SectionProfile = ({ myProfile }) => {
    const { friendId } = useParams();
    const friend = myProfile && myProfile.friends.filter(friend => friend.userId == friendId)[0];

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <ModuleProfile profile={ myProfile.userId == friendId ? myProfile : friend } isMe={ myProfile.userId == friendId } />
        </div>)
}

export default SectionProfile;