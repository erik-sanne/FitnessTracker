import '../styles/App.css';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Splash = () => {
    return (
        <section className={ 'page-wrapper splash' }>
            <div style={{textAlign: 'center'}}>
                <h2>Welcome</h2>
                <Spinner animation="grow" />
            </div>
        </section>
    );
}

export default Splash;