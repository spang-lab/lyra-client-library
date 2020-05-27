import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import TypeBadge from './TypeBadge';
import { GlobalContext } from '../../context';

const IdentifierLink = (props) => {
    const { changeIdentifiers } = useContext(GlobalContext);
    const { lyStyle, identifier } = props;
    const onClick = () => {
        changeIdentifiers(identifier);
    };

    switch (lyStyle) {
    case 'small':
        return (
            <Button color="link" onClick={onClick}>
                {identifier.name}
            </Button>
        );
    case 'large':
        return (
            <div className="text-center">
                <Button color="link" onClick={onClick}>
                    <h1>
                        { identifier.name }
                    </h1>
                    <br />
                    <TypeBadge identifier={identifier} />
                </Button>
            </div>
        );
    default:
        return (
            <div className="text-center">
                <Button color="link" onClick={onClick}>
                    <span>
                        { identifier.name }
                    </span>
                    <br />
                    <TypeBadge identifier={identifier} />
                </Button>
            </div>
        );
    }
};


IdentifierLink.propTypes = {
    identifier: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
    lyStyle: PropTypes.string,
};
IdentifierLink.defaultProps = {
    lyStyle: 'normal',
};

export default IdentifierLink;

