import React, { Component } from 'react';
import {
    Form,
    FormGroup,
    Input,
    Label,
    FormFeedback,
} from 'reactstrap';

class HeaderForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }


    render() {
        const {
            nameError,
            typeError,
            accessError,
            descError,
        } = this.state;
        return (
            <Form>
                <FormGroup
                    controlId="headerName"
                    validationState={(nameError) ? 'error' : null}
                >
                    <Label>
                        Name:
                    </Label>
                    <Input
                        aria-label="Dataset name"
                        onChange={() => {}}
                    />
                    <FormFeedback>
                        {nameError}
                    </FormFeedback>
                </FormGroup>
                <FormGroup
                    controlId="headerType"
                    validationState={(typeError) ? 'error' : null}
                >
                    <Label>
                        Dataset Type:
                    </Label>
                    <Input
                        type="select"
                        aria-label="Dataset type"
                        onChange={() => {}}
                    >
                        <option value="a"> A </option>
                        <option value="b"> B </option>
                    </Input>
                    <FormFeedback>
                        {typeError}
                    </FormFeedback>
                </FormGroup>
                <FormGroup
                    controlId="access"
                    validationState={(accessError) ? 'error' : null}
                >
                    <Label>
                        Access Level:
                    </Label>
                    <Input
                        type="select"
                        aria-label="Dataset type"
                        onChange={() => {}}
                    >
                        <option value="private"> Private </option>
                        <option value="internal"> Internal</option>
                        <option value="public"> Public </option>
                    </Input>
                    <FormFeedback>
                        <strong> Private: </strong>
                        Access only after explicit access is granted
                        <br />
                        <strong> Internal: </strong>
                        Access for all registered users
                        <br />
                        <strong> Public: </strong>
                        Access for everyone
                    </FormFeedback>
                </FormGroup>
                <FormGroup
                    controlId="description"
                    validationState={(descError) ? 'error' : null}
                >
                    <Label>
                        Description:
                    </Label>
                    <Input
                        type="textarea"
                        placeholder="Description..."
                        aria-label="description"
                        onChange={() => {}}
                    />
                    <FormFeedback>
                        Please provide a description, source and a contact for this dataset
                    </FormFeedback>
                </FormGroup>
                <FormGroup
                    controlId="rowType"
                >
                    <Label>
                        Row Identifier Type:
                    </Label>
                    <Input
                        type="select"
                        aria-label="row identifier type"
                        onChange={() => {}}
                    >
                        <option value="a"> A </option>
                        <option value="b"> B </option>
                    </Input>
                </FormGroup>
                <FormGroup
                    controlId="colType"
                >
                    <Label>
                        Col Identifier Type:
                    </Label>
                    <Input
                        type="select"
                        aria-label="col identifier type"
                        onChange={() => {}}
                    >
                        <option value="a"> A </option>
                        <option value="b"> B </option>
                    </Input>
                    <FormFeedback>
                        What kind of identifier are the row and column names,
                        &quot;none&quot; if there are no col names
                    </FormFeedback>
                </FormGroup>
                <FormGroup
                    controlId="species"
                >
                    <Label>
                        Species:
                    </Label>
                    <Input
                        type="select"
                        aria-label="Species"
                        onChange={() => {}}
                    >
                        <option value="homo sapiens"> Human </option>
                        <option value="mus musculus"> Mouse</option>
                        <option value="none"> None </option>
                    </Input>
                </FormGroup>


            </Form>
        );
    }
}

export default HeaderForm;

