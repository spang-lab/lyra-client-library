
import {
    scaleLinear,
    scaleOrdinal,
    axisLeft,
    axisBottom,
    max,
} from 'd3';
import { getChartDimensions, getRange } from '../../../d3';
import { colorGenerator, selectSamples } from '../../util';
import {
    addSurvivalRate,
    clusterKMeans,
    clusterQuantiles,
    clusterMean,
    clusterMedian,
} from '../../statistics/survival';


const toDict = (phenoList) => {
    const dict = {};
    phenoList.forEach((obj) => {
        dict[obj.name] = obj.value;
    });
    return dict;
};

export default class KaplanMeierProcessor {
    createAxes(plot, buckets) {
        const schemas = plot.schema.axes || {};
        const dimensions = getChartDimensions(plot);
        const maxTime = max(buckets, b => b.samples[b.samples.length - 1].time);

        // left axis
        const leftAxis = {};
        leftAxis.scale = scaleLinear()
            .domain([0, 1])
            .range(getRange(dimensions, 'left'));
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = schemas.left;

        // bottom axis
        const bottomAxis = {};
        bottomAxis.scale = scaleLinear()
            .domain([0, maxTime])
            .range(getRange(dimensions, 'bottom'));
        bottomAxis.render = axisBottom(bottomAxis.scale);
        bottomAxis.schema = schemas.bottom;

        // legend scale
        const legendAxis = {};
        legendAxis.scale = scaleOrdinal()
            .domain(buckets.map(b => b.name))
            .range(buckets.map(b => b.color));
        return { leftAxis, bottomAxis, legendAxis };
    }


    addConditions(samples, plot) {
        const { conditions } = plot.schema.layout;
        let eSamples = samples;
        conditions.forEach((condition) => {
            if (['main', 'time', 'status'].includes(condition.input)) {
                return;
            }
            const dataList = plot.rawData[condition.input];
            const dataDict = toDict(dataList);
            eSamples = eSamples
                .map((sample) => {
                    const nSample = sample;
                    nSample[condition.input] = dataDict[sample.name];
                    return nSample;
                })
                .filter(sample => sample[condition.input]);
        });
        return eSamples;
    }

    splitSamples(samples, plot) {
        const { conditions } = plot.schema.layout;

        const buckets = conditions.reduce(
            (acc, condition) => this.applyCondition(acc, condition),
            [{ samples }],
        );
        return buckets;
    }

    applyCondition(buckets, condition) {
        const subBuckets = buckets.map((bucket) => {
            if (condition.input === 'main') {
                return this.splitValues(bucket, condition);
            }
            return [bucket];
        });
        return [].concat(...subBuckets);
    }

    splitValues(bucket, condition) {
        let subBuckets;
        switch (condition.split) {
        case 'k-means':
            subBuckets = clusterKMeans(bucket.samples);
            break;
        case 'mean':
            subBuckets = clusterMean(bucket.samples);
            break;
        case 'median':
            subBuckets = clusterMedian(bucket.samples);
            break;
        case 'quantile':
            subBuckets = clusterQuantiles(bucket.samples, condition.quantiles);
            break;
        default:
            throw new Error(`Unknown split condition ${condition.split}`);
        }
        if (!bucket.name) {
            return subBuckets;
        }
        return subBuckets.map(b => ({
            ...b,
            name: `${bucket.name}, ${b.name}`,
        }));
    }

    async process(plot) {
        const { rawData } = plot;
        const mainData = rawData.main[0].data;
        const status = toDict(rawData.status[0].data);
        const timeList = rawData.time[0].data
            .map(timePoint => ({
                ...timePoint,
                value: parseInt(timePoint.value, 10),
            }));
        const time = toDict(timeList);
        const data = selectSamples(mainData, plot);

        const samples = data
            .map(sample => ({
                ...sample,
                time: time[sample.name],
                status: status[sample.name],
            }))
            .filter(sample => sample.value && sample.time && sample.status);

        const cSamples = this.addConditions(samples, plot);
        const pBuckets = this.splitSamples(cSamples, plot);


        const sBuckets = pBuckets.map(bucket => addSurvivalRate(bucket));

        const { colorScale } = plot.schema.layout;
        const colors = colorGenerator.multiple(sBuckets.length, colorScale);
        const buckets = sBuckets.map((bucket, i) => ({
            ...bucket,
            color: colors[i],
            alive: bucket.samples.filter((s, j) =>
                s.status === 'alive' && j > 0),
        }));
        const { leftAxis, bottomAxis, legendAxis } = this.createAxes(plot, buckets);


        return {
            buckets,
            axes: {
                left: leftAxis,
                bottom: bottomAxis,
                legend: legendAxis,
            },
        };
    }
}
