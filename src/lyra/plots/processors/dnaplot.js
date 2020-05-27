import {
    scaleLinear,
    scaleBand,
    axisBottom,
    axisLeft,
} from 'd3';

import {
    getChartDimensions,
    getRange,
    getDomain,
} from '../../../d3';


import {
    positionToText,
} from '../../util';

import {
    processAnnotation,
    findLimits,
    fisheyeScale,
    clampToLimit,
    getDnaData,
    getLines,
    binLines,
} from '../parts';


const getAnnotation = (plot) => {
    const { data } = plot.rawData.annotation[0];
    const schema = plot.schema.layout.annotation;
    return processAnnotation(data, schema);
};


export default class DnaplotProcessor {
    constructor() {
        this.plot = null;
    }

    /**
     * Fetch the dna data from the api
     * @param {string} chromosome - the chromosome location
     * @param {string} start - the start position
     * @param {string} stop - the stop position
     */
    createAxes(plot, params) {
        const dimensions = getChartDimensions(plot);
        const { xLimits, annotation, lineGroups } = params;
        const schema = plot.schema || {};
        const axesSchema = schema.axes || {};
        const annotationHeightPercent = schema.layout.annotationHeightPercent || 0.3;

        // bottom axis
        const innerScale = scaleLinear()
            .domain(getDomain(
                [xLimits.start, xLimits.stop],
                axesSchema.bottom,
            ))
            .range(getRange(dimensions, 'bottom'));
        const bottomAxis = {};
        bottomAxis.scale = fisheyeScale(innerScale);
        bottomAxis.render = axisBottom(bottomAxis.scale)
            .tickFormat(d => positionToText(d));
        bottomAxis.schema = axesSchema.bottom;


        // annotation axis
        const levels = {};
        annotation.forEach((s) => { levels[s.level] = true; });
        const annotationHeight = dimensions.height * annotationHeightPercent;
        const annotationAxis = {};
        annotationAxis.scale = scaleBand()
            .domain(Object.keys(levels))
            .range([0, annotationHeight]);
        annotationAxis.schema = axesSchema.annotation;


        // group axis
        const groupAxis = {};
        groupAxis.scale = scaleBand()
            .domain(lineGroups.map(g => g.label))
            .range([annotationHeight, dimensions.height])
            .padding(0.025);
        groupAxis.render = axisLeft(groupAxis.scale);
        groupAxis.schema = axesSchema.groups;

        // line axis
        const lineAxis = {};
        let values = [];
        lineGroups.forEach((group) => {
            group.lines.forEach((line) => {
                values = values.concat(line.data
                    .filter(d => d.y)
                    .map(d => d.y));
            });
        });
        lineAxis.scale = scaleLinear()
            .domain(getDomain(values, axesSchema.lines))
            .range([groupAxis.scale.bandwidth(), 0]);
        lineAxis.render = axisLeft(lineAxis.scale);
        lineAxis.schema = axesSchema.lines;

        return {
            bottom: bottomAxis,
            annotation: annotationAxis,
            groups: groupAxis,
            lines: lineAxis,
        };
    }


    async process(plot) {
        const types = plot.rawData.type[0].data;
        const mouseIds = plot.rawData.mouseid[0].data;
        const { schema } = plot;
        const { layout } = schema;
        const { annotation, position } = getAnnotation(plot);
        const dataSchema = schema.data.dnadata;
        const dnaData = await getDnaData(dataSchema, position);
        const dataLimits = findLimits(dnaData, 500);
        const clampedAnnotation = clampToLimit(annotation, dataLimits);
        const lines = getLines(types, dnaData, layout);
        const lineGroups = binLines(lines, types, mouseIds, layout);
        const axes = this.createAxes(plot, {
            xLimits: dataLimits,
            annotation: clampedAnnotation,
            lineGroups,
        });
        return {
            axes,
            lineGroups,
            annotation: clampedAnnotation,
        };
    }
}
