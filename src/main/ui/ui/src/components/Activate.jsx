import React, {useEffect, useState} from "react";
import Module from "./modules/Module";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useParams} from "react-router";

const Activate = () => {
    const { token } = useParams();
    const [ error, setError ] = useState(false)
    const [ success, setSuccess ] = useState(false)

    const activate = () => {
        
        fetch(`${ process.env.REACT_APP_API_BASE }/confirmEmail/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                setSuccess(true)
            } else
                throw new Error('');
        }).catch(_ => {
            setError(true)
        });
        
    }

    useEffect(() => { activate(); }, [token])

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <Module title={ 'Account activation' }>
                { success &&
                    <div style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={ faCheckCircle } style={{ color: 'rgb(49,133,21)', fontSize: '32px' }}/>
                        <br/>
                        <p>Account activation successful!</p>
                    </div>
                }

                { error &&
                    <div style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={ faTimesCircle } style={{color: 'rgba(159,20,25,0.62)', fontSize: '32px'}}/>
                        <br/>
                        <p>Invalid activation link! Account was not activated.</p>
                    </div>
                }
            </Module>
        </div>
    )
}

export default Activate;