import { scaleOrdinal } from 'd3';
import { arrayToDict, colorGenerator } from '../../util';

export default class PiechartProcessor {
    async process(plot) {
        const piecesSchema = arrayToDict(plot.schema.layout.pieces, 'value');

        const typesCount = {};
        plot.rawData.main[0].data
            .filter(v => !piecesSchema[v.value].hidden)
            .forEach((v) => {
                if (v.value in typesCount) {
                    typesCount[v.value] += 1;
                } else {
                    typesCount[v.value] = 1;
                }
            });

        const labeledCounts = Object.keys(typesCount).map(key => ({
            label: piecesSchema[key].label,
            count: typesCount[key],
            color: colorGenerator.from(piecesSchema[key].color),
        }));

        const legendAxis = {};
        legendAxis.scale = scaleOrdinal()
            .domain(labeledCounts.map(v => v.label))
            .range(labeledCounts.map(v => v.color));

        return {
            labeledCounts,
            axes: {
                legend: legendAxis,
            },
        };
    }
}
