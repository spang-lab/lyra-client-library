/* global window */
/* eslint-disable no-bitwise */

export function debounce(func, wait, immediate) {
    let timeout = null;
    return (...args) => {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

export function log(...args) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    const err = new Error();
    const location = err.stack.split('\n')[1].toString();
    const logArray = args;
    logArray.push(location);
    window.console.log(...logArray);
}

/**
 * convert an array of objects into a dictionary
 * @param {array} array - an array of objects
 * @param {string} key  - a key appearing in every object
 * @param {boolean} multiple - are there multiple objects with the same key,
 *                             if true will put them in arrays
 */
export function arrayToDict(array, key, multiple) {
    return array.reduce((accum, elem) => {
        const tmp = accum;
        if (multiple) {
            if (!tmp[elem[key]]) {
                tmp[elem[key]] = [];
            }
            tmp[elem[key]].push(elem);
        } else {
            tmp[elem[key]] = elem;
        }
        return tmp;
    }, {});
}

export function isSubarray(subArray, parentArray) {
    return subArray.every(v => parentArray.includes(v));
}


export function positionToText(position) {
    if (position < 1000) {
        return position.toString();
    }
    const short = Math.round(position / 100) / 10;
    return `${short}k`;
}


export function getObjectProperty(obj, ...keys) {
    return keys.reduce((accum, key) => {
        if (!accum) return undefined;
        return accum[key];
    }, obj);
}


export function prettyPrint(name) {
    return name
        .replace(/([a-z])([A-Z])/g, (m, p1, p2) => `${p1} ${p2}`)
        .replace(/_([a-z])/g, (m, p1) => ` ${p1.toUpperCase()}`)
        .replace(/^([a-z])/, (m, p1) => `${p1.toUpperCase()}`);
}

export function toSingle(value) {
    if (!Array.isArray(value)) {
        return value;
    }
    if (value.length === 0) {
        return null;
    }
    if (value.length !== 1) {
        throw new Error(`
            Cannot convert array ${JSON.stringify(value)} to single value, multiple entries`);
    }
    return value[0];
}

