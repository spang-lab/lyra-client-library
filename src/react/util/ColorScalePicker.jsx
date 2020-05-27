import React from 'react';
import styles from '../stylesheets/styles.css';
import { colorGenerator } from '../../lyra';

export default function colorScalePicker(onChange) {
    return (
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-around' }}>
            {Object.keys(colorGenerator.colorData).map(scaleName => (
                <div
                    key={scaleName}
                    role="button"
                    tabIndex="0"
                    className={styles.circle}
                    style={{ background: colorGenerator.linearGradient(scaleName), float: 'left', cursor: 'pointer', marginRight: '14px' }}
                    title={scaleName}
                    onClick={() => onChange(scaleName)}
                />
                ))}
        </div>
    );
}
