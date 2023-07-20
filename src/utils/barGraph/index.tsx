import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  Tooltip,
  Bar,
} from 'recharts';
import { BarGraphComponenentProps } from './type';
import { fuseData } from './hook';
import CustomizedLabel from 'utils/atoms/customizedLabel';


const BarGraphComponent: React.FC<BarGraphComponenentProps> = ({ bars, id, referenceLines }) => {
  return (
    <ResponsiveContainer id={id} className="BarGraphWrapper">
      <BarChart data={fuseData(bars)} barGap={0} barCategoryGap={0}>
        <XAxis dataKey="key" allowDuplicatedCategory={false} />
        <YAxis />
        <Tooltip />
        <Legend />
        {referenceLines?.map(({ x, y, stroke, label, dashed}, index) => {
          return <ReferenceLine x={x} y={y} stroke={stroke} label={<CustomizedLabel x={x} y={y} label={label} className="RefLabel"/>} 
          strokeDasharray={dashed} key={index} />;
        })}
        {bars.map(({ name, stroke }, index) => {
          return <Bar dataKey={name} fill={stroke} label={name} stackId="a" key={index} data={fuseData(bars)} name={name} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraphComponent;
