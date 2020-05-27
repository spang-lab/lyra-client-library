import { colorGenerator } from '../../util';

import { findLimits, convertPostions, createCollection } from './dna-strand';

const transcriptName = (feature) => {
    const transcript = feature.identifiers
        .find(id => id.type === 'ensembl transcript id');
    if (!transcript) {
        return null;
    }
    return transcript.name;
};

const selectTranscript = (annotation) => {
    const transcripts = annotation.filter(
        f => f.dna.type === 'transcript',
    );
    if (!transcripts || !transcripts.length) {
        throw new Error('No valid transcripts found');
    }
    const sorted = transcripts.sort((a, b) => b.dna.length - a.dna.length);
    const longest = transcriptName(sorted[0]);

    return annotation
        .filter(f => transcriptName(f) === longest);
};

const getAnnotation = (data) => {
    const annotation = convertPostions(data);
    const reduced = selectTranscript(annotation);
    return reduced;
};

const getTypes = (schema) => {
    const types = {};
    schema.forEach((entry, index) => {
        types[entry.type] = {
            ...entry,
            index,
            color: colorGenerator.from(entry.color),
        };
    });
    return types;
};
const addType = (feature, types) => {
    const type = types[feature.dna.type];
    if (!type) {
        return null;
    }
    return {
        ...feature,
        ...type,
    };
};


export const processAnnotation = (data, schema) => {
    const features = getAnnotation(data);
    const types = getTypes(schema);
    const annotation = features
        .map(f => addType(f, types))
        .filter(f => f)
        .sort((a, b) => b.dna.length - a.dna.length);

    const padding = 5000;
    const limits = findLimits(annotation, padding);

    const { chromosome } = annotation[0].dna;
    const position = {
        ...limits,
        chromosome,
    };
    const alignedAnnotation = createCollection(annotation);

    return {
        annotation: alignedAnnotation,
        position,
    };
};
