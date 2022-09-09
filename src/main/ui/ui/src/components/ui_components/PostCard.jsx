import React, {useEffect, useState} from "react";
import ProfileDisplay from "./ProfileDisplay";
import LikeButton from "./LikeButton";

const PostCard = ({ myprofile, notices, post, postCallback, likeCallback }) => {

    const [showAllComments, setShowAllComments] = useState(false);
    const [replies, setReplies] = useState([]);

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            const val = e.target.value;
            e.target.value = "";
            postCallback(post.postId, val);
        }
    }

    useEffect(() => {
        setReplies(showAllComments ? post.replies : post.replies.map(a => a).splice(-2))
    }, [showAllComments, post])

    return (
        <div className={"post"} style={ notices.some( notice => notice.postId === post.postId ) ? noticeStyle : {}} >
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: "space-between", paddingBottom: "1em" }}>
                    <ProfileDisplay displayName={ post.authorName } profilePicture={ myprofile.userId === post.authorId ? myprofile.profilePicture : myprofile.friends.filter(f => f.userId === post.authorId)[0] && myprofile.friends.filter(f => f.userId === post.authorId)[0].profilePicture } title={ new Date(`${post.date} UTC`).toString().match(/(.*[0-9]{4} [0-9]{2}:[0-9]{2})/g) } />
                </div>
                { post.autoPosted ?
                    <p style={{ color: '#ccc' }}>{ post.message.replace(/ in (.*)/, function(cg) { return cg.toLowerCase(); }) }</p>:
                    <p>{ post.message }</p>
                }
            </div>
            <div className={"text-area divider"} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <LikeButton likes={ post.likes } onClick={ () => { likeCallback(post.postId) } } />
                <span style={{ margin: 'auto 0', cursor: 'pointer'}} onClick={ () => setShowAllComments(!showAllComments)}>{ post.replies.length <= 2 ? '' : !showAllComments ? `Show all ${post.replies.length} replies` : 'Hide replies' }</span>
            </div>
            <div>
                {replies.map((reply, idx) =>
                 <div className={"text-area reply"} style={ notices.some( notice => notice.postId === reply.postId ) ? noticeStyle : {}} key={idx}>
                    <div>
                        <ProfileDisplay
                            profilePicture={ myprofile.userId === reply.authorId ? myprofile.profilePicture : myprofile.friends.filter(f => f.userId === reply.authorId)[0] && myprofile.friends.filter(f => f.userId === reply.authorId)[0].profilePicture }
                            displayName={ reply.authorName }
                            title={ new Date(`${reply.date} UTC`).toString().match(/(.*[0-9]{4} [0-9]{2}:[0-9]{2})/g)  }/>
                        <p>{ reply.message }</p>
                        <LikeButton likes={ reply.likes } onClick={ () => { likeCallback(reply.postId) } } />
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

const noticeStyle = {
    boxShadow: 'orange 0px 0px 10px inset',
    border: '1px solid orange'
}

export default PostCard;