import React, {useEffect, useState} from 'react'
import Module from "./modules/Module";
import Loader from "./ui_components/Loader";
import ListRow from "./ui_components/ListRow";
import get from "../services/Get";

const SectionUpdates = () => {

    const PAGE_SIZE = 30;

    const FetchStatus = {
        NONE: 0, LOADING: 1, MAX_REACHED: 2
    }

    const [ commits, setCommits ] = useState([]);
    const [ fetchStatus, setFetchStatus ] = useState(FetchStatus.NONE);


    useEffect(() => {
        getCommits();
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [commits, fetchStatus])


    const handleScroll = () => {
        const isBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (isBottom) {
            getCommits();
        }
    }

    const getCommits = () => {
        if (fetchStatus !== FetchStatus.NONE)
            return;

        setFetchStatus(FetchStatus.LOADING)

        const page = Math.floor(commits.length / PAGE_SIZE) + 1;
        get(`https://api.github.com/repos/erik-sanne/FitnessTracker/commits?per_page=${PAGE_SIZE}&page=${page}`, true).then(resp => {
            const newState = [...commits, ...resp]
            setCommits(newState);
            if (Math.floor(newState.length / PAGE_SIZE) + 1 === page) {
                setFetchStatus(FetchStatus.MAX_REACHED);
            } else {
                setFetchStatus(FetchStatus.NONE);
            }
        })
    }

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal' }}>
            <Module title = "Changelog">
                { commits.length > 0 && commits.map((obj, idx) =>
                        <ListRow onClick={ () => { window.open(obj.html_url, '_blank') }} key={idx}>
                            <div>
                                <p style={dateStyle}>{ obj.commit.author.date.split('T')[0] }</p>
                                <p style={paragraphStyle}>{ capitalize(obj.commit.message) }</p>
                                <p style={{...paragraphStyle, color: '#aaa'}}>{ capitalize(obj.sha) }</p>
                            </div>
                        </ListRow>
                    )
                }
                { fetchStatus === FetchStatus.MAX_REACHED ? <p style={maxReachedStyle}> End of history </p> : fetchStatus === FetchStatus.LOADING ? <Loader /> : '' }
            </Module>
        </div>
    );
}

const maxReachedStyle = {
    textAlign: 'center',
    color: '#555',
    padding: '1em',
    margin: '0',
}

const paragraphStyle = {
    margin: '0px',
    paddingLeft: '0rem'
}

const dateStyle = {
    margin: '0.5rem 0'
}

export default SectionUpdates;