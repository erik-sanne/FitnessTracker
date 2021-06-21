import React from 'react';
import ErrorBoundary from "./ErrorBoundary";

const Module = ({ title, style, className, children }) => {
    return (
        <div className={ 'module ' + className } style={{ ...style }}>
            { title && <h3> {title} </h3>}
            <div style={outerContainer}>
                <ErrorBoundary>
                    { children }
                </ErrorBoundary>
            </div>
        </div>
    );
}

const outerContainer = {
    height: 'calc(100% + max(-16vw, -96px))',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column'
}

export default Module;