import React, {useState} from "react";

const DataSelect = ({options, onSelect, placeholder = "Select something...", style}) => {
    const [ intermediateValue, setIntermediateValue] = useState("");

    const onChange = (event) => {
        setIntermediateValue(event.target.value);
        const list = options.filter(o => o === event.target.value);
        if (list.length === 1) {
            onSelect(event.target.value);
        }
    }

    return (
        <>
            <input name={"type"}
                   style={{...style}}
                   list="options"
                   placeholder={placeholder}
                   value={ intermediateValue }
                   onChange={ onChange }/>
            <datalist id="options">
                {
                    options.map((name, key) =>
                        <option key={key} value={ name } />
                    )
                }
            </datalist>
        </>
    );
}

export default DataSelect;