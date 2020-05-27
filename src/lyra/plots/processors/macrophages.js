import { extent, dispatch, scaleLinear } from 'd3';
import { arrayToDict, colorGenerator } from '../../util';

export default class MacrophagesProcessor {
    async process(plot) {
        const exprDict = arrayToDict(plot.rawData.main[0].data, 'name', false);
        const stimulus = plot.rawData.pheno.find(ph => ph.identifier.name === 'stimulus');
        const stimulusLevel = plot.rawData.pheno.find(ph => ph.identifier.name === 'stimulus_level');
        const stimulusDict = arrayToDict(stimulus.data, 'name', false);

        // merge replicates
        const samples = {};
        stimulusLevel.data.forEach((lvl) => {
            // ignore the replicate number
            const id = lvl.name.substr(0, lvl.name.length - 2);
            const level = parseInt(lvl.value, 10);
            if (id in samples) {
                samples[id].expressions.push(exprDict[lvl.name].value);
            } else if (level <= 1) {
                samples[id] = {
                    id,
                    // only display a label for level 0
                    label: level === 0 ? id.split('_')[0] : '',
                    stimulus: stimulusDict[lvl.name].value,
                    stimulus_level: level,
                    expressions: [exprDict[lvl.name].value],
                    children: [],
                };
            }
        });

        // put everything into one hierarchy, that's why we need one single root
        // called dummy because it's hidden
        const root = {
            name: 'dummy-root',
            children: [],
        };

        const allExpressions = [];
        // asign children
        Object.keys(samples).forEach((key) => {
            const current = samples[key];
            // samples with stimulus no_st are root nodes (children of dummy root)
            if (current.stimulus_level === 0) {
                root.children.push(current);
            } else if (current.stimulus_level === 1) {
                if (current.stimulus in samples) {
                    samples[current.stimulus].children.push(current);
                } else {
                    // stimulus does not exist, create a fake parent/stimulus
                    // and add the current node
                    samples[current.stimulus] = {
                        id: current.stimulus,
                        label: current.stimulus.split('_')[0],
                        stimulus: 'no_st',
                        stimulus_level: 0,
                        expressions: [],
                        children: [current],
                    };
                    // add the fake parent to the root (level = 0)
                    root.children.push(samples[current.stimulus]);
                }
            }

            current.expressions.forEach(expr => allExpressions.push(expr));
        });

        // sort the nodes
        const sortById = (a, b) => a.id.localeCompare(b.id);
        root.children.forEach(level0 => level0.children.sort(sortById));
        root.children.sort(sortById);

        // generate colors
        const colorScale = scaleLinear()
            .domain(extent(allExpressions))
            .interpolate(() => (t => colorGenerator.from(t)));

        return {
            colorScale,
            root,
            dispatch: dispatch('tooltip'),
        };
    }
}
