import { ComponentChoice } from "./type";

export const useData = (dispatcher:React.Dispatch<React.SetStateAction<ComponentChoice>>) => {
    const changeHandler = (currentState:number) => {
        if (currentState === 0) {
            dispatcher.apply(undefined, [1]);
        } else {
            dispatcher.apply(undefined, [0]);
        }
    }

    return changeHandler;
}