import React from "react";

const LikeButton = ({ count, onClick }) => {
    return (
        <div className={ 'like' } onClick={ onClick } style={ { filter: count > 0 ? 'grayscale(0)' : 'grayscale(1) brightness(0.2) opacity(0.5)'} }>
            <span className={ 'flex-icon' }>💪</span>{ count > 0 && <span className={'counter'}>{ count }</span>}
        </div>
    );
}

export default LikeButton;