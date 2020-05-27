import { arrayToDict, colorGenerator } from '../../util';

export default class InteractionProcessor {

    getLinkColorGen(schema) {
        if (schema.layout.interactionColors) {
            const linkColors = schema.layout.interactionColors;
            const colorDict = arrayToDict(linkColors, 'value', false);
            return (link) => {
                if (colorDict[link.type]) {
                    return colorGenerator.from(
                        colorDict[link.type].color,
                    );
                }
                return '#bbb';
            };
        }
        if (schema.layout.colorWeights) {
            return (link) => {
                if (link.weight < 0) {
                    return '#C00';
                }
                return '#0C0';
            };
        }
        return () => '#bbb';
    }

    async process(plot) {
        console.log(plot);
        const interactions = plot.rawData.main[0].data;
        const linkColorGen = this.getLinkColorGen(plot.schema);
        const nodes = {};
        const links = [];
        interactions.forEach((interaction) => {
            const node1 = {
                name: interaction.name_1,
                type: interaction.type_1,
                typeName: interaction.typename_1,
                identifier: interaction.identifier_1,
                color: colorGenerator.getTypeColor(interaction.type_1),
            };
            if (!nodes[node1.identifier]) {
                nodes[node1.identifier] = node1;
            }
            const node2 = {
                name: interaction.name_2,
                type: interaction.type_2,
                typeName: interaction.typename_2,
                identifier: interaction.identifier_2,
                color: colorGenerator.getTypeColor(interaction.type_2),
            };
            if (!nodes[node2.identifier]) {
                nodes[node2.identifier] = node2;
            }
            const link = {
                source: node1.identifier,
                target: node2.identifier,
                type: interaction.type || 'basic',
                weight: interaction.weight,
            };
            links.push(link);
        });
        const nodeList = Object.values(nodes);
        const linkList = [];
        const pathList = [];
        links.forEach((link) => {
            const source = nodes[link.source];
            const target = nodes[link.target];
            const intermediate = {};
            nodeList.push(intermediate);
            linkList.push({
                source,
                target: intermediate,
            }, {
                source: intermediate,
                target,
            }, {
                source,
                target,
            });
            const color = linkColorGen(link);
            pathList.push({
                node: [source, intermediate, target],
                color,
                weight: link.weight,
            });
        });

        console.log(nodeList);

        return {
            nodeList,
            linkList,
            pathList,
        };
    }
}
