import React, {useEffect, useState} from "react";
import Module from "./Module";
import ProfilePicture from "../ui_components/ProfilePicture";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompressArrowsAlt, faDumbbell, faStar, faTrophy, faUserFriends,} from "@fortawesome/free-solid-svg-icons";
import image from "../../resources/party_pattern.jpg";
import get from "./../../services/Get.jsx"
import Spinner from "react-bootstrap/cjs/Spinner";
import {Redirect} from "react-router";
import {NavLink} from 'react-router-dom'
import PostWall from "../ui_components/PostWall";
import post from "../../services/Post";
import PostSubmit from "../ui_components/PostSubmit";

const ModuleProfile = ({ myProfile, profile }) => {
    const [ stats, setStats ] = useState();
    const [ achievements, setAchievements ] = useState();
    const [ redirect, setRedirect ] = useState("");
    const [ isMe ] = useState(myProfile.userId === profile.userId)

    const [ wall, setWall ] = useState({
        posts: [],
        numComments: 10,
        maxReached: false,
        loading: false
    });

    useEffect(() => {
        get(`/api/stats/${profile.userId}`).then((resp) => setStats(resp))
        get(`/api/achievements/${profile.userId}`).then((resp) => setAchievements(resp))
        getComments();
    },[profile])

    useEffect(() =>  {
        let inter = setInterval(() => getComments(0, wall.numComments), 5000);

        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        return () => {
            clearInterval(inter);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [wall.numComments, profile]);

    const handleScroll = () => {
        const isBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (isBottom) {
            setWall((old) => ({
                posts: old.posts,
                numComments: old.numComments + 10,
                maxReached: old.numComments,
                loading: true
            }))
        }
    }

    const getComments = () => {
        get(`/posts/wall/${profile.userId}?from=0&to=${wall.numComments}`).then(resp => {
            setWall((old) => ({
                posts: resp,
                numComments: old.numComments,
                maxReached: resp.length < wall.numComments,
                loading: false
            }))
        })
    }

    const postNewComment = (message) => {
        post(`/posts/post/${profile.userId}`, message
        ).then(() => {
            getComments();
        })
    }

    if (redirect) {
        return <Redirect to={ redirect } />
    }

    return (<>
        <Module substyle={{ height: 'inherit' }} className={ 'profile' }>
            <div className={ 'profile-banner' }>
                <div style={{
                    background: `url(${image}), linear-gradient(180deg, transparent, black`,
                }}>
                    { !isMe && <FontAwesomeIcon icon={ faCompressArrowsAlt } onClick={ () => {
                        setRedirect(`/friend/${profile.userId}`)
                    }} />}
                </div>
            </div>
            <div className={ 'profile-wrapper' }>
                <div style={{ width: '13em', position: 'relative' }}>
                    {
                        isMe ? <NavLink to={ "/settings" }>
                            <ProfilePicture picture={ profile.profilePicture } />
                        </NavLink> : <ProfilePicture picture={ profile.profilePicture } />
                    }
                </div>
                <div style={{ flex: 1}}>
                    <div className={ 'details' }>
                        <h4>{ profile.displayName }
                        </h4>
                        <p> { formatTitle(profile.title, profile.permissionLevel) } </p>
                    </div>
                </div>
            </div>
            <div className={'score-wrapper'}>
                <p>
                    <FontAwesomeIcon icon={ faStar } />
                    { window.innerWidth < 600 ? ": " : " Score: " }
                    { profile.score }
                </p>
                <p>
                    <FontAwesomeIcon icon={ faTrophy } />
                    { window.innerWidth < 600 ? ": " : " Achievements: " }
                    { !achievements ? <Spinner animation="border" style={{ width: '16px', height: '16px'}}/>  :
                        achievements.filter(a => a.date !== null).length}
                </p>
                <p>
                    <FontAwesomeIcon icon={ faUserFriends } />
                    { window.innerWidth < 600 ? ": " : " Friends: " }
                    { profile.friends.length > 0 ? profile.friends.length : profile.friendsCount }
                </p>
                <p>
                    <FontAwesomeIcon icon={ faDumbbell } />
                    { window.innerWidth < 600 ? ": " : " Workouts: " }
                    { !stats ? <Spinner animation="border" style={{ width: '16px', height: '16px'}}/> :
                        stats.workouts }
                </p>
            </div>
        </Module>
        <Module substyle={{ height: 'inherit' }} className={ 'profile-wall' }>
            <PostSubmit myProfile={ myProfile } profile={ profile } submitCallback={ postNewComment } />
            <div className={"post"} style={{ padding: '0px' }} />
            <PostWall profile={ myProfile }
                      posts={ wall.posts }
                      refreshCallback={ getComments }
                      updateUserProfile={ () => {} }
                      maxReached={ wall.maxReached } />
        </Module>
    </>)
}

const formatTitle = (title, permissionLevel) => {
    const role = roleText(permissionLevel);
    if (title && role)
        return title + " | " + role
    else if (title)
        return title
    else if (role)
        return role
}

const roleText = (permissionLevel) => {
    switch (permissionLevel) {
        case 'MOD':
            return " Moderator ♕ ";
        case 'ADMIN':
            return " Administrator ♔ ";
        default:
            return '';
    }
}


export default ModuleProfile;