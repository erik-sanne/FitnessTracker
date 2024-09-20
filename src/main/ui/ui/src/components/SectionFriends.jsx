import React, {useState} from "react";
import Module from "./modules/Module";
import useFetch from "../services/useFetch";
import Modal from "./ui_components/Modal";
import Spinner from 'react-bootstrap/Spinner';
import {getCookie} from "react-use-cookie";
import {faIdBadge,} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProfileDisplay from "./ui_components/ProfileDisplay";
import {Redirect} from "react-router-dom";
import ModuleNewsFeed from "./modules/ModuleNewsFeed";
import ListRow from "./ui_components/ListRow";
import ModuleCalendar from "./modules/ModuleCalendar";
import {faCheck, faPeopleArrows, faTimes, faUserPlus} from "@fortawesome/free-solid-svg-icons";

const SectionFriends = ({ userProfile, updateUserProfile }) => {
    const [ modVisible, setModVisible ] = useState(false);
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
            <Module title = "Friends list" className={ "friends-list" }>
                <div style={{ }}>
                    { !loading && friendRequests && friendRequests.length > 0 && friendRequests.map((request, key) =>
                        <div key={key} style={{
                            border: '1px solid #333',
                            background: 'rgb(76 102 76)',
                            display: 'flex',
                            borderRadius: '1em'
                        }}> <span style={{
                            flex: 1,
                            padding: '1em', }}><strong> { request.from.displayName } </strong> sent a friend request</span>
                            <span style={{ float: 'right', fontSize: '1em', margin: 'auto 1em' }}>
                                        <span onClick={ () => accept(request.id) } style={{
                                            color: '#fff', border: '1px solid #fff', padding: '0.5em 1em', marginRight: '1em', borderRadius: '2em', background: '#325f3a'
                                        }}>
                                            Accept <FontAwesomeIcon icon={ faCheck } style={{ cursor: "pointer" }} />
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={ faTimes } style={{ cursor: "pointer", color: '#fff' }} onClick={ () => reject(request.id) }  />
                                        </span>
                                    </span>
                        </div>
                    ) }
                    { userProfile.friends && userProfile.friends.length > 0 && userProfile.friends.map((profile, key) =>
                        <ListRow key={key} onClick={ () => {
                            setRedirect(`/profile/${profile.userId}`)
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