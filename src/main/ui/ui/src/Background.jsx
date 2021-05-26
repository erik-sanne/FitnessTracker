import React from 'react';

const Background = ( style ) => {
    const userPreferences = JSON.parse(localStorage.getItem("user_preferences"));
    const month = new Date().getMonth() + 1;

    if ([12, 1, 2].includes(month))
            return (
                <div className={ 'background' } style={{ filter: userPreferences && userPreferences.highContrast ? 'contrast(1.2)' : 'contrast(1)' }}>
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
        return <div className={ 'background' } style={{ filter: userPreferences && userPreferences.highContrast ? 'contrast(1.2)' : 'contrast(1)' }}/>

}

export default Background;