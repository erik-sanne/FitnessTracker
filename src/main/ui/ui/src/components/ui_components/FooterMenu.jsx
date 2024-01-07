import React from 'react';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faChartPie, faPlusCircle, faTrophy, faUserFriends} from "@fortawesome/free-solid-svg-icons";

const FooterMenu = () => {
    return (
        <footer className={ 'footer-menu' }>
            <div>
                <NavLink to="/general">
                    <span><FontAwesomeIcon icon={ faChartPie } style={{ fontSize: '1.5em' }}/></span>
                    <span>Home</span>
                </NavLink>
            </div>
            <div>
                <NavLink to="/history">
                    <span><FontAwesomeIcon icon={ faBook } style={{ fontSize: '1.5em' }}/></span>
                    <span>Logbook</span>
                </NavLink>
            </div>
            <div>
                <NavLink to="/new">
                    <span><FontAwesomeIcon icon={ faPlusCircle } style={{ fontSize: '1.5em' }}/></span>
                    <span>New</span>
                </NavLink>
            </div>
            <div>
                <NavLink to="/challenge">
                    <span><FontAwesomeIcon icon={ faTrophy } style={{ fontSize: '1.5em'}}/></span>
                    <span>Challenges</span>
                </NavLink>
            </div>
            <div>
                <NavLink to="/social" >
                    <span><FontAwesomeIcon icon={ faUserFriends } style={{ fontSize: '1.5em'}}/></span>
                    <span>Social</span>
                </NavLink>
            </div>
        </footer>
    );
}


export default FooterMenu;