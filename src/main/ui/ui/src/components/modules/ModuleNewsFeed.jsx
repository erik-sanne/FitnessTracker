import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import Module from "./Module";
import PostCard from "../ui_components/PostCard";
import post from "../../services/Post";
import get from "../../services/Get";
import ProfileDisplay from "../ui_components/ProfileDisplay";

const ModuleNewsFeed = ({ profile }) => {
    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState([]);

    useEffect(() =>  {
        getComments()
        setInterval(() => getComments(), 5000);
    }, []);

    const getComments = () => {
        get('/posts/feed').then(resp => {
            setPosts(resp)
            if (loading)
                setLoading(false);
        })
    }

    const postComment = (id, message) => {
        post(`/posts/reply/${id}`, message
        ).then(() => {
            getComments();
        })
    }

    const postNewComment = (message) => {
        post(`/posts/post`, message
        ).then(() => {
            getComments();
        })
    }

    const toggleLike = (id) => {
        post(`/posts/like/${id}`)
        .then(() => {
            getComments();
        })
    }

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            const val = e.target.value;
            e.target.value = "";
            postNewComment(val);
        }
    }

    return  (<Module title={ "Social Feed" } className={ "news-feed" }>
        <div className={"post"}>
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: "space-between", paddingBottom: "1em" }}>
                    <ProfileDisplay profilePicture={ profile.profilePicture } /> <p style={{ margin: 'auto' }}>What's on your mind?</p>
                </div>
            </div>
            <div className={"text-area"} style={{ display: 'flex', justifyContent: "space-between" }}>
                <input type={ 'text' } onKeyPress={ onKeyPress }/>
            </div>
        </div>

        <div className={"post"} style={{ padding: '0px' }}></div>

        { loading ? <Loader /> : posts.length < 1 ? <p>Nothing new</p> : posts.map((post, idx) =>
                    <PostCard key={idx}
                              myprofile={ profile }
                              post={post}
                              postCallback={ postComment }
                              likeCallback={ toggleLike }
                    />)}
            </Module>);
}

export default ModuleNewsFeed;