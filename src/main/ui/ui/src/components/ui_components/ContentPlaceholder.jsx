import React from "react";

const ContentPlaceholder = (props) => {

    return (
        <div className={ 'content-placeholder' } style={style}>
            { props.children }
        </div>
    );
}

const style = {
        textAlign: 'center',
        height: window.innerWidth < 600 ? '280px' : '500px',
        justifyContent: 'center',
        display: 'flex', flexDirection: 'column'
}

export default ContentPlaceholder;