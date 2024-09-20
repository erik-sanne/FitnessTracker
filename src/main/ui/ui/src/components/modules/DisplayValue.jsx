import React from 'react';

const DisplayValue = ({ text, value, style, right=false }) => {
    return (
        <div style={style}>
            <div style={{ padding: right ? '0.8rem 0 0 0.8rem' : '0.8rem 0.8rem 0 0' }}>
                <h2 style={{ fontSize: '0.8rem' }}>{ text }</h2>
                <h2 style={{ fontWeight: 'bold', marginBottom: '0', fontSize: "1.5rem" }}>{ value }</h2>
            </div>
        </div>
    );
}

export default DisplayValue;