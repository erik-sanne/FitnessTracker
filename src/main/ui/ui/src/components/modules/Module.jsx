import React from 'react';
import ErrorBoundary from "./ErrorBoundary";

const Module = ({ title, style, className, children }) => {

    return (
        <div className={ 'module ' + className } style={style}>
            { title && <h3> {title} </h3>}
            <div style={outerContainer}>
                <div style={innerContainer}>
                    <ErrorBoundary>
                        { children }
                    </ErrorBoundary>
                </div>
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

const innerContainer = {
    display: 'block'
}

export default Module;