import React from "react";


const FormWrap = ({children}) => {
    return (
        <form style={style}>
            {children}
        </form>
    );
}

const style = {
    width: '100%',
    margin: '0',
    padding: '0',
    border: '0px',
    boxShadow: '0 0 0',
    background: 'transparent',
    justifyContent: 'center'
}

export default FormWrap;