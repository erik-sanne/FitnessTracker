import '../styles/App.css';
import React from 'react';

const Splash = () => {
    return (
        <section className={ 'page-wrapper splash' }>
            <div className={'content-wrapper'} style={{textAlign: 'center'}}>
                <div className={'text-wrapper'}>
                    <h2 className={'glitch'} data-text={"GAINZ TRACKER"}>GAINZ TRACKER</h2>
                </div>
            </div>
            <p style={footerText}>© Erik Sänne | 2020 </p>
        </section>
    );
}

const footerText = {
    position: 'absolute',
    bottom: '0px',
    margin: '5px'
}

export default Splash;