import { scaleLinear, dispatch, extent, scaleOrdinal, axisLeft, hierarchy } from 'd3';
import { colorGenerator, arrayToDict, isSubarray } from '../../util';
import { getChartDimensions } from '../../../d3';

const hcluster = require('hierarchical-clustering');

function euclideanDist(a, b) {
    let d = 0;
    for (let i = 0; i < a.length; i += 1) {
        d += (a[i].row_rank - b[i].row_rank) ** 2;
    }
    return Math.sqrt(d);
}

function completeLinkage(distances) {
    return Math.max.apply(null, distances);
}

export default class HeatmapProcessor {
    createAxes(plot, identifiers) {
        const dimensions = getChartDimensions(plot);
        const schemas = plot.schema.axes || {};

        const leftTicks = identifiers.map((v, i) =>
            (dimensions.height / identifiers.length) * (i + 0.5));
        const leftAxis = {};
        leftAxis.scale = scaleOrdinal()
            .domain(identifiers.map(ident => ident.name))
            .range(leftTicks);
        leftAxis.render = axisLeft(leftAxis.scale);
        leftAxis.schema = schemas.left;

        return { leftAxis };
    }

    mergeNodes(nodes, level) {
        return (clusterIndices) => {
            const subsets = nodes.filter(n => isSubarray(n.containedIndices, clusterIndices));
            if (subsets.length === 1) {
                return {
                    ...subsets[0],
                    level,
                };
            }
            // merge the nodes
            return {
                level,
                containedIndices: clusterIndices,
                position: 0.5 * Math.abs(subsets[0].position + subsets[1].position),
                children: subsets,
            };
        };
    }

    clusterIdentifiers(plot) {
        const clusterData = plot.rawData.main.map(data => data.data);
        const levels = hcluster({
            input: clusterData,
            distance: euclideanDist,
            linkage: completeLinkage,
        });

        // retrieve the cluster hierarchy from the different levels
        let nodes = levels[0].clusters.map(cl => ({
            level: 0,
            containedIndices: cl,
            position: levels[levels.length - 1].clusters[0].findIndex(v => v === cl[0]),
            children: [],
        }));

        for (let i = 1; i < levels.length; i += 1) {
            // merge nodes
            nodes = levels[i].clusters.map(this.mergeNodes(nodes, i));
        }

        return hierarchy(nodes[0]);
    }

    async process(plot) {
        console.log(plot);
        // cluster identifiers
        console.time('hierarchical clustering');
        const clusterRoot = this.clusterIdentifiers(plot);
        console.log(clusterRoot);
        const identifierOrder = clusterRoot.data.containedIndices.map(i => ({
            id: plot.rawData.main[i].identifier.id,
            name: plot.rawData.main[i].identifier.name,
        }));
        console.timeEnd('hierarchical clustering');

        console.time('process heatmap');

        const filteredGroups = plot.schema.layout.groups.filter(g => !g.hidden).map(g => g.name);
        const sampleOrder = plot.rawData.groups[0].data
            .filter(v => filteredGroups.includes(v.value))
            .sort((a, b) => filteredGroups.findIndex(v => v === a.value) -
                filteredGroups.findIndex(v => v === b.value))
            .map(v => v.name);

        const groups = arrayToDict(plot.rawData.groups[0].data, 'name');

        const width = sampleOrder.length;
        const height = identifierOrder.length;
        // the order of the array is important (row wise matrix)
        const pointList = new Array(width * height);

        plot.rawData.main.forEach((dataRow) => {
            const row = identifierOrder.findIndex(v => v.id === dataRow.identifier.id);
            if (row === -1) {
                return;
            }
            dataRow.data.forEach((entity) => {
                const col = sampleOrder.findIndex(v => v === entity.name);
                if (col === -1) {
                    return;
                }
                // insert at unique location in array
                pointList[(row * width) + col] = {
                    ...entity,
                    group: groups[entity.name].value,
                    identifier: dataRow.identifier.name,
                };
            });
        });

        const colorScaleName = plot.schema.layout.colors.colorScale || 'viridis';
        const colorScale = scaleLinear()
            .domain(extent(pointList, d => d.row_rank))
            .interpolate((a, b) =>
                (t => colorGenerator.getColor((a + t) / (b - a), colorScaleName)));
        const colorScaleHex = scaleLinear()
            .domain(colorScale.domain())
            .interpolate((a, b) =>
                (t => colorGenerator.from((a + t) / (b - a), colorScaleName)));

        console.timeEnd('process heatmap');

        const { leftAxis } = this.createAxes(plot, identifierOrder, sampleOrder);

        return {
            // row wise matrix content
            points: pointList.map(point => ({
                ...point,
                color: colorScale(point.row_rank),
            })),
            // size of points matrix
            size: {
                height,
                width,
            },
            dendrogram: clusterRoot,
            colorScale: colorScaleHex,
            axes: {
                left: leftAxis,
            },
            dispatch: dispatch('tooltip'),
        };
    }
}
