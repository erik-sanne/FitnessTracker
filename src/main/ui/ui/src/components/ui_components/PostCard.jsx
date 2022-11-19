import React, {useEffect, useState} from "react";
import ProfileDisplay from "./ProfileDisplay";
import LikeButton from "./LikeButton";
import OptionsButton from "./options/OptionsButton";
import Option from "./options/Option";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import FormWrap from "./FormWrap";

const PostCard = ({ myprofile, notices, post, postCallback, deletePostCallback, editPostCallback, likeCallback }) => {

    const [showAllComments, setShowAllComments] = useState(false);
    const [replies, setReplies] = useState([]);

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.target.value;
            e.target.value = "";
            postCallback(post.postId, val);
        }
    }

    useEffect(() => {
        setReplies(showAllComments ? post.replies : post.replies.map(a => a).splice(-2))
    }, [showAllComments, post])

    const date = (date) => {
        return new Date(`${date} UTC`).toString().match(/(.*[0-9]{4} [0-9]{2}:[0-9]{2})/g)
    }

    return (
        <div className={"post"} style={ notices.some( notice => notice.postId === post.postId ) ? noticeStyle : {}} >
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: "space-between", paddingBottom: "1em" }}>
                    <ProfileDisplay displayName={ post.authorName } profilePicture={ myprofile.userId === post.authorId ? myprofile.profilePicture : myprofile.friends.filter(f => f.userId === post.authorId)[0] && myprofile.friends.filter(f => f.userId === post.authorId)[0].profilePicture } title={ `${date(post.date)} ${ post.edited ? '(edited)' : ''}` } />
                </div>
                { post.autoPosted ?
                    <p style={{ color: '#ccc' }}>{ post.message.replace(/ in (.*)/, function(cg) { return cg.toLowerCase(); }) }</p>:
                    <p>{ post.message }</p>
                }
                {myprofile.userId === post.authorId &&
                <OptionsButton style={{right: '1em', top: '0.5em'}}>
                    <Option icon={faPen} text={'Edit post'} callback={() => { editPostCallback({id: post.postId, text: post.message})}}/>
                    <Option icon={faTrash} text={'Delete post'} callback={() => { deletePostCallback(post.postId) }}/>
                </OptionsButton>}
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
                            title={ `${date(reply.date)} ${ reply.edited ? '(edited)' : ''}`  }/>
                        {myprofile.userId === reply.authorId &&
                        <OptionsButton style={{right: '5px', top: '0'}}>
                            <Option icon={faPen} text={'Edit post'} callback={() => { editPostCallback({id: reply.postId, text: reply.message}) }}/>
                            <Option icon={faTrash} text={'Delete post'} callback={() => { deletePostCallback(reply.postId) }}/>
                        </OptionsButton>}
                        <p>{ reply.message }</p>
                        <LikeButton likes={ reply.likes } onClick={ () => { likeCallback(reply.postId) } } />
                    </div>
                </div>)}
            </div>
            <div className={"text-area"} style={{ display: 'flex' }}>
                <ProfileDisplay profilePicture={ myprofile.profilePicture } />
                <FormWrap><input type={ 'text' } onKeyPress={ onKeyPress } onKeyUp={ onKeyPress }/></FormWrap>
            </div>
        </div>
    );
}

const noticeStyle = {
    boxShadow: 'orange 0px 0px 10px inset',
    border: '1px solid orange'
}

export default PostCard;