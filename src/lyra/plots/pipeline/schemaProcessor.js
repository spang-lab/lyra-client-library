/* eslint-disable class-methods-use-this */

import { cloneAndUpdate } from '../../util';


export default class SchemaProcessor {

    process(plot) {
        const updates = plot.init.updates || [];
        const { identifiers } = plot.init;
        const schema = cloneAndUpdate(plot.rawSchema, updates, {
            identifiers,
        });
        // const identifier = plot.init.options.identifier;
        return Object.assign(plot, { schema });
    }
}
