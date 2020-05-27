export function wrapSelection(helper) {
    return (_selection, ...params) => {
        _selection.each((data, i, nodes) => helper({
            element: nodes[i],
            index: i,
            data,
            selection: _selection,
        }, ...params));
    };
}

