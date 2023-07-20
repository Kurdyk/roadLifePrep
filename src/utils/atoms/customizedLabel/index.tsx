import React from 'react'
import { CustomizedLabelProps } from './type'

// a component to customize the label of the reference line
const CustomizedLabel: React.FC<CustomizedLabelProps> = ({x, y, fill, label, className }) => {
    return (
        <text x={x} y={y} fill={fill} className={className} textAnchor="middle">
            {label}
        </text>
    )
}

export default CustomizedLabel;