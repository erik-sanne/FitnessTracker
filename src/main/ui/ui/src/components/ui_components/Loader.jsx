import React from "react";
import {RotateSpinner} from "react-spinners-kit";

const Loader = () => {

    return (
        <div style={wrapperStyle}>
            <RotateSpinner color="rgba(107,166,239,1)" />

        </div>
    );
}

const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '1em'
}

export default Loader;