import React from 'react';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faChartPie, faEllipsisH, faPlusCircle, faUserFriends} from "@fortawesome/free-solid-svg-icons";

const FooterMenu = ({toggleMenu}) => {
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
                <NavLink to="/social">
                    <span><FontAwesomeIcon icon={ faUserFriends } style={{ fontSize: '1.5em'}}/></span>
                    <span>Social</span>
                </NavLink>
            </div>
            <div>
                <a href="#" onClick={ toggleMenu }>
                    <span><FontAwesomeIcon icon={ faEllipsisH } style={{ fontSize: '1.5em'}}/></span>
                    <span>More</span>
                </a>
            </div>
        </footer>
    );
}


export default FooterMenu;