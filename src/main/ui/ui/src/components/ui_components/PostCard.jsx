import React from "react";
import ProfileDisplay from "./ProfileDisplay";

const PostCard = ({ myprofile, post, postCallback }) => {

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            postCallback(post.postId, e.target.value);
        }
    }

    return (
        <div className={"post"}>
            <div style={{ display: 'flex', justifyContent: "space-between", paddingBottom: "1em" }}>
                <ProfileDisplay displayName={ post.authorName } profilePicture={ myprofile.userId === post.authorId ? myprofile.profilePicture : myprofile.friends.filter(f => f.userId === post.authorId)[0] && myprofile.friends.filter(f => f.userId === post.authorId)[0].profilePicture } title={ post.date } />
            </div>

            <p>{ post.message }</p>
            <div>
                {post.replies.map((reply, idx) =>
                <div className={"text-area reply"} key={idx}>
                    <ProfileDisplay
                        profilePicture={ myprofile.userId === reply.authorId ? myprofile.profilePicture : myprofile.friends.filter(f => f.userId === reply.authorId)[0] && myprofile.friends.filter(f => f.userId === reply.authorId)[0].profilePicture }
                        displayName={ reply.authorName }
                        title={ reply.date }/>
                    <p>{ reply.message }</p>
                </div>)}
            </div>
            <div className={"text-area"} style={{ display: 'flex', justifyContent: "space-between" }}>
                <ProfileDisplay profilePicture={ myprofile.profilePicture } />
                <input type={ 'text' } onKeyPress={ onKeyPress }/>
            </div>
        </div>
    );
}

export default PostCard;