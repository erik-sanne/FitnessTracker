import React from 'react';

const Module = ({ title, children }) => {

    return (
        <div className={ 'module' }>
            <h3> {title} </h3>
            { children }
        </div>
    );
}

export default Module;