import React from 'react'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine, Line, Tooltip } from 'recharts'
import { LineGraphComponenentProps } from './type';

const LineGraphComponent: React.FC<LineGraphComponenentProps> = ({lines, referenceLines, id, xLabel, yLabel}) => {
    return (
        <ResponsiveContainer id={id} className="LineGraphWrapper">
            <LineChart className="LineChart">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" label={{value:xLabel, position:"insideBottomRight", dy:5}} height={40}/>
                <YAxis label={{value:yLabel, position:"insideTopLeft", dx:60, dy: -25}} width={40} height={100}/>
                <Tooltip />
                {
                    referenceLines?.map(({x, y, stroke, label, dashed}, index) => {
                        return <ReferenceLine x={x} y={y} stroke={stroke} label={label} strokeDasharray={dashed} key={index}/>
                    })
                }
                {
                    lines.map(({data, type, stroke, name}) => {
                        return <Line type={type} data={data} dataKey="value" name={name} stroke={stroke} key={name}/>
                    })
                }
            </LineChart>
        </ResponsiveContainer>);
}

export default LineGraphComponent;