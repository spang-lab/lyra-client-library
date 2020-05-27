import { scaleLinear, scaleBand, scaleOrdinal, axisLeft, axisBottom, extent, median } from 'd3';
import { getChartDimensions, getRange, getDomain } from '../../../d3';
import { arrayToDict, colorGenerator } from '../../util';

export default class GroupedBarplotProcessor {
    async process(plot) {
        const dimensions = getChartDimensions(plot);
        const schemas = plot.schema.axes || {};

        const main = plot.rawData.main[0].data;
        const { bars } = plot.schema.layout;

        const mainDict = arrayToDict(main, 'name', false);

        const dataBars = plot.rawData.bars[0].data;
        const barDict = arrayToDict(dataBars, 'value', true);


        const groups = plot.rawData.groups[0].data;
        const groupDict = arrayToDict(groups, 'name', false);

        const dBars = bars.map((bar) => {
            const { label } = bar;
            let { identifiers } = bar;
            if (!Array.isArray(identifiers)) {
                identifiers = [identifiers];
            }
            const lists = identifiers.map(name => barDict[name]);
            identifiers = [].concat(...lists);

            const groupValues = identifiers.map(id => groupDict[id.name].value);
            const groupValue = groupValues[0] || 'none';

            const values = identifiers.map(id => mainDict[id.name]);
            const raw = values.map(v => v.value);
            const dBar = {
                label,
                value: label,
                values,
                median: median(raw),
                color: bar.color,
                group: groupValue,
            };
            if (raw.length > 1) {
                const [min, max] = extent(raw);
                return Object.assign(dBar, {
                    min,
                    max,
                });
            }
            return dBar;
        });
        const sortedBars = dBars
            .sort((b1, b2) =>
                (10 * b1.group.localeCompare(b2.group)) +
                b1.label.localeCompare(b2.label));
        const colorDict = arrayToDict(sortedBars, 'group', true);
        const colorCount = Object.keys(colorDict).length;
        const colors = colorGenerator.multiple(colorCount);
        Object.keys(colorDict).forEach((key, i) => {
            colorDict[key] = colors[i];
        });
        const cBars = sortedBars
            .map(bar => ({
                ...bar,
                color: bar.color || colorDict[bar.group],
            }));


        // left axis
        const leftAxis = {};
        const values = cBars.map(bar => bar.max || bar.median);
        leftAxis.scale = scaleLinear()
            .domain(getDomain(values, schemas.left))
            .range(getRange(dimensions, 'left'));
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = schemas.left;

        // bottom axis
        const bottomAxis = {};
        const labels = cBars.map(b => b.label);
        bottomAxis.scale = scaleBand()
            .domain(labels)
            .range(getRange(dimensions, 'bottom'))
            .paddingInner(schemas.bottom.padding)
            .paddingOuter(schemas.bottom.padding);
        bottomAxis.render = axisBottom(bottomAxis.scale);
        bottomAxis.schema = schemas.bottom;

        const legendAxis = {};
        legendAxis.scale = scaleOrdinal()
            .domain(Object.keys(colorDict))
            .range(colors);

        return {
            bars: cBars,
            axes: {
                left: leftAxis,
                bottom: bottomAxis,
                legend: legendAxis,
            },
        };
    }
}
