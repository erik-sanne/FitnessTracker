import React, {useState} from "react";
import Module from "./modules/Module";
import useFetch from "../services/useFetch";
import Modal from "./ui_components/Modal";
import Spinner from 'react-bootstrap/Spinner';
import {getCookie} from "react-use-cookie";
import {
    faCheckCircle,
    faIdBadge,
    faPeopleArrows,
    faTimes,
    faTimesCircle,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProfileDisplay from "./ui_components/ProfileDisplay";
import {Redirect} from "react-router-dom";
import ModuleNewsFeed from "./modules/ModuleNewsFeed";
import ListRow from "./ui_components/ListRow";
import ModuleCalendar from "./modules/ModuleCalendar";

const SectionFriends = ({ userProfile, updateUserProfile }) => {
    const [ modVisible, setModVisible ] = useState(false);
    const [ showRequests, setShowRequests ] = useState(true);
    const [ loadingReq, setLoadingReq ] = useState(false);
    const [ error, setError ] = useState("");
    const [ msg, setMsg ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ redirect, setRedirect ] = useState("");
    const { data: friendRequests, loading } = useFetch('/users/getFriendRequests');

    const postFR = () => {
        const re = /\S+@\S+\.\S+/;
        if (!email || !re.test(email)) {
            setError("Not a valid email");
            return;
        }

        setLoadingReq(true)
        setModVisible(true)
        setError("")
        setMsg("");

        const token = getCookie('session_token')
        fetch(`${ process.env.REACT_APP_API_BASE }/users/friendRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            },
            body: email
        }).then(response => {
            if (response.ok) {
                setEmail("")
                setMsg("Friend request sent!");
                setLoadingReq(false)
                setModVisible(true)
            } else
                throw new Error('');
        }).catch(_ => {
            setError("Could not find user")
            setMsg("");
            setLoadingReq(false)
        });
    }

    const accept = (id) => {
        const token = getCookie('session_token')
        fetch(`${ process.env.REACT_APP_API_BASE }/users/acceptFriend/${ id }`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }).then(response => {
            window.location.reload();
        }).catch(_ => {

        });
    }

    const reject = (id) => {
        const token = getCookie('session_token')
        fetch(`${ process.env.REACT_APP_API_BASE }/users/denyFriend/${ id }`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }).then(response => {
            window.location.reload();
        }).catch(_ => {

        });
    }

    if (redirect)
        return <Redirect to={redirect} />

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>

            { !loading && friendRequests && friendRequests.length > 0 && showRequests &&
                <Module title = "Pending friend requests">
                    <FontAwesomeIcon icon={ faTimes } style={{
                        position: 'absolute',
                        top:'min(4.5vw, 35px)',
                        right: 'min(4.5vw, 35px)',
                        fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                    }}
                    onClick={ () => setShowRequests(false) }/>

                    { friendRequests.map((request, key) =>
                            <p key={key} style={{
                                border: '1px solid #333',
                                padding: '5px',
                                borderRadius: '5px',
                                background: '#232'
                            }}> <strong> { request.from.displayName } </strong> sent a friend request
                                <span style={{ float: 'right' }}>
                                    <FontAwesomeIcon icon={ faCheckCircle } style={{ cursor: "pointer", color: '#376237', marginRight: '10px'}} onClick={ () => accept(request.id) } />
                                    <FontAwesomeIcon icon={ faTimesCircle } style={{ cursor: "pointer", color: '#752828' }} onClick={ () => reject(request.id) }  />
                                </span>
                            </p>
                    ) }
                </Module>
            }

            <Module title = "Friends list" className={ "friends-list" }>
                { userProfile.friends && userProfile.friends.length > 0 && userProfile.friends.map((profile, key) =>
                    <ListRow key={key} onClick={ () => {
                        setRedirect(`/friend/${profile.userId}`)
                    }}>
                        <ProfileDisplay displayName={profile.displayName} title={ profile.title } userId={ profile.userId } profilePicture={ profile.profilePicture } permissionLevel={ profile.permissionLevel } style={{ flex: 1}}/>
                        <span style={{ margin: 'auto 1em', display:'none'}}> <FontAwesomeIcon icon={faIdBadge} /> View profile </span>
                        <span style={{ margin: 'auto 1em', display:'none'}}> <FontAwesomeIcon icon={faPeopleArrows} /> Compare stats </span>
                    </ListRow>
                )}
                <div style={{padding: '0.5em 1em'}}>
                    <div>
                        <FontAwesomeIcon icon={ faUserPlus } onClick={ () => setModVisible(true) } style={{
                            color: '#fff',
                            fontSize: '48px',
                            cursor: 'pointer',
                            width: '48px',
                            height: '48px',
                            margin: '5px 0px',
                            filter: 'drop-shadow(0px 0px 5px black)',

                        }} />
                    </div>
                </div>
            </Module>

            <ModuleCalendar profile={ userProfile } />

            <ModuleNewsFeed profile={ userProfile } updateUserProfile={ updateUserProfile }/>

            <Modal visible={ modVisible } title={ 'Add friend' } onClose={ () => setModVisible(false) }>
                { loadingReq && <Spinner /> }
                { error && <p style={styleError}>{error}</p> }
                { msg && <p style={styleSuccess}>{msg}</p> }
                <label htmlFor={ 'email' }>Email address:</label>
                <input name={ 'email' } type={ 'email' } placeholder={ "name@example.com" } value={ email } onChange={ (e) => setEmail(e.target.value) } disabled={ loadingReq ? 'disabled' : '' }/>
                <input type={ 'submit' } value={ "Send request" } disabled={ loadingReq ? 'disabled' : '' } onClick={ postFR }/>
            </Modal>
        </div>
    )
}

const styleError = {
    background: '#f16b719e',
    border: '1px solid #f16b719e',
    padding: '5px'
}

const styleSuccess = {
    background: 'rgb(157 236 130 / 62%)',
    border: '1px solid rgb(80 193 59 / 62%)',
    padding: '5px'
}

export default SectionFriends;