import React from 'react'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Legend, ReferenceLine, Tooltip, Bar} from 'recharts';
import { BarGraphComponenentProps } from './type';

const BarGraphComponent: React.FC<BarGraphComponenentProps> = ({bars, id, referenceLines}) => {
    return (
        <ResponsiveContainer id={id} className="BarGraphWrapper">
            <BarChart
                data={bars[0].data}
            >
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Legend />
                {
                    referenceLines?.map(({x, y, stroke, label, dashed}, index) => {
                        return <ReferenceLine x={x} y={y} stroke={stroke} label={label} strokeDasharray={dashed} key={index}/>
                    })
                }
                
                <Bar dataKey="value" fill="#ff6714" name="Usage"/>
                    
            </BarChart>
        </ResponsiveContainer>
    );
}

export default BarGraphComponent