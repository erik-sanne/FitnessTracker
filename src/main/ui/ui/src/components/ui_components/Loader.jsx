import React from "react";
import {RotateSpinner} from "react-spinners-kit";

const Loader = () => {

    return (
        <div className={ 'default-loader' }>
            <div>
                <RotateSpinner color="rgba(107,166,239,1)" />
            </div>
        </div>
    );
}


export default Loader;