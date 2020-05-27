import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

import '../stylesheets/styles.css';


class HelpIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    toggle() {
        this.setState({
            open: !this.state.open,
        });
    }

    render() {
        return (
            <div>
                <img
                    src="/images/icons/info.svg"
                    className="icon-muted icon-circle p-1"
                    alt="help icon"
                    width="30"
                    id="TooltipTarget"
                />
                <Tooltip placement="right" isOpen={this.state.open} target="TooltipTarget" toggle={() => this.toggle()} >
                    {this.props.children}
                </Tooltip>
            </div>
        );
    }
}

HelpIcon.propTypes = {
    children: PropTypes.string.isRequired,
};

export default HelpIcon;

