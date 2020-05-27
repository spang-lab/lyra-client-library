/* global FileReader */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Container,
    Row,
    Col,
    Modal,
    Form,
    FormGroup,
    Input,
    Label,
    FormFeedback,
    Card,
    Button,
} from 'reactstrap';
import HeaderForm from './HeaderForm';


class UploadModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }
    componentDidMount() {
    }

    isInputValid() {
        return true;
    }

    close() {
        this.props.dispatch(closeModal());
        this.setState({
        });
    }


    handleFileChange(event) {
        const input = event.target;
        const file = input.files[0];
        if (!file) {
            return;
        }
        const oneMb = 1024 * 1024;
        if (file.size > 10 * oneMb) {
            this.setState({
                fileError: 'File is too big, please only submit files less than 10Mb',
            });
            return;
        }
        if (file.type !== 'text/plain' && file.type !== 'text/csv') {
            this.setState({
                fileError: `Invalid file type: ${file.type}, please select a csv file`,
            });
            return;
        }
        this.setState({
            fileError: null,
        });
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const seperators = [',', '\t', ';'];
            const text = e.target.result;
            const lines = text.split('\n');
            const head = lines.slice(0, 2);
            const firstLine = lines[0];
            const seperator = seperators.find(sep => firstLine.includes(sep));
            const cols = firstLine.split(seperator);
            this.setState({
                fileHeader: head,
                numRows: lines.length,
                numCols: cols.length,
                seperator,
            });
        };
    }

    submit(e) {
        e.preventDefault();
    }


    fileForm() {
        const { fileError } = this.state;
        return (
            <Form onSubmit={e => this.submit(e)}>
                <p> Please select a csv file with row and column names </p>
                <FormGroup
                    controlId="formFile"
                    validationState={(fileError) ? 'error' : null}
                >
                    <Label>
                        Data File:
                    </Label>
                    <Input
                        type="file"
                        aria-label="FileUploadFile"
                        onChange={e => this.handleFileChange(e)}
                    />
                    <FormFeedback>
                        {fileError}
                    </FormFeedback>
                </FormGroup>
            </Form>
        );
    }

    fileInfo() {
        const {
            fileError,
            fileHeader,
            numRows,
            numCols,
        } = this.state;
        let { seperator } = this.state;
        if (seperator === '\t') {
            seperator = 'Tab';
        }
        if (!fileHeader || fileError) {
            return '';
        }
        return (
            <div>
                <strong> Detected Features </strong><br />
                <span>
                    {numRows} Rows <br />
                    {numCols} Columns <br />
                    Seperator &quot;{seperator}&quot; <br />
                </span>
                <strong> File Header: </strong>
                <Card style={{ wordWrap: 'break-word' }} >
                    {fileHeader.map(line => (
                        <span key={line} >
                            {line} <br /><br />
                        </span>
                    ))}
                </Card>
            </div>
        );
    }


    render() {
        const loading = false;
        let buttonText = 'Start Upload';
        if (loading) {
            buttonText = 'Loading...';
        }

        return (
            <Modal
                show={this.props.show}
                onHide={() => this.close()}
                bsSize="large"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Upload Data
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col sm={{ size: 5, offset: 1 }} >
                                {this.fileForm()}
                                {this.fileInfo()}
                            </Col>
                            <Col sm="5" >
                                <HeaderForm />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.close()}> Close </Button>
                    <Button
                        bsStyle="success"
                        disabled={!this.isInputValid() || loading}
                        onClick={e => this.submit(e)}
                    >
                        {buttonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

UploadModal.propTypes = {
    show: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
};
UploadModal.defaultProps = {
    show: false,
};

export default UploadModal;
