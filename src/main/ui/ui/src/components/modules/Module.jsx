import React from 'react';

const Module = ({ title, style, children }) => {

    return (
        <div className={ 'module' } style={style}>
            <h3> {title} </h3>
            { children }
        </div>
    );
}

export default Module;