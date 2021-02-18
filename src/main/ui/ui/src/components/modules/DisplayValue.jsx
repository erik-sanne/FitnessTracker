import React from 'react';

const DisplayValue = ({ text, value, style }) => {
    return (
        <div style={style}>
            <div style={{ padding: '10px' }}>
                <h2 style={{ fontSize: 'calc(10px + 1.0vmin)' }}>{ text }</h2>
                <h2 style={{ fontWeight: 'bold' }}>{ value }</h2>
            </div>
        </div>
    );
}

export default DisplayValue;