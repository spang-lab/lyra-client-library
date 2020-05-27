
import { apiRequest } from '../../api';
import { addQuantileScores } from '../../statistics';

const getPayload = (request) => {
    if (request.manual || typeof request !== 'object') {
        return null;
    }
    const payload = {
        ...request,
    };
    if (payload.type) {
        payload.path = `data/${payload.type}`;
        delete payload.type;
    }
    delete payload.schemaId;
    return payload;
};

export default class ResourceProvider {
    async resolve(plot, request) {
        const payload = getPayload(request);
        if (!payload) {
            return null;
        }
        const response = await apiRequest(payload);
        if (!response) {
            plot.errors.push({
                name: 'NoResponseError',
                message: `No response from request ${JSON.stringify(payload)}`,
            });
            return null;
        }
        if (response.error) {
            plot.errors.push({
                name: response.errorName,
                message: response.error,
            });
            return null;
        }
        if (request.type === 'mhn_graph') {
            return response.data;
        }
        response.data.forEach((part) => {
            if (!part.data || !part.data.length) {
                plot.errors.push({
                    name: 'NoDataError',
                    message: `No data for ${part.identifier.name}
                          in dataset ${part.dataset.name}`,
                });
            }
        });
        if (plot.errors.length) {
            return null;
        }
        return response.data.map(r => ({
            identifier: r.identifier,
            dataset: r.dataset,
            data: addQuantileScores(r),
        }));
    }


    async process(plot) {
        const dataSchema = plot.schema.data;
        const data = {};
        const promises = Object.keys(dataSchema).map(async (key) => {
            const request = dataSchema[key];
            if (Array.isArray(request)) {
                const subPromises = request.map(subRequest => this.resolve(plot, subRequest));
                data[key] = await Promise.all(subPromises);
                return;
            }
            data[key] = await this.resolve(plot, request);
        });
        await Promise.all(promises);
        return Object.assign({}, plot, { rawData: data });
    }
}

