import '../../styles/Module.css';
import Spinner from "../ui_components/Loader";
import React, {useState} from "react";

const ModulePRs = ({ data=[] }) => {
    const [ searchText, setSearchText  ] = useState('');
    const [ allExercies, ] = useState(data.sort((a, b) => b.weight - a.weight ));
    const [ viewedExercies, setViewedExercises ] = useState(allExercies);

    const onSearch = (e) => {
        const val = e.target.value;
        setSearchText(val);
        const filtered = allExercies.filter(ex => camelCase(ex.exercise.replace(/_/g, ' ')).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setViewedExercises(filtered);
    }

    return (
        <>
            { !data ? <Spinner /> :
                <>
                    <div className={'primary-content-wrapper'}>
                        <div style={{ height: 'min(65vw, 500px)', overflowY: 'auto', padding: '1rem' }}>
                            <table>
                                <tbody>
                                    { viewedExercies.map((pr, idx) =>
                                        <tr key={idx}>
                                            <td style={{textAlign: 'left', whiteSpace: 'nowrap'}}>{camelCase(pr.exercise.replace(/_/g, ' '))}</td>
                                            <td style={{textAlign: 'right', width: '72px' }}>{ pr.weight > 0 ? `${pr.weight}kg` : 'BW'}</td>
                                            <td style={{ width: '140px' }}>{pr.date.split('T')[0]}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <input type={'search'} placeholder={ 'Filter...' } onChange={ (e) => onSearch(e) } value={ searchText } style={{ marginTop: '1rem' }} className={ 'default-input' }/>
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