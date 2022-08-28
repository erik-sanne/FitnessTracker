import {getCookie} from "react-use-cookie";

const get = (endpoint, external=false) => new Promise((resolve, reject) => {
    const auth = getCookie('session_token');
    fetch(`${ !external ? process.env.REACT_APP_API_BASE : '' }${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': !external ? `Basic ${auth}` : ''
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error)
            });
        } else if ( !external && response.status === 401) {
            window.location.replace("login?status=expired");
        } else {
            throw response;
        }
    }).catch(error => {
        reject(error)
    });
})

export default get;