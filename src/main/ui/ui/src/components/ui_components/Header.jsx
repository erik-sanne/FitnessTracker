import React from 'react';

const Header = ({ title }) => {
    return (
        <header>
            <h2 className={ 'header' }>
                { title }
            </h2>
        </header>
    );
}

export default Header;