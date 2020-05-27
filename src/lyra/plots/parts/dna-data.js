
import { apiRequest } from '../../api';
import { convertPostions } from './dna-strand';
import { arrayToDict, colorGenerator } from '../../util';

export const getDnaData = async (schema, position) => {
    const request = {
        path: 'data/dna',
        ...schema,
        dna: position,
    };
    const { data, error } = await apiRequest(request);
    if (error) {
        throw new Error(error);
    }
    if (!data || !data.length) {
        throw new Error('No dna data');
    }
    const sections = convertPostions(data[0].data);
    return sections;
};

export const getLines = (types, sections, layout) => {
    const { drawCenters } = layout;
    const samples = types.map(e => e.name);
    const lines = {};
    samples.forEach((sample) => {
        lines[sample] = { name: sample, data: [] };
    });
    const filledSections = [];
    sections.forEach((section) => {
        if (filledSections.length === 0) {
            filledSections.push(section);
            return;
        }
        const prev = filledSections[filledSections.length - 1];
        if (section.start - prev.stop > 1) {
            const gap = {
                start: prev.stop,
                stop: section.start,
                values: [],
            };
            filledSections.push(gap);
        }
        filledSections.push(section);
    });
    filledSections.forEach((section) => {
        const { start, stop } = section.dna;
        const center = Math.round((start / 2) + (stop / 2));
        const values = arrayToDict(section.values, 'name', false);
        samples.forEach((sample) => {
            const val = values[sample] || {};
            const value = val.value || null;
            if (drawCenters) {
                lines[sample].data.push({
                    start,
                    stop,
                    x: center,
                    y: value,
                });
                return;
            }
            const offset = (stop - start) * 0.1;
            lines[sample].data.push({
                start,
                stop,
                x: start + offset,
                y: value,
            });
            lines[sample].data.push({
                start,
                stop,
                x: stop - offset,
                y: value,
            });
        });
    });
    return Object.values(lines);
};
const createGroupLines = (sGroup, bins, mouseIds) => {
    const lines = bins[sGroup.samples];
    const idDict = arrayToDict(mouseIds, 'name', false);

    if (sGroup.substract) {
        const substract = bins[sGroup.substract];
        const tagged = substract.map(line => ({
            ...line,
            mouseid: idDict[line.name].value,
        }));
        const subDict = arrayToDict(tagged, 'mouseid', false);

        const cLines = lines.map((line) => {
            const mouseid = idDict[line.name].value;
            const subLine = subDict[mouseid];
            const dataDict = arrayToDict(subLine.data, 'x', false);

            const newData = line.data.map((value) => {
                const subValue = dataDict[value.x];
                if (!value.y || !subValue.y) {
                    return value;
                }
                return {
                    ...value,
                    y: value.y - subValue.y,
                };
            });
            return {
                ...line,
                data: newData,
            };
        });
        return cLines.map(line => Object.assign({}, line, sGroup));
    }

    return lines.map(line => Object.assign({}, line, sGroup));
};

export const binLines = (lines, types, mouseIds, layout) => {
    const typeDict = arrayToDict(types, 'name', false);
    const groups = layout.lineGroups;
    const bins = {};
    lines.forEach((line) => {
        const typeObj = typeDict[line.name] || {};
        const type = typeObj.value || null;
        if (!bins[type]) {
            bins[type] = [];
        }
        bins[type].push(line);
    });
    return groups.map((group) => {
        const subGroups = group.types.map(sGroup => ({
            ...sGroup,
            color: colorGenerator.from(sGroup.color),
        }));
        const gLines = subGroups.map(g => createGroupLines(g, bins, mouseIds));
        const data = [].concat(...gLines).map(line => ({
            ...line,
            data: line.data.sort((a, b) => a.start - b.start),
        }));
        return {
            ...group,
            lines: data,
        };
    });
};
