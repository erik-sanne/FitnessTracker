import React from 'react';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faChartPie, faPlusCircle, faTrophy, faUserFriends} from "@fortawesome/free-solid-svg-icons";

const FooterMenu = () => {
    return (
        <footer className={ 'footer-menu' }>
            <div>
                <NavLink to="/general">
                    <FontAwesomeIcon icon={ faChartPie } style={{ fontSize: '2em' }}/>
                </NavLink>
            </div>
            <div>
                <NavLink to="/history">
                    <FontAwesomeIcon icon={ faBook } style={{ fontSize: '2em' }}/>
                </NavLink>
            </div>
            <div>
                <NavLink to="/new">
                    <FontAwesomeIcon icon={ faPlusCircle } style={{ fontSize: '3em' }}/>
                </NavLink>
            </div>
            <div>
                <NavLink to="/challenge">
                    <FontAwesomeIcon icon={ faTrophy } style={{ fontSize: '2em'}}/>
                </NavLink>
            </div>
            <div>
                <NavLink to="/social" >
                    <FontAwesomeIcon icon={ faUserFriends } style={{ fontSize: '2em'}}/>
                </NavLink>
            </div>
        </footer>
    );
}


export default FooterMenu;