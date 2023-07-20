import React from 'react'
import { SwitchableComponentProps } from './type'
import { Box } from '@mui/material'
import DoubleLabelSwitchComponent from 'utils/atoms/doubleLabelSwitch'
import { useData } from './hook'

const SwitchableComponent: React.FC<SwitchableComponentProps> = ({components, defaultComponent}) => {

    const {chosenComponent, setChosenComponent} = useData(defaultComponent);

     return (
        <Box className="SwitchableComponent">
            <DoubleLabelSwitchComponent 
                labels={[components[0].label, components[1].label]} 
                state={chosenComponent} 
                stateDispatcher={setChosenComponent}
                />
            {components[chosenComponent].element}
        </Box>
  )
}

export default SwitchableComponent