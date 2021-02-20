import '../../styles/Module.css';
import Spinner from "react-bootstrap/Spinner";
import React, {useState} from "react";

const ModulePRs = ({ data=[] }) => {
    const [ searchText, setSearchText  ] = useState('');
    const [ allExercies, ] = useState(data.sort((a, b) => a.exercise.localeCompare(b.exercise)));
    const [ viewedExercies, setViewedExercises ] = useState(allExercies);
    const VIEW_MAX = 10;

    const onSearch = (e) => {
        const val = e.target.value;
        setSearchText(val);
        const filtered = allExercies.filter(ex => camelCase(ex.exercise.replace(/_/g, ' ')).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setViewedExercises(filtered);
    }

    return (
        <>
            { !data ? <Spinner animation="grow"/> :
                <>

                    { viewedExercies.map((pr, idx) =>
                        idx < VIEW_MAX ?
                        <div key={idx} style={{display: 'flex', justifyContent: 'space-between', fontSize: 'calc(10px + 1vmin)', padding: '0.5rem 0.2rem'}}>
                            <div style={{textAlign: 'left', width: '1px', whiteSpace: 'nowrap'}}>{camelCase(pr.exercise.replace(/_/g, ' '))}</div>
                            <div style={{textAlign: 'right', width: '100px'}}>{pr.weight}kg</div>
                            <div>{pr.date.split('T')[0]}</div>
                        </div> : idx === VIEW_MAX &&
                        <div key={idx} style={{fontSize: 'calc(10px + 1vmin)', textAlign: 'center', padding: '0.5rem 0.2rem' }}>
                            <div>...</div>
                        </div>
                    )}
                    <input type={'search'} placeholder={ 'Filter...' } onChange={ (e) => onSearch(e) } value={ searchText } style={{ marginTop: '1rem' }}/>
                </>
            }
        </>
    );
}

const camelCase = (text) => {
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default ModulePRs;