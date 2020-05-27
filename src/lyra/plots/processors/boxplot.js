/* eslint-disable class-methods-use-this */
import {
    scaleLinear,
    scaleBand,
    axisLeft,
    axisRight,
    axisBottom,
} from 'd3';


import { arrayToDict, colorGenerator } from '../../util';
import { calculateBox } from '../../statistics';

import {
    getChartDimensions,
    getRange,
    getDomain,
} from '../../../d3';

export default class BoxplotProcessor {
    createAxes(plot, dataBoxes) {
        const dimensions = getChartDimensions(plot);
        const samples = dataBoxes.reduce(
            (accum, box) => accum.concat(box.samples),
            [],
        );
        const schemas = plot.schema.axes || {};

        // Left linear scale
        const values = samples.map(sample => sample.value);
        const leftAxis = {};
        leftAxis.scale = scaleLinear()
            .domain(getDomain(values, schemas.left))
            .range(getRange(dimensions, 'left'));
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = schemas.left;

        // Right Quantile scale
        const qValues = samples
            .map(sample => sample.quantile_col)
            .sort((a, b) => a - b);
        const heights = values
            .sort((a, b) => a - b)
            .map(leftAxis.scale);
        const rightAxis = {};
        rightAxis.scale = scaleLinear()
            .domain(qValues)
            .range(heights);
        rightAxis.render = axisRight(rightAxis.scale);
        rightAxis.schema = schemas.right;

        // Bottom ordinal scale
        const labels = {};
        dataBoxes.forEach((box) => {
            labels[box.value] = box.label;
        });
        const bottomAxis = {};
        bottomAxis.scale = scaleBand()
            .domain(Object.keys(labels))
            .range(getRange(dimensions, 'bottom'));
        if (schemas.bottom && schemas.bottom.padding) {
            const pad = schemas.bottom.padding;
            bottomAxis.scale
                .paddingInner(pad)
                .paddingOuter(pad);
        }
        bottomAxis.render = axisBottom(bottomAxis.scale)
            .tickFormat(d => labels[d]);
        bottomAxis.schema = schemas.bottom;

        return {
            left: leftAxis,
            right: rightAxis,
            bottom: bottomAxis,
        };
    }

    getBoxData(box, combinedDict) {
        let samples = combinedDict[box.value];
        if (box.values) {
            const sampleLists = box.values.map(v => combinedDict[v]);
            samples = [].concat(...sampleLists);
        }
        return {
            ...box,
            samples,
            color: colorGenerator.from(box.color),
        };
    }

    async process(plot) {
        const groups = plot.rawData.groups[0].data;
        const main = plot.rawData.main[0].data;
        const { boxes } = plot.schema.layout;
        const groupDict = arrayToDict(groups, 'name', false);

        const combined = main.map((sample) => {
            const group = groupDict[sample.name];
            if (!group) {
                return null;
            }
            return {
                group: group.value,
                ...sample,
            };
        }).filter(s => s);

        const combinedDict = arrayToDict(combined, 'group', true);

        const dataBoxes = boxes
            .map(box => this.getBoxData(box, combinedDict))
            .filter(box => box.samples && box.samples.length)
            .map((box) => {
                const stats = calculateBox(box.samples, sample => sample.value);
                return {
                    stats,
                    ...box,
                };
            });

        const axes = this.createAxes(plot, dataBoxes);
        return {
            boxes: dataBoxes,
            axes,
        };
    }
}
