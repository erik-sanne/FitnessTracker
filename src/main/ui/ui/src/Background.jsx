import React, {useEffect, useState} from 'react';
import image from "../src/resources/testbg.jpg";
import image2 from "../src/resources/testbg2.jpg";

const Background = ( style ) => {
    const LS_KEY_UP = "user_preferences"
    const [useImage, setUseImage] = useState(false);
    const [alt, setAlt] = useState(false);
    const month = new Date().getMonth() + 1;

    useEffect(() => {
         const userPreferences = JSON.parse(localStorage.getItem(LS_KEY_UP));
         if (userPreferences) {
             setUseImage(userPreferences.useBackground);
             setAlt(Math.random() > 0.5);
         }
    }, [])

    const imgStyle = useImage ?
    {
        backgroundImage: `url(${ alt ? image2 : image})`,
        filter: 'grayscale(0.8) contrast(4.5) brightness(0.2)',
        backgroundPositionY: '2rem'
    } : {}


        if ([12, 1, 2].includes(month))
            return (
                <div className={ 'background' } style={imgStyle}>
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
        return <div className={ 'background' } style={imgStyle}/>
}


export default Background;