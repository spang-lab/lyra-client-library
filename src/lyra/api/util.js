/* eslint-disable no-bitwise */


const getBasePath = () => {
    if (process.env.apipath) {
        return process.env.apipath;
    }
    return '/api/v3';
};

export const getPath = (path) => {
    const basePath = getBasePath();
    if (!path || !path.length) {
        throw new Error('Invalid empty path');
    }
    let fullPath = `${basePath}${path}`;
    if (path[0] !== '/') {
        fullPath = `${basePath}/${path}`;
    }
    return fullPath;
};

/**
 * simple hash function
 * INSECURE DO NOT USE FOR CRYPTO
 */
const hashCode = (str) => {
    let hash = 0;
    let chr;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i += 1) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export const cacheKey = data => hashCode(JSON.stringify(data));

export const getLoginUrl = (clientName, origin = '/') => {
    const basePath = getPath(`/user/login/${clientName}`);
    return `${basePath}?r=${origin}`;
};
export const getLogoutUrl = clientName => getPath(`/user/logout/${clientName}`);

