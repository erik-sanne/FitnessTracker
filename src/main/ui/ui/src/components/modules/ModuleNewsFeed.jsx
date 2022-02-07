import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Loader from "../ui_components/Loader";
import Module from "./Module";
import PostCard from "../ui_components/PostCard";
import post from "../../services/Post";
import get from "../../services/Get";


const ModuleNewsFeed = ({ profile }) => {
    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState([]);

    useEffect(() =>  {
        getComments()
        setInterval(() => getComments(), 5000);
    }, []);

    const getComments = () => {
        get('/posts/feed').then(resp => {
            if (resp.length != posts.length)
                setPosts(resp)
            if (loading)
                setLoading(false);
        })
    }

    const postComment = (id, message) => {
        setLoading(true);
        post(`/posts/reply/${id}`, message
        ).then(() => {
            getComments();
        })
    }

    return  <Module title={ "Social Feed" } className={ "news-feed" }>
        { loading ? <Loader /> : posts.length < 1 ? <p>Nothing new</p> : posts.map((post, idx) =>
                    <PostCard key={idx}
                              myprofile={ profile }
                              post={post}
                              postCallback={postComment}
                    />)}
            </Module>

}

export default ModuleNewsFeed;