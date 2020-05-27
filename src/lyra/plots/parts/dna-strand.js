

/**
 * Calculate intersection of sections
 * @param {Object} sectionA - section 1
 * @param {integer} sectionA.start - start position
 * @param {integer} sectionA.stop - stop position
 * @param {Object} sectionB - section 2
 * @param {integer} sectionB.start - start position
 * @param {integer} sectionB.stop - stop position
 */
export function intersects(sectionA, sectionB) {
    return sectionB.start < sectionA.stop
        && sectionA.start < sectionB.stop;
}

/**
 * Check if 2 sections are close together
 * @param {Object} sectionA - section 1
 * @param {integer} sectionA.start - start position
 * @param {integer} sectionA.stop - stop position
 * @param {Object} sectionB - section 2
 * @param {integer} sectionB.start - start position
 * @param {integer} sectionB.stop - stop position
 */
export function almostIntersects(sectionA, sectionB, padding = 100) {
    const tmpA = {
        start: sectionA.start - padding,
        stop: sectionA.stop + padding,
    };
    const tmpB = {
        start: sectionB.start - padding,
        stop: sectionB.stop + padding,
    };

    return tmpB.start < tmpA.stop
        && tmpA.start < tmpB.stop;
}


export function createCollection(sections) {
    const placed = [];
    sections.forEach((section) => {
        const nSection = section;
        nSection.level = 0;
        placed.forEach((pSection) => {
            if (almostIntersects(nSection.dna, pSection.dna)
                && pSection.level === nSection.level) {
                nSection.level = pSection.level + 1;
            }
        });
        placed.push(nSection);
    });
    const sorted = placed.sort((a, b) => a.start - b.start);
    return sorted;
}

export const findLimits = (sections, padding = 0) => {
    let start = Infinity;
    let stop = -Infinity;
    sections.forEach((feature) => {
        const { dna } = feature;
        if (dna.start < start) {
            ({ start } = dna);
        }
        if (dna.stop > stop) {
            ({ stop } = dna);
        }
    });
    return {
        start: start - padding,
        stop: stop + padding,
    };
};

export const convertPostions = sections => sections
    .map((section) => {
        const { dna } = section;
        dna.start = parseInt(dna.start, 10);
        dna.stop = parseInt(dna.stop, 10);
        dna.length = dna.stop - dna.start;
        return {
            dna,
            ...section,
        };
    });


export const clampToLimit = (sections, limits) => sections
    .filter(section => section.dna.stop > limits.start && section.dna.start < limits.stop)
    .map((section) => {
        const { dna } = section;
        dna.start = Math.max(dna.start, limits.start);
        dna.stop = Math.min(dna.stop, limits.stop);
        return {
            ...section,
            dna,
        };
    });
