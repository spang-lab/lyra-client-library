import React, { useContext } from 'react';
import {
    Button,
    ButtonGroup,
} from 'reactstrap';

import { prettyPrint } from '../../../lyra';
import PlotContext from '../components/PlotContext';


const SurvivalSettings = () => {
    const { plot, updateSchema } = useContext(PlotContext);
    const { schema } = plot;
    const { split, schemaId } = schema.layout.conditions[0];
    const types = ['k-means', 'mean', 'median', 'quantile'];
    return (
        <React.Fragment>
            Select Split:
            <ButtonGroup>
                {types.map(t => (
                    <Button
                        key={t}
                        active={t === split}
                        outline
                        onClick={() => updateSchema({
                            schemaId,
                            split: t,
                        })}
                    >
                        {prettyPrint(t)}
                    </Button>
                ))}
            </ButtonGroup>
        </React.Fragment>
    );
};


export default SurvivalSettings;
