import React from 'react';

const Background = () => {
    const month = new Date().getMonth() + 1;

    if ([12, 1, 2].includes(month))
            return (
                <div className={ 'background' }>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                    <div className={ 'snow' }/>
                </div>
            );
    else
        return <div className={ 'background' } />

}

export default Background;