import React from 'react'
import { GenericFormComponentProps } from './type';
import ActionButtonGroupComponent from 'utils/atoms/buttonGroup/actionButtonGroup';
import InputGroupComponent from 'utils/atoms/inputGroup';
import { renderToogleButtons } from './hook';

const GenericFormComponent: React.FC<GenericFormComponentProps> = ({toggleButtonsGroupProps,
                                                                    actionButtonGroupProps,
                                                                    inputGroupProps,
                                                                    id}) => {

    const {actionButtonPropsList} = actionButtonGroupProps!;
    const {inputsPropsList, inputLabel} = inputGroupProps!;

    return (
        <form className="GenericForm" id={id}>
            {renderToogleButtons(toggleButtonsGroupProps)}
            <InputGroupComponent inputsPropsList={inputsPropsList} inputLabel={inputLabel} />
            <ActionButtonGroupComponent actionButtonPropsList={actionButtonPropsList} />
        </form>
  )
}

export default GenericFormComponent;