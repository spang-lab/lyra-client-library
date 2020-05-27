import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'reactstrap';


import IdentifierList from './IdentifierList';
import { ErrorAlert } from '../../util';
import { apiRequest } from '../../../lyra';

class DatasetIdentifiers extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const request = {
            path: 'data/dataset',
            datasets: this.props.dataset,
        };
        const response = await apiRequest(request);
        if (response.error) {
            this.setState({
                error: response.error,
            });
            return;
        }
        let identifiers = response.data.rowNames;
        if (this.props.direction === 'col') {
            identifiers = response.data.colNames;
        }
        identifiers = this.props.process(identifiers);
        this.setState({
            identifiers,
        });
    }

    getList() {
        if (this.state.error) {
            return (
                <ErrorAlert
                    message={this.state.error}
                />
            );
        }
        return (
            <IdentifierList
                identifiers={this.state.identifiers}
                render={this.props.render}
                columns={this.props.columns}
            />
        );
    }

    render() {
        return (
            <Card body outline color="info">
                <CardTitle>
                    {this.props.name}
                </CardTitle>
                {this.getList()}
            </Card>
        );
    }
}


DatasetIdentifiers.propTypes = {
    dataset: PropTypes.string.isRequired,
    direction: PropTypes.string,
    process: PropTypes.func,
    render: PropTypes.func,
    columns: PropTypes.number,
    name: PropTypes.string.isRequired,
};
DatasetIdentifiers.defaultProps = {
    process: i => i,
    direction: 'row',
    render: undefined,
    columns: 2,
};


export default DatasetIdentifiers;
