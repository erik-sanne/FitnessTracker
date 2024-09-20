import React from "react";

const TextButton = ({ text, style, mini, className, onClick, disabled, children }) => {

    const miniStyle = {
        padding: 'min(1vw, 6px) min(1.5vw, 12px)',
        margin: '0 0.6rem 0 0 ',
        color: !disabled ? 'rgba(107,166,239,0.7)' : '#aaa',
        borderColor: !disabled ? 'rgba(107,166,239,0.2)': '#aaa',
        width: 'auto',
        display: 'inline',
        flex: 0,
        background: 'transparent',
        borderRadius: '2rem',
        "&:hover": {
            background: "#efefef"
        }
    }

    if (mini)
        style = {...style, ...miniStyle}
    return <input type={ 'button' } className={ className } style={ {...style}} value={ text ? text : children } disabled={ disabled ? "disabled" : ""} onClick={ onClick } />
}

export default TextButton;