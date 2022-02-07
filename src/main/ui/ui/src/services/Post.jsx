import {getCookie} from "react-use-cookie";

const post = (endpoint, body) => new Promise((resolve, reject) => {
    const auth = getCookie('session_token');
    fetch(`${ process.env.REACT_APP_API_BASE }${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: body
    }).then(response => {
        if (response.ok) {
            resolve()
        } else if (response.status === 401) {
            window.location.replace("login?status=expired");
        } else {
            throw response;
        }
    }).catch(error => {
        reject(error)
    });
})

export default post;