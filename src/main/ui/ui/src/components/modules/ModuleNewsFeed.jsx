import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import Module from "./Module";
import PostCard from "../ui_components/PostCard";
import post from "../../services/Post";
import get from "../../services/Get";
import ProfileDisplay from "../ui_components/ProfileDisplay";

const ModuleNewsFeed = ({ profile, silentProfileUpdate }) => {
    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState([]);
    const [ numComments, setNumComments ] = useState(10);
    const [ maxReached, setMaxReaced ] = useState(false);
    const [ notices, setNotices ] = useState([])

    useEffect(() => {
        setNotices(profile.notices)
        silentProfileUpdate();
    }, []);

    useEffect(() =>  {
        getComments();
        let inter = setInterval(() => getComments(0, numComments), 5000);

        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        return () => {
            clearInterval(inter);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [numComments]);

    const getComments = () => {
        get(`/posts/feed?from=0&to=${numComments}`).then(resp => {
            if (resp.length < numComments) {
                setMaxReaced(true);
            }

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

    const handleScroll = () => {
        const isBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (isBottom) {
            setNumComments(numComments + 10);
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

        { loading ? <Loader /> : posts.length < 1 ? <p>Nothing new</p> : <>
            {posts.map((post, idx) =>
                            <PostCard key={idx}
                                      myprofile={ profile }
                                      notices={notices}
                                      post={post}
                                      postCallback={ postComment }
                                      likeCallback={ toggleLike }
                            /> )}
                            <br />
            { maxReached ? <p style={{ width: '100%', textAlign: 'center', fontStyle: 'italic' }}> No more posts at this time </p> : <Loader /> }
        </>}
            </Module>);
}

export default ModuleNewsFeed;