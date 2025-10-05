import '../../styles/Module.css';
import React from "react";
import ProfileDisplay from "../ui_components/ProfileDisplay";
import FormWrap from "../ui_components/FormWrap";

const PostSubmit = ({ myProfile, profile, submitCallback }) => {

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.target.value;
            e.target.value = "";
            submitCallback(val);
        }
    }

    return  (
        <div className={"post"} style={{ margin: '-1.5rem -1rem 0rem -1rem', borderRadius: '1rem' }}>
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: "space-between", paddingBottom: "1em" }}>
                    <ProfileDisplay profilePicture={ myProfile.profilePicture } />
                    <p style={{ margin: 'auto' }}>
                        { myProfile.userId === profile.userId ? "What's on your mind?" : `Write something to ${profile.displayName}...` }
                    </p>
                </div>
            </div>
            <div className={"text-area"} style={{ display: 'flex', justifyContent: "space-between" }}>
                <FormWrap><input type={ 'text' } placeholder={ myProfile.userId === profile.userId ? "What's on your mind?" : `Write something to ${profile.displayName}...` } onKeyPress={ onKeyPress } onKeyUp={ onKeyPress } className={ 'default-input' }/></FormWrap>
            </div>
        </div>);
}

export default PostSubmit;