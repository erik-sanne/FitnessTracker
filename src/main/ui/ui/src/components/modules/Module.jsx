import React from 'react';
import ErrorBoundary from "./ErrorBoundary";

const Module = ({ title, style, substyle, headerStyle, className='', children }) => {
    return (
        <div className={ 'module ' + className } style={{ ...style }}>
            <div className={ 'module-structure' }>
            { title &&
                <div className={ 'module-header' }>
                    <h3 className={ 'module-header-text' } style={ headerStyle }> {title} </h3>
                    <div className={ 'divider' }/>
                </div>
            }
                <div className={ 'module-content' } style={{...substyle}}>
                    <ErrorBoundary>
                        { children }
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}

export default Module;