import { useState, useEffect } from 'react';
import { apiRequest } from '../../lyra';


const useApi = (request) => {
    const [response, setResponse] = useState({});
    const getData = async () => {
        try {
            const resp = await apiRequest(request);
            setResponse(resp);
        } catch (e) {
            const error = e.toString();
            setResponse({ error });
        }
    };
    useEffect(() => {
        getData();
    }, [request]);
    return response;
};
export default useApi;
