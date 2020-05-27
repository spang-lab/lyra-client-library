import {
    scaleLinear,
    scaleOrdinal,
    axisLeft,
    axisBottom,
    extent,
    mean,
} from 'd3';

import {
    linearRegression,
    sampleCorrelation,
    standardDeviation,
} from 'simple-statistics';

import {
    getChartDimensions,
    getRange,
} from '../../../d3';

import {
    arrayToDict,
    colorGenerator,
} from '../../util';

export default class ScatterPlotProcessor {
    createAxis(plot, points, correlations) {
        const dimensions = getChartDimensions(plot);
        const axisSchema = plot.schema.axes || {};

        const xName = plot.rawData.main[0].identifier.name;
        const yName = plot.rawData.main[1].identifier.name;

        const bottomAxis = {};
        bottomAxis.scale = scaleLinear()
            .domain(extent(points, d => d.x))
            .range(getRange(dimensions, 'bottom'));
        bottomAxis.render = axisBottom(bottomAxis.scale);
        bottomAxis.schema = axisSchema.bottom;
        bottomAxis.schema.label = xName;

        const leftAxis = {};
        leftAxis.scale = scaleLinear()
            .domain(extent(points, d => d.y))
            .range(getRange(dimensions, 'left'));
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = axisSchema.left;
        leftAxis.schema.label = yName;

        const legendAxis = {};
        legendAxis.scale = scaleOrdinal()
            .domain(correlations.map(g => `${g.value} (R: ${g.correlation})`))
            .range(correlations.map(g => colorGenerator.from(g.color)));


        return {
            left: leftAxis,
            bottom: bottomAxis,
            legend: legendAxis,
        };
    }

    toStandardUnits(points) {
        const xMean = mean(points, d => d.x);
        const xDev = standardDeviation(points.map(d => d.x));
        const yMean = mean(points, d => d.y);
        const yDev = standardDeviation(points.map(d => d.y));
        return points.map(p => ({
            ...p,
            x: (p.x - xMean) / xDev,
            y: (p.y - yMean) / yDev,
        }));
    }

    getCorrelations(points, groups) {
        const correlations = groups.map((group) => {
            const gdata = points.filter(p => p.group === group.value);
            const correlation = sampleCorrelation(
                gdata.map(p => p.x),
                gdata.map(p => p.y),
            ).toFixed(2);
            return {
                ...group,
                correlation,
            };
        });
        correlations.push({
            value: 'total',
            label: 'Total',
            color: '#000',
            correlation: sampleCorrelation(
                points.map(p => p.x),
                points.map(p => p.y),
            ).toFixed(2),
        });
        return correlations;
    }

    async process(plot) {
        const data = plot.rawData.main.map(
            obj => arrayToDict(obj.data, 'name'),
        );
        const groupData = plot.rawData.groups[0].data;
        const { groups, settings } = plot.schema.layout;
        const groupDict = arrayToDict(groups, 'value');

        let points = groupData.map((obj) => {
            const { name, value } = obj;
            const xObj = data[0][name];
            const yObj = data[1][name];
            const gObj = groupDict[value];
            if (!xObj || !yObj || !gObj) {
                return null;
            }
            return {
                name,
                x: xObj.value,
                y: yObj.value,
                group: value,
                label: gObj.label,
                color: colorGenerator.from(gObj.color),
            };
        }).filter(p => p);

        if (settings.standardUnits) {
            points = this.toStandardUnits(points);
        }
        const correlations = this.getCorrelations(points, groups);
        const axes = this.createAxis(plot, points, correlations);

        const regression = linearRegression(points.map(p => [p.x, p.y]));
        const xRange = extent(points, p => p.x * 0.8);
        const line = {
            x1: xRange[0],
            y1: regression.m * xRange[0] + regression.b,
            x2: xRange[1],
            y2: regression.m * xRange[1] + regression.b,
        };

        return {
            points,
            line,
            axes,
        };
    }
}
