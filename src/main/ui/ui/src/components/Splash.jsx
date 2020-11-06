import '../styles/App.css';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Splash = () => {
    return (
        <section className={ 'container splash' }>
            <h2>Welcome</h2>
            <Spinner animation="grow" />
        </section>
    );
}

export default Splash;