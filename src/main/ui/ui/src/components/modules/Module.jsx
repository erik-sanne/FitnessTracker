import React from 'react';
import ErrorBoundary from "./ErrorBoundary";

const Module = ({ title, style, substyle, headerStyle, className='', children }) => {
    return (
        <div className={ 'module ' + className } style={{ ...style }}>
            { title && <h3 className={ 'module-header' } style={ headerStyle }> {title} </h3>}
            <div className={ 'module-content' } style={{...substyle}}>
                <ErrorBoundary>
                    { children }
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default Module;