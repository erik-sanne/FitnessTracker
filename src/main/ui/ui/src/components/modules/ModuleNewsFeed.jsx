import '../../styles/Module.css';
import React, {useEffect, useState} from "react";
import Module from "./Module";
import get from "../../services/Get";
import PostWall from "../ui_components/PostWall";

const ModuleNewsFeed = ({ profile, updateUserProfile }) => {
    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState([]);
    const [ numComments, setNumComments ] = useState(10);
    const [ maxReached, setMaxReached ] = useState(false);

    useEffect(() => {
        updateUserProfile();
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

    const handleScroll = () => {
        const isBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (isBottom) {
            setNumComments(numComments + 10);
        }
    }

    const getComments = () => {
        get(`/posts/feed?from=0&to=${numComments}`).then(resp => {
            if (resp.length < numComments) {
                setMaxReached(true);
            }

            setPosts(resp)
            if (loading)
                setLoading(false);
        })
    }

    return  (
        <Module title={ "Social Feed" } className={ "news-feed" }>
        <PostWall
            profile={ profile }
            updateUserProfile={ updateUserProfile }
            posts={ posts }
            refreshCallback={ getComments }
            maxReached={ maxReached }/>

       </Module>);
}

export default ModuleNewsFeed;