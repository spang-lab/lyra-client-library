
function combineUpdates(updates) {
    const updateDict = {};
    updates.forEach((update) => {
        const id = update.schemaId;
        if (!updateDict[id]) {
            updateDict[id] = update;
        } else {
            updateDict[id] = Object.assign(
                updateDict[id],
                update,
            );
        }
    });
    return updateDict;
}

function processRecursive(obj, updates, id = '0') {
    const replaceKey = '<replace>';
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    let clone = {
        schemaId: id,
    };
    if (Array.isArray(obj)) {
        clone = [];
    }
    Object.keys(obj).forEach((key, i) => {
        const newId = `${id}.${i}`;
        const subClone = processRecursive(obj[key], updates, newId);
        clone[key] = subClone;
    });
    if (updates[id]) {
        return Object.assign(clone, updates[id]);
    }
    if (clone.identifiers && clone.identifiers === replaceKey) {
        clone.identifiers = updates.identifiers;
    }
    if (clone.datasets && clone.datasets === replaceKey) {
        clone.datasets = updates.datasets;
    }
    return clone;
}

export function cloneAndUpdate(schema, updates, keyDict) {
    const updateDict = combineUpdates(updates);
    const fullDict = Object.assign(updateDict, keyDict);
    return processRecursive(schema, fullDict, '0');
}


export function findObjects(root, test) {
    if (!root || typeof root !== 'object') {
        return [];
    }
    if (test(root)) {
        return [root];
    }
    const results = Object.keys(root).map(key => findObjects(root[key], test));
    return [].concat(...results);
}


export function extractColors(schema) {
    const colors = findObjects(
        schema,
        obj => obj.label !== undefined && obj.color !== undefined,
    );
    return colors;
}
