import { mean, median } from 'd3';
// import { ckmeans } from 'simple-statistics';

const skmeans = require('skmeans');

/**
 * add survival rate to event array
 * @param {Array} array - list of events
 * @param {Object} event - array element
 * @param {integer} event.status - alive or dead
 */
export function addSurvivalRate(bucket) {
    const samples = bucket.samples
        .sort((s1, s2) => s1.time - s2.time);
    const n = samples.length;
    let eventCount = 0;
    const step = 1 / n;
    let survival = 1;
    // add a start element (time 0, 100% survival)
    const start = {
        time: 0,
        status: 'alive',
    };
    samples.unshift(start);

    const sSamples = samples.map((event) => {
        if (event.status === 'dead') {
            eventCount += 1;
            survival -= step;
        }
        return {
            ...event,
            survival,
            sampleCount: n - eventCount,
            eventCount,
        };
    });
    return {
        ...bucket,
        samples: sSamples,
    };
}


/**
 * Applies K-Means clustering on the array
 * @param {Array} values an array containig values.
 * @param {number} k Number of clusters
 */
export function clusterKMeans(samples, k = 4) {
    const values = samples.map(sample => sample.value);
    const { idxs } = skmeans(values, k);
    const buckets = [];
    for (let i = 0; i < k; i += 1) {
        buckets[i] = {
            samples: [],
        };
    }
    samples.forEach((sample, i) => {
        const cluster = idxs[i];
        buckets[cluster].samples.push(sample);
    });
    const namedBuckets = buckets.map((bucket, i) => {
        const bMean = mean(bucket.samples, s => s.value);
        const rMean = Math.round(bMean * 100) / 100;
        return {
            ...bucket,
            name: `Cluster ${i} (mean: ${rMean})`,
        };
    });
    return namedBuckets;
}


export function clusterMean(samples) {
    const sMean = mean(samples, d => d.value);
    const buckets = [{
        name: 'below mean',
        samples: samples.filter(s => s.value <= sMean),
    }, {
        name: 'above mean',
        samples: samples.filter(s => s.value > sMean),
    }];
    return buckets;
}

export function clusterMedian(samples) {
    const sMean = median(samples, d => d.value);
    const buckets = [{
        name: 'below median',
        samples: samples.filter(s => s.value <= sMean),
    }, {
        name: 'above median',
        samples: samples.filter(s => s.value > sMean),
    }];
    return buckets;
}

/**
 * Separates the array using the quantiles
 * @param {Array} values List of samples, the key 'row_rank' is needed for each item
 * @param {Array} quantiles List of quantiles (ranged from 0 to 1) to be used
 */
function qName(q) {
    if (q > 1.0) {
        return 100;
    }
    return q * 100;
}


export function clusterQuantiles(samples, quantiles = [0.05, 0.95]) {
    const rSamples = samples
        .sort((a, b) => a.value - b.value)
        .map((sample, i) => ({
            ...sample,
            quantile: i / samples.length,
        }));
    // 1.1 to make sure the last sample is included
    const sections = [0, ...quantiles, 1.1];
    const buckets = [];
    for (let i = 0; i < sections.length - 1; i += 1) {
        const start = sections[i];
        const stop = sections[i + 1];
        const bucket = {
            name: `quantile ${qName(start)} - ${qName(stop)}%`,
            samples: rSamples.filter(s => s.quantile >= start && s.quantile < stop),
        };
        buckets.push(bucket);
    }
    return buckets;
}

