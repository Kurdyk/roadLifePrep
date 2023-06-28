import React from 'react'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, ReferenceLine, Tooltip, Bar} from 'recharts';
import { BarGraphComponenentProps } from './type';

const BarGraphComponent: React.FC<BarGraphComponenentProps> = ({bars, id, referenceLines}) => {
    return (
        <ResponsiveContainer id={id} className="BarGraphWrapper">
            <BarChart
                data={bars[0].data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Legend />
                {
                    referenceLines?.map(({x, y, stroke, label, dashed}, index) => {
                        return <ReferenceLine x={x} y={y} stroke={stroke} label={label} strokeDasharray={dashed} key={index}/>
                    })
                }
                
                <Bar dataKey="value" fill="#8884d8" name="Usage"/>
                    
            </BarChart>
        </ResponsiveContainer>
    );
}

export default BarGraphComponent