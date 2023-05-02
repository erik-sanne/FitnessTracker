import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import PostCard from "../ui_components/PostCard";
import post from "../../services/Post";
import doDelete from "../../services/DoDelete";
import Modal from "../ui_components/Modal";

const PostWall = ({ profile, updateUserProfile, posts, loading, refreshCallback, maxReached=false }) => {

    const [ notices, setNotices ] = useState([])
    const [ confirmDeletePost, setConfirmDeletePost] = useState(-1)
    const [ editPost, setEditPost] = useState({id: -1, text: ""})

    useEffect(() => {
        setNotices(profile.notices)
        updateUserProfile();
    }, []);


    const deleteComment = () => {
        doDelete(`/posts/delete/${confirmDeletePost}`).then(() => {
            setConfirmDeletePost(-1);
            refreshCallback();
        });
    }

    const postComment = (id, message) => {
        post(`/posts/reply/${id}`, message
        ).then(() => {
            refreshCallback();
        })
    }

    const saveEdit = () => {
        post(`/posts/edit/${editPost.id}`, editPost.text)
        .then(() => {
            setEditPost({id: -1, text: ""})
            refreshCallback();
        })
    }

    const toggleLike = (id) => {
        post(`/posts/like/${id}`)
        .then(() => {
            refreshCallback();
        })
    }

    const textChanged = (e) => {
        setEditPost({id: editPost.id, text: e.target.value})
    };

    return  <>
        { loading ? <Loader /> : posts.length < 1 ? <p style={noticeStyle}>Nothing new</p> : <>
            { posts.map((post, idx) =>
                            <PostCard key={idx}
                                      myprofile={ profile }
                                      notices={notices}
                                      post={post}
                                      postCallback={ postComment }
                                      deletePostCallback={ setConfirmDeletePost }
                                      editPostCallback={ setEditPost }
                                      likeCallback={ toggleLike }
                            /> )}
                            <br />
            { maxReached ? <p style={noticeStyle}> No more posts at this time </p> : <Loader /> }
        </>}
        <Modal visible={ confirmDeletePost !== -1 } title={ "Are you sure you want to delete this post?" } onClose={ () => setConfirmDeletePost(-1) }>
            <input type={ 'submit' } value={ 'Yes!' } className={ 'themed' } onClick={ () => {
                deleteComment();
            }}/>
        </Modal>
        <Modal visible={ editPost.id !== -1 } title={ "Edit post" } onClose={ () => setEditPost({id: -1, text: ""}) }>
            <textarea onChange={ textChanged } style={ taStyle } value={ editPost.text } />
            <input type={'submit'} value={ 'Save' } onClick={ saveEdit }/>
        </Modal>
    </>
}

const taStyle = {
    borderRadius: '0.5em',
    background: 'rgb(204, 204, 204)',
    padding: '1em'
}

const noticeStyle = { width: '100%', textAlign: 'center', fontStyle: 'italic', color: '#555' };

export default PostWall;