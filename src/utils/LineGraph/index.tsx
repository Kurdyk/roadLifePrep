import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Line,
  Tooltip,
  Legend,
} from 'recharts';
import { LineGraphComponenentProps } from './type';
import { fuseData } from './hook';

const LineGraphComponent: React.FC<LineGraphComponenentProps> = ({
  lines,
  referenceLines,
  id,
  xLabel,
  yLabel,
}) => {
  const data = fuseData(lines);

  return (
    <ResponsiveContainer id={id} className="LineGraphWrapper">
      <LineChart data={data} className="LineChart">
        <XAxis
          dataKey="key"
          label={{ value: xLabel, position: 'insideBottomRight', dy: 5 }}
          height={40}
          allowDuplicatedCategory={false}
        />
        <YAxis
          label={{
            value: yLabel,
            position: 'insideTopLeft',
            dx: 60,
            dy: -25,
          }}
          width={40}
          height={100}
          domain={[0, 100]}
        />
        <Legend />
        <Tooltip />
        {referenceLines?.map(
          ({ x, y, stroke, label, dashed }, index) => (
            <ReferenceLine
              x={x}
              y={y}
              stroke={stroke}
              label={label}
              strokeDasharray={dashed}
              key={index}
            />
          )
        )}
        {lines.map(({ data, type, stroke, name, strokeDasharray }) => (
          <Line
            type={type}
            dataKey={name}
            stroke={stroke}
            strokeWidth={2}
            key={name}
            dot={{ stroke, strokeWidth: 2, r: 4 }} // Configure dot appearance
            strokeDasharray={strokeDasharray}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraphComponent;
