import React, {useState} from "react";
import Module from "./Module";
import {getCookie} from "react-use-cookie";
import Avatar from "react-avatar-edit";
import ProfileDisplay from "../ui_components/ProfileDisplay";
import Compress from "compress.js";

const ModuleEditProfile = ({ userProfile, required=false, updateUserProfile }) => {
    const compress = new Compress();
    const [ displayName, setDisplayName ] = useState(userProfile?.displayName);
    const [ profilePic, setProfilePic ] = useState(userProfile?.profilePicture);
    const [ message, setMessage ] = useState("");
    const defaultName = "Anonymous user";

    const onClose = () => {
        setProfilePic(null)
    }

    const onCrop = (pic) => {
        setProfilePic(pic)
    }

    const onImageLoad = (image) => {
        compress.compress([image], {
            size: 2, // MB
            quality: 1,
            maxWidth: 512,
            maxHeight: 512,
            resize: true
        }).then( resizedImage => {
            image = resizedImage[0].data
        })
    }

    const save = () => {
        if (!displayName || displayName.length <= 4) {
            setMessage("Please use a name with at least 4 characters");
            return;
        }
        post(displayName, profilePic);
    }

    const skip = () => {

        post(defaultName, null);
    }

    const post = (displayName, profilePic) => {
        const token = getCookie('session_token')
        fetch(`${ process.env.REACT_APP_API_BASE }/users/saveProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            },
            body: JSON.stringify({
                displayName: displayName,
                profilePicture: profilePic
            })
        }).then(response => {
            if (response.ok) {
                response.json().then( profile => updateUserProfile(profile) )
            }
        })
    }

    return (
        <Module title={required ? "Welcome on board!" : "Edit profile"}>
            { required && <p> As this is your first time using this app, we would like you to set a display name for your account. You can also upload a unique profile picture if you so choose. </p>}
            { message && <span style={styleError}>{message}</span> }
            <label htmlFor={"displayName"}>Display name: {required ? "*" : ""}</label>
            <input
                type={"text"}
                name={"displayName"}
                value={ displayName }
                maxLength={ 16 }
                minLength={ 4 }
                onChange={ (e) => {
                    setMessage("");
                    setDisplayName(e.target.value)}
                }
            />
            <br />
            <label>Avatar:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ flex: 1, overflow: 'hidden', maxWidth: '256px', maxHeight: '256px', minWidth: '256px'}}>
                <Avatar
                    width={ 256 }
                    height={ 256 }
                    onCrop={ onCrop }
                    onClose={ onClose }
                    onImageLoad={ onImageLoad }
                />
                </div>
                <div style={{ flex: 2, textAlign: 'center', lineHeight: '256px', minWidth: '256px', padding: '20px' }} className={ 'centerC' }>
                    <ProfileDisplay displayName={ ( !displayName ) ? defaultName : displayName } profilePicture={ profilePic } userId={ userProfile?.userId || 0 } />
                </div>
            </div>
            <br />
            <div style={buttonWrapperStyle}>
                <input
                    style={ submitButtonStyle }
                    type={"submit"}
                    value={ required ? "Save and continue" : "Save changes" }
                    onClick={ save }
                />
                { required && <input
                    style={ {...submitButtonStyle , ...skipButton} }
                    type={"submit"}
                    value={"Skip"}
                    onClick={ skip }
                />}
            </div>
        </Module>
    )
}

const buttonWrapperStyle = {
    display: 'flex',
    flexDirection: 'row-reverse'
}

const submitButtonStyle = {
    flex: 1,
    maxWidth: '200px'
}

const skipButton = {
    background: 'transparent',
    color: 'white',
    border: '0px'
}

const styleError = {
    background: '#f16b719e',
    border: '1px solid #f16b719e',
    padding: '5px'
}


export default ModuleEditProfile;