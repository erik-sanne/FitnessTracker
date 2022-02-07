import '../../styles/Module.css';
import React from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import Module from "./Module";
import NewsCard from "../ui_components/NewsCard";


const ModuleNewsFeed = ({ profile }) => {
    const { data, loading } = useFetch('/posts/feed');



    return  <Module title={ "Social Feed" } className={ "news-feed" }>
        { loading ? <Loader /> : data.length < 1 ? <p>Nothing new</p> : data.map((post, idx) =>
                    <NewsCard key={idx}
                    date={ post.date.split("T")[0] }
                    title={ post.title }
                    message={ post.message }
                    />)}
            </Module>

}

export default ModuleNewsFeed;