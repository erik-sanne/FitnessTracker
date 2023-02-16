import React, {useEffect, useRef, useState} from "react";

const DataSelect = ({options, value, onSelect, placeholder = "Select something...", style, className}) => {
    const [ intermediateValue, setIntermediateValue] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        setIntermediateValue(value ? value : "");
    }, [value])

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

    const id = Math.floor(Math.random() * 9999999);

    return (
        <>
            <input name={"type"}
                   type={"text"}
                   list={"options" + id}
                   autoComplete={ "off" }
                   aria-autocomplete={ "none" }
                   style={{...style}}
                   className={ className }
                   placeholder={placeholder}
                   value={ intermediateValue }
                   ref={ ref }
                   onChange={ onChange }
                   onFocus={ onFocus } />
            <datalist id={"options"+id}>
                {
                    options.map((name, key) =>
                        <option key={ key } value={ name } />
                    )
                }
            </datalist>
        </>
    );
}

export default DataSelect;