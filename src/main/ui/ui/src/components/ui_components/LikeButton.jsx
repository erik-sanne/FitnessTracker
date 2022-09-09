import React, {useState} from "react";
import ProfileDisplay from "./ProfileDisplay";
import { useLongPress } from 'use-long-press';

const LikeButton = ({ likes, onClick }) => {
    const [ overlay, setOverlay ] = useState(false);

    const onPress = useLongPress(() => {
        setOverlay(true);
    }, {threshold: 500});

    const onHover = () => {
        setOverlay(true);
    }

    const onLeave = () => {
        setOverlay(false);
    }

    const triggerClickEvent = () => {
        setOverlay(false);
        onClick();
    }

    return (
        <>
            <div {...onPress} onMouseEnter={onHover} onMouseLeave={onLeave} className={ 'like' } onClick={ triggerClickEvent } style={ { filter: likes.length > 0 ? 'grayscale(0)' : 'grayscale(1) brightness(0.2) opacity(0.5)'} } >
                <span className={ 'flex-icon' }>💪</span>{ likes.length > 0 && <span className={'counter'}>{ likes.length }</span>}
                {
                    overlay && likes.length > 0 &&
                    <div style={popupstyle}>
                        {
                            likes.map((likedBy, key) => <ProfileDisplay key={key} style={{ padding: '0.5em'}} displayName={likedBy.name} profilePicture={ likedBy.picture } /> )
                        }
                    </div>
                }
            </div>
        </>
    );
}

const popupstyle = {
    position: 'absolute',
    padding: '0.5em',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '0em 1em 1em 1em',
    top: '1em',
    left: '1em',
    width: '18em'
}

export default LikeButton;