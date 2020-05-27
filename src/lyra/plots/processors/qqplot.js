import {
    scaleLinear,
    scaleOrdinal,
    axisLeft,
    axisBottom,
    mean,
    deviation,
    dispatch,
} from 'd3';
import { sampleKurtosis, sampleSkewness } from 'simple-statistics';
import { getChartDimensions, getRange } from '../../../d3';
import { normalValues } from '../../statistics/qqplot';
import { selectSamples } from '../../util';

export default class QQPlotProcessor {
    createLegendScale(observed, plot) {
        const lEntries = [
            {
                label: 'Mean',
                visible: plot.schema.layout.details.showMean,
                value: mean(observed),
            },
            {
                label: 'Standard deviation',
                visible: plot.schema.layout.details.showDeviation,
                value: deviation(observed),
            },
            {
                label: 'Kurtosis',
                visible: plot.schema.layout.details.showKurtosis,
                value: sampleKurtosis(observed),
            },
            {
                label: 'Skewness',
                visible: plot.schema.layout.details.showSkewness,
                value: sampleSkewness(observed),
            },
            {
                label: 'Sample Count',
                visible: plot.schema.layout.details.showSampleCount,
                value: observed.length,
            },
        ].filter(e => e.visible);
        const domain = lEntries.map(entry => `${entry.label}: ${Math.round(entry.value * 100) / 100}`);
        const range = lEntries.map(() => 'black');
        return scaleOrdinal()
            .domain(domain)
            .range(range);
    }


    createAxis(distributions, plot) {
        const dimensions = getChartDimensions(plot);
        const { schema } = plot;
        const axisSchema = schema.axes || {};


        const bottomAxis = {};
        bottomAxis.scale = scaleLinear()
            .domain([distributions.min, distributions.max])
            .range(getRange(dimensions, 'bottom'));
        bottomAxis.render = axisBottom(bottomAxis.scale);
        bottomAxis.schema = axisSchema.bottom;

        // bottom axis
        const leftAxis = {};
        leftAxis.scale = scaleLinear()
            .domain([distributions.min, distributions.max])
            .range(getRange(dimensions, 'left'));
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = axisSchema.left;

        const legendAxis = {};
        legendAxis.scale = this.createLegendScale(distributions.samples.map(s => s.observed), plot);

        return {
            left: leftAxis,
            bottom: bottomAxis,
            legend: legendAxis,
        };
    }

    createLines(plot, axes) {
        const linesSchema = plot.schema.layout.lines || {};
        const lineOffset = linesSchema.offset;
        const leftScale = axes.left.scale;
        const bottomScale = axes.bottom.scale;

        const p0 = {
            x: bottomScale.domain()[0],
            y: leftScale.domain()[0],
        };
        const p1 = {
            x: bottomScale.domain()[1],
            y: leftScale.domain()[1],
        };

        const lines = [
            {
                x1: bottomScale(p0.x),
                y1: leftScale(p0.y),
                x2: bottomScale(p1.x),
                y2: leftScale(p1.y),
                color: 'black',
            },
        ];
        if (lineOffset && lineOffset > 0) {
            lines.push({
                x1: bottomScale(p0.x + lineOffset),
                y1: leftScale(p0.y),
                x2: bottomScale(p1.x),
                y2: leftScale(p1.y - lineOffset),
                color: 'red',
            });
            lines.push({
                x1: bottomScale(p0.x),
                y1: leftScale(p0.y + lineOffset),
                x2: bottomScale(p1.x - lineOffset),
                y2: leftScale(p1.y),
                color: 'red',
            });
        }
        return lines;
    }


    createNormalDistribution(samples) {
        samples.sort((a, b) => a.value - b.value);
        const values = samples.map(s => s.value);

        const dMean = mean(values);
        const dSd = deviation(values);
        const n = values.length;
        const nValues = normalValues(n, dMean, dSd);
        const minV = Math.min(values[0], nValues[0]);
        const maxV = Math.max(values[n - 1], nValues[n - 1]);

        return {
            samples: samples.map((s, i) => ({
                name: s.name,
                observed: s.value,
                normal: nValues[i],
            })),
            min: minV,
            max: maxV,
        };
    }

    async process(plot) {
        const mainData = plot.rawData.main[0].data;
        const samples = selectSamples(mainData, plot);

        const distributions = this.createNormalDistribution(samples);
        const axes = this.createAxis(distributions, plot);

        const linesSchema = plot.schema.layout.lines || {};
        const lineOffset = linesSchema.offset;

        const dots = distributions.samples.map((s) => {
            let color = 'black';
            if (lineOffset && Math.abs(s.observed - s.normal) > lineOffset) {
                color = 'red';
            }
            return {
                sample: s.name,
                observed: s.observed,
                normal: s.normal,
                x: axes.bottom.scale(s.normal),
                y: axes.left.scale(s.observed),
                color,
            };
        });
        const lines = this.createLines(plot, axes);
        return {
            dots,
            lines,
            axes,
            dispatch: dispatch('tooltip'),
        };
    }
}
