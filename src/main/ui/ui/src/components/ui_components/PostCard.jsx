import React from "react";
import ProfileDisplay from "./ProfileDisplay";
import LikeButton from "./LikeButton";

const PostCard = ({ myprofile, post, postCallback, likeCallback }) => {

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            postCallback(post.postId, e.target.value);
        }
    }

    return (
        <div className={"post"}>
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: "space-between", paddingBottom: "1em" }}>
                    <ProfileDisplay displayName={ post.authorName } profilePicture={ myprofile.userId === post.authorId ? myprofile.profilePicture : myprofile.friends.filter(f => f.userId === post.authorId)[0] && myprofile.friends.filter(f => f.userId === post.authorId)[0].profilePicture } title={ post.date } />
                </div>
                { post.isAutoCreated ?
                    <i>{ post.message }</i>:
                    <p>{ post.message }</p>
                }
                <LikeButton count={ post.likes } onClick={ () => { likeCallback(post.postId) } } />
            </div>
            <div>
                {post.replies.map((reply, idx) =>
                <div className={"text-area reply"} key={idx}>
                    <div>
                        <ProfileDisplay
                            profilePicture={ myprofile.userId === reply.authorId ? myprofile.profilePicture : myprofile.friends.filter(f => f.userId === reply.authorId)[0] && myprofile.friends.filter(f => f.userId === reply.authorId)[0].profilePicture }
                            displayName={ reply.authorName }
                            title={ reply.date }/>
                        <p>{ reply.message }</p>
                        <LikeButton count={ reply.likes } onClick={ () => { likeCallback(reply.postId) } } />
                    </div>
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