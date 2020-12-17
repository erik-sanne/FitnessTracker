import React, {useState, useRef} from "react";

const DataSelect = ({options, onSelect, placeholder = "Select something...", style}) => {
    const [ intermediateValue, setIntermediateValue] = useState("");
    const ref = useRef(null);

    const onChange = (event) => {
        setIntermediateValue(event.target.value);
        const list = options.filter(o => o === event.target.value);
        if (list.length === 1) {
            ref.current.blur();
            onSelect(event.target.value);
        }
    }

    const onFocus = (event) => {
        setIntermediateValue("");
    }

    return (
        <>
            <input name={"type"}
                   style={{...style}}
                   list="options"
                   placeholder={placeholder}
                   value={ intermediateValue }
                   ref={ ref }
                   onChange={ onChange }
                   onFocus={ onFocus } />
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