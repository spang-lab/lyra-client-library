import { scaleLinear, scaleBand, axisLeft, axisBottom, extent, median } from 'd3';
import { getChartDimensions, getRange, getDomain } from '../../../d3';
import { arrayToDict, colorGenerator } from '../../util';

export default class BarplotProcessor {
    async process(plot) {
        const dimensions = getChartDimensions(plot);
        const schemas = plot.schema.axes || {};

        const main = plot.rawData.main[0].data;
        const { bars } = plot.schema.layout;
        const globalColor = plot.schema.layout.colorSettings.color;

        const mainDict = arrayToDict(main, 'name', false);

        const dBars = bars.map((bar) => {
            const { label } = bar;
            let { identifiers } = bar;
            const color = bar.color || globalColor;
            if (!Array.isArray(identifiers)) {
                identifiers = [identifiers];
            }
            const values = identifiers.map(id => mainDict[id.name]);
            const raw = values.map(v => v.value);
            const dBar = {
                label,
                value: label,
                values,
                median: median(raw),
                color: colorGenerator.from(color),
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
        // left axis
        const leftAxis = {};
        const values = dBars.map(bar => bar.max || bar.median);
        leftAxis.scale = scaleLinear()
            .domain(getDomain(values, schemas.left))
            .range(getRange(dimensions, 'left'));
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = schemas.left;

        // bottom axis
        const bottomAxis = {};
        const labels = dBars.map(b => b.label);
        bottomAxis.scale = scaleBand()
            .domain(labels)
            .range(getRange(dimensions, 'bottom'))
            .paddingInner(schemas.bottom.padding)
            .paddingOuter(schemas.bottom.padding);
        bottomAxis.render = axisBottom(bottomAxis.scale);
        bottomAxis.schema = schemas.bottom;

        return {
            bars: dBars,
            axes: {
                left: leftAxis,
                bottom: bottomAxis,
            },
        };
    }
}
