import {getCookie} from "react-use-cookie";

const upload = (endpoint, files) => new Promise((resolve, reject) => {
    const data = new FormData();
    data.append(`file`, files[0], files[0].name);

    const auth = getCookie('session_token');
    fetch(`${ process.env.REACT_APP_API_BASE }${endpoint}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: data
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

export default upload;