import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

import { prettyPrint, toSingle } from '../../../lyra';
import { ErrorAlert, Spinner } from '../../util';
import InfoBox from './InfoBox';
import { GlobalContext } from '../../context';
import { useApi } from '../../hooks';


const AnnotationInfo = (props) => {
    const { identifierIndex, dataset, children } = props;
    const { identifiers } = useContext(GlobalContext);
    const identifier = identifiers[identifierIndex];
    const request = {
        path: 'data/annotation',
        identifiers: identifier,
        options: {
            entryType: 'gene',
            reduce: 'longest',
        },
        dataset,
    };
    const { data, error } = useApi(request);
    if (error) {
        return (
            <ErrorAlert message={error} />
        );
    }
    if (!data) {
        return <Spinner />;
    }
    const result = toSingle(data);
    const annotation = toSingle(result.data);
    const { dna } = annotation;
    return (
        <InfoBox title="Annotation Information">
            <Table>
                <thead />
                <tbody>
                    <tr>
                        <td> Version </td>
                        <td> hg38 </td>
                    </tr>
                    {Object.keys(dna).map(key => (
                        <tr key={key}>
                            <td>
                                { prettyPrint(key) }
                            </td>
                            <td>
                                { dna[key] }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {children}
        </InfoBox>
    );
};

AnnotationInfo.propTypes = {
    dataset: PropTypes.string.isRequired,
    children: PropTypes.element,
    identifierIndex: PropTypes.number,
};
AnnotationInfo.defaultProps = {
    identifierIndex: 0,
    children: (<div />),
};


export default AnnotationInfo;
