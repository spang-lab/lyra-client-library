
import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import styles from '../stylesheets/styles.css';

const ErrorAlert = (props) => {
    let { error } = props;
    if (props.message) {
        error = {
            path: '',
            error: props.message,
        };
    }
    return (
        <div className={styles.padding_lr_md}>
            <Alert color="danger" key={error.path}>
                <strong> Error: </strong>
                {error.error}
            </Alert>
        </div>
    );
};

ErrorAlert.propTypes = {
    message: PropTypes.string,
    error: PropTypes.shape({
        code: PropTypes.number,
        error: PropTypes.string,
        path: PropTypes.string,
    }),
};
ErrorAlert.defaultProps = {
    message: null,
    error: {
        code: 0,
        error: '',
        path: '',
    },
};

export default ErrorAlert;
