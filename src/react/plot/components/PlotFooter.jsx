import React, { useContext } from 'react';
import { Card, Collapse, Badge } from 'reactstrap';
import { SampleBadge, Number } from '../../util';
import PlotContext from './PlotContext';


const renderTooltip = (tooltip) => {
    if (!tooltip || !tooltip.show) {
        return '';
    }
    const { type, data } = tooltip;
    switch (type) {
    case 'barplot':
        if (data.group) {
            return (
                <p>
                    {data.value}:
                    {' '}
                    <Number v={data.median} />
                    {'  '}
                    <Badge
                        pill
                        style={{ 'background-color': data.color }}
                    >
                        {data.group}
                    </Badge>
                </p>
            );
        }
        if (!data.samples) return <p />;
        return (
            <p>
                <Badge pill color="secondary">
                    { data.samples.length }
                </Badge> Samples:
                {' '}
                { data.samples.map(s => <SampleBadge key={s.name} sample={s} />)}
            </p>
        );
    case 'qqplot':
        return (
            <p>
                <SampleBadge sample={{ name: data.sample }} />
                <span className="pr-5" />
                Observed:
                {' '}
                <Number v={data.observed} />
                <span className="pr-5" />
                Normal:
                {' '}
                <Number v={data.normal} />
            </p>
        );
    case 'boxplot':
        return (
            <p>
                <Badge pill color="secondary">
                    { data.samples.length }
                </Badge> Samples
                <span className="pr-5" />
                <Badge pill color="secondary">
                    { data.stats.outliers.length }
                </Badge> Outliers:
                { data.stats.outliers.map(s => (
                    <span className="pr-4" key={s.name} >
                        <SampleBadge key={s.name} sample={s} />
                        <span>: </span>
                        <Number v={s.value} />
                    </span>
                ))}
            </p>
        );
    case 'kaplanmeier':
        return (
            <p>
                <Badge pill color="secondary">
                    { data.sampleCount }
                </Badge> Samples alive
                <span className="pr-5" />
                <Badge pill color="secondary">
                    { data.eventCount }
                </Badge> Events
            </p>
        );
    default:
        return `Unknown Tooltip type ${type}`;
    }
};


const PlotFooter = () => {
    const { tooltip } = useContext(PlotContext);
    return (
        <Collapse isOpen={tooltip && tooltip.show} >
            <Card body outline color="info" className="my-2 text-center mx-5 p-1" >
                {renderTooltip(tooltip)}
            </Card>
        </Collapse>
    );
};

export default PlotFooter;
