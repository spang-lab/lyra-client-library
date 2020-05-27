

export function rankToQScore(rank, total) {
    if (!rank) return null;
    const score = 1.0 - ((rank - 1) / (total - 1));
    return score;
}
/**
 * calculate quantile scores from ranks
 * @param {Object} response - the data response
 * @param {Array}  response.data - the data objects
 * @param {Object} response.dataset - the dataset object
 * @param {integer} response.dataset.num_rows - the number of rows
 * @param {integer} response.dataset.num_cols - the number of cols
 */
export function addQuantileScores(response) {
    const { dataset, data } = response;
    if (!dataset || !dataset.type === 'expression_matrix') {
        return data;
    }
    const qData = data.map(obj => ({
        ...obj,
        quantile_row: rankToQScore(obj.row_rank, dataset.num_cols),
        quantile_col: rankToQScore(obj.col_rank, dataset.num_rows),
    }));
    return qData;
}

