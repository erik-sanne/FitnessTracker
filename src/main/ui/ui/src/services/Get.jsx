import {getCookie} from "react-use-cookie";

const get = (endpoint) => new Promise((resolve, reject) => {
    const auth = getCookie('session_token');
    fetch(`${ process.env.REACT_APP_API_BASE }${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                resolve(data);
            }).catch((error) => {
                reject(error)
            });
        } else if (response.status === 401) {
            window.location.replace("login?status=expired");
        } else {
            throw response;
        }
    }).catch(error => {
        reject(error)
    });
})

export default get;