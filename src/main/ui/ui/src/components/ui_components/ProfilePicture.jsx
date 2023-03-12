import React from "react";
import defaultPicture from '../../resources/default_pp.png';

const ProfilePicture = ({ picture }) => {
    return (
        <div className={ 'profile-picture' }>
            <img alt={ "" } src={ picture ? picture : defaultPicture }/>
        </div>
    );
}


export default ProfilePicture;