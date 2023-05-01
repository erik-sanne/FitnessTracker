import React, {useRef} from "react";

const FileSelect = ({ onFileSelected, children }) => {
    const inputRef = useRef(null);

    return (
        <div style={ style } onClick={ () => {inputRef.current?.click();}}>
            <input
                type="file"
                ref={inputRef}
                accept={ "image/png" }
                onChange={ (event) => {
                    if (event.target.files)
                        onFileSelected(event.target.files)
                }}
                style={{ display: 'none' }} />
            { children }
        </div>);
}

const style = {
    position: 'absolute',
    right: '0',
    bottom: '0',
    margin: '5px 15px',
    fontSize: '22px',
    filter: 'drop-shadow(0px 0px 10px black)',
    cursor: 'pointer',
    color: '#ccc'
}

export default FileSelect;