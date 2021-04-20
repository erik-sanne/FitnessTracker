import React from "react";

const TextButton = ({ text, style, mini, className, onClick, children }) => {
    if (mini)
        style = {...style, ...miniStyle}
    return <input type={ 'button' } className={ className } style={ {...style}} value={ text ? text : children } onClick={ onClick } />
}

const miniStyle = {
    padding: 'min(1vw, 6px) min(1.5vw, 12px)',
    margin: 'min(1vw, 6px) min(0.7vw, 6px)',
    color: 'rgba(107,166,239,0.7)',
    borderColor: 'rgba(107,166,239,0.2)',
    width: 'auto',
    display: 'inline',
    flex: 0,
    background: 'transparent',
    "&:hover": {
        background: "#efefef"
    }
}

export default TextButton;