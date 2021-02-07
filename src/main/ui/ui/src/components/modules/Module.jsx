import React from 'react';
import ErrorBoundary from "./ErrorBoundary";

const Module = ({ title, style, children }) => {

    return (
        <div className={ 'module' } style={style}>
            { title && <h3> {title} </h3>}
            <ErrorBoundary>
                { children }
            </ErrorBoundary>
        </div>
    );
}

export default Module;