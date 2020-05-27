
import { apiRequest } from '../../api';

export default class PlotProvider {
    async process(plot) {
        const { name } = plot.init;
        const response = await apiRequest({
            path: 'data/plot',
            name,
            dataset: 'plots',
            species: 'none',
        });
        if (response.error) {
            plot.errors.push({
                name: response.errorName,
                message: response.error,
            });
            return plot;
        }
        const schema = response.data;
        return {
            ...plot,
            rawSchema: schema,
        };
    }
}
