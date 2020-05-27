/* eslint-disable class-methods-use-this */
import { scaleLinear, scaleBand, axisLeft, axisBottom, histogram, max, extent, range, format, dispatch } from 'd3';
import { getChartDimensions, getRange } from '../../../d3';
import { selectSamples, colorGenerator } from '../../util';

export default class HistogramProcessor {
    async process(plot) {
        const dimensions = getChartDimensions(plot);
        const schemas = plot.schema.axes || {};

        const mainData = plot.rawData.main[0].data;
        const samples = selectSamples(mainData, plot);
        const extents = extent(samples.map(v => v.value));

        const bins = histogram()
            .value(d => d.value)
            .thresholds(range(
                extents[0],
                extents[1],
                (extents[1] - extents[0]) / plot.schema.layout.bins.count,
            ))(samples);

        const colorScale = scaleLinear()
            .domain([0, max(bins.map(b => b.length))])
            .interpolate((a, b) => {
                // use a gradient
                if (plot.schema.layout.bins.useColorScale) {
                    return (t => colorGenerator.from(
                        (t + a) / (b - a),
                        plot.schema.layout.bins.colorScale,
                    ));
                }
                // use a single color
                return () => plot.schema.layout.bins.color || 'steelblue';
            });

        const bars = bins.map((bin) => {
            const xMean = (bin.x1 + bin.x0) / 2;
            return {
                samples: bin,
                value: xMean,
                median: bin.length,
                color: colorScale(bin.length),
            };
        });


        const labels = {};
        bars.forEach((bar) => {
            labels[bar.value] = bar.label;
        });
        const bottomBandAxis = {};
        bottomBandAxis.scale = scaleBand()
            .domain(bars.map(b => b.value))
            .range(getRange(dimensions, 'bottom'))
            .paddingInner(0.05)
            .paddingOuter(0.05);
        bottomBandAxis.render = axisBottom(bottomBandAxis.scale)
            .tickFormat(format(',.2f'));
        bottomBandAxis.schema = schemas.bottom;


        const leftAxis = {};
        const maxV = max(bars, b => b.median);
        leftAxis.scale = scaleLinear()
            .domain([0, maxV])
            .range(getRange(dimensions, 'left'));
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = schemas.left;

        return {
            bars,
            axes: {
                left: leftAxis,
                bottom: bottomBandAxis,
            },
            dispatch: dispatch('tooltip'),
        };
    }
}
