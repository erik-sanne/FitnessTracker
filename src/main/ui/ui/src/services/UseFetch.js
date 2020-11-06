import { useState, useEffect } from 'react';
import { getCookie } from 'react-use-cookie';
import Base64 from "base-64";

const baseURL = "http://localhost:8080/";

function useFetch(url, method = 'GET') {
    const [ data, setData ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        async function init() {

            const token = getCookie('session_token');

            try {
                if (token == null)
                    throw new Error('Token not provided');

                const response = await fetch(baseURL + url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Basic ${Base64.encode(token)}`
                    }
                });

                if (response.ok) {
                    const json = await response.json();
                    setData(json);
                } else {
                    throw response;
                }
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [url, method])

    return { data, error, loading };
}

export default useFetch;