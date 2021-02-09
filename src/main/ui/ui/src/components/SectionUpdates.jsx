import React from 'react'
import Module from "./modules/Module";
import useFetch from "../services/useFetch";
import Spinner from "react-bootstrap/Spinner";
import {faUserShield} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const SectionUpdates = () => {
    const { data, loading } = useFetch(`https://api.github.com/repos/erik-sanne/FitnessTracker/commits?per_page=100`, 'GET', true);

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "Changelog">
                <span style={{
                    position: 'absolute',
                    right: 'min(4vw, 32px)',
                    top: 'min(3.5vw, 32px)',
                    fontSize: 'min(calc(8px + 3.5vmin), 30px)',
                    color: 'rgb(61 65 72)'
                }}>
                    Mod <FontAwesomeIcon icon={ faUserShield }/>
                </span>

                { loading && <Spinner animation={'grow'}/> }
                { !loading && data.map(obj =>
                        <div style={containerStyle}>
                            <p style={dateStyle}>{ obj.commit.author.date.split('T')[0] }</p>
                            <p style={paragraphStyle}>{ capitalize(obj.commit.message) }</p>
                            <p style={{...paragraphStyle, color: '#aaa'}}>{ capitalize(obj.sha) }</p>
                        </div>
                    )
                }
            </Module>
        </div>
    );
}

const containerStyle = {
    padding: '0.5rem 0'
}

const paragraphStyle = {
    margin: '0px',
    paddingLeft: '0rem'
}

const dateStyle = {
    margin: '0.5rem 0'
}

export default SectionUpdates;