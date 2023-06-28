import { useState } from "react";
import { ComponentChoice } from "utils/atoms/doubleLabelSwitch/type";

export const useData = (defaultComponent:ComponentChoice) => {

    const [chosenComponent, setChosenComponent] = useState<ComponentChoice>(defaultComponent);

    return ({
        chosenComponent,
        setChosenComponent
    })
}