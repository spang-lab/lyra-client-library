
import fetch from 'isomorphic-fetch';
import LRU from 'lru-cache';
import { getPath, cacheKey } from './util';


const oneHour = 60 * 60 * 1000;
const cache = new LRU({
    max: 100,
    maxAge: oneHour,
});


const processRequest = (request) => {
    const path = getPath(request.path);
    const data = {
        ...request,
    };
    delete data.path;
    delete data.schemaId;
    const body = JSON.stringify(data);
    return { path, body };
};


export const apiRequest = async (request) => {
    const key = cacheKey(request);
    const result = cache.get(key);
    if (result) {
        return result;
    }
    const { path, body } = processRequest(request);
    const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        mode: 'cors',
    });
    const data = await response.json();
    cache.set(key, data);
    return data;
};
