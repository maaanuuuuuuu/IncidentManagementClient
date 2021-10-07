import { createContext, useContext } from "react";

const defaultFishTypes: string[] = ["default"];

export const FishTypesContext = createContext(defaultFishTypes);

export function useFishTypesContext() {
    return useContext(FishTypesContext);
}
