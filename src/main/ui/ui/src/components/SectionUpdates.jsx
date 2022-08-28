import React from 'react'
import Module from "./modules/Module";
import useFetch from "../services/useFetch";
import Loader from "./ui_components/Loader";
import ListRow from "./ui_components/ListRow";

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const SectionUpdates = () => {
    const { data, loading } = useFetch(`https://api.github.com/repos/erik-sanne/FitnessTracker/commits?per_page=100`, 'GET', true);

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "Changelog">
                { loading && <Loader animation={'grow'}/> }
                { !loading && data.map(obj =>
                        <ListRow onClick={ () => { window.open(obj.html_url, '_blank') }}>
                            <div>
                                <p style={dateStyle}>{ obj.commit.author.date.split('T')[0] }</p>
                                <p style={paragraphStyle}>{ capitalize(obj.commit.message) }</p>
                                <p style={{...paragraphStyle, color: '#aaa'}}>{ capitalize(obj.sha) }</p>
                            </div>
                        </ListRow>
                    )
                }
            </Module>
        </div>
    );
}


const paragraphStyle = {
    margin: '0px',
    paddingLeft: '0rem'
}

const dateStyle = {
    margin: '0.5rem 0'
}

export default SectionUpdates;