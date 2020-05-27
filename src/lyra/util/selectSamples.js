import { arrayToDict } from './util';
/**
 * extract sample subset form a plot
 * @param {object} plot - the plot
 * @param {object} plot.rawData - the raw data
 * @param {object} plot.rawData.groups - the pheno data to use
 * @param {object} plot.rawData.main - the samples to filter
 */

export function selectSamples(samples, plot) {
    const { layout } = plot.schema;
    if (!layout.filter) {
        return samples;
    }
    const selected = layout.filter.values;
    const data = plot.rawData[layout.filter.data][0];
    if (!data || !selected) {
        throw new Error(`Invalid sample filter, 
            ${JSON.stringify(layout.filter)}`);
    }
    const dataDict = arrayToDict(data.data, 'name', false);
    return samples.filter((sample) => {
        const group = dataDict[sample.name] || {};
        const groupValue = group.value;
        return selected.includes(groupValue);
    });
}

