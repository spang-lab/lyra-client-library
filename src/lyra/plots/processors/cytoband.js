/* eslint-disable class-methods-use-this */
import {
    scaleLinear,
    axisBottom,
} from 'd3';

import { colorGenerator } from '../../util';
import { apiRequest } from '../../api';

import {
    getChartDimensions,
    getRange,
    getDomain,
} from '../../../d3';


export default class CytobandProcessor {
    async getBands(plot, annotation) {
        const { dna } = annotation;
        const schema = plot.schema.data.bands;
        const request = {
            path: 'data/dna',
            ...schema,
            dna: {
                chromosome: dna.chromosome,
                start: '',
                stop: '',
            },
        };
        const response = await apiRequest(request);
        if (!response.data || !response.data.length) {
            throw new Error('No cytoband data');
        }
        const data = response.data[0];
        return data.data.map(v => ({
            ...v,
            value: v.values[0].value,
        }));
    }

    toPosition(str) {
        if (str.length > 3) {
            const short = str.substring(0, str.length - 3);
            const pos = parseInt(short, 10);
            return pos;
        }
        return 0;
    }

    getType(value) {
        if (value > 0) {
            return {
                type: 'band',
                color: colorGenerator.grayScale(value),
            };
        }
        switch (value) {
        case -1:
            return {
                type: 'centromere',
                color: '#96d0d3',
            };
        case -2:
            return {
                type: 'heterochromatic',
                color: '#e1ff77',
            };
        case -3:
            return {
                type: 'shortarm',
                color: '#FFF',
            };
        default:
            return 'band';
        }
    }

    async process(plot) {
        const data = plot.rawData;
        const main = data.main[0].data;

        if (!main || !main.length) {
            throw new Error(`
                 NoAnnotationError: 
                 No annotation for identifier`);
        }
        const annotation = main[0];

        const bands = await this.getBands(plot, annotation);
        const scaleData = [];
        const dataBands = bands.map((band) => {
            const { value } = band;
            const { type, color } = this.getType(value);
            const start = this.toPosition(band.dna.start);
            const stop = this.toPosition(band.dna.stop);
            scaleData.push(start);
            scaleData.push(stop);
            return {
                start,
                stop,
                value,
                color,
                type,
            };
        });

        const { dna } = annotation;
        dataBands.push({
            start: Math.floor(dna.start / 1000),
            stop: Math.ceil(dna.stop / 1000),
            value: 0.0,
            color: '#F00',
            stroke: '#F00',
            type: 'gene',
        });

        const dimensions = getChartDimensions(plot);
        const schemas = plot.schema.axes || {};
        const bottomAxis = {};
        bottomAxis.scale = scaleLinear()
            .domain(getDomain(scaleData, schemas.bottom))
            .range(getRange(dimensions, 'bottom'));
        bottomAxis.render = axisBottom(bottomAxis.scale)
            .ticks(6)
            .tickFormat(d => `${Math.round(d / 1000)}Mbp`);
        bottomAxis.schema = schemas.bottom;

        return {
            bands: dataBands,
            axes: {
                bottom: bottomAxis,
            },
            info: dna,
        };
    }
}
