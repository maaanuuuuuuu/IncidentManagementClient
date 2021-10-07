import { createContext, useContext } from "react";

export interface IPickupLocation {
    name: string;
    day: string;
}
const defaultPickupLocations: IPickupLocation[] = [
    {
        name: "test",
        day: "lundi"
    }
]

export const PickupLocationsContext = createContext(defaultPickupLocations);

export function usePickupLocationsContext() {
    return useContext(PickupLocationsContext);
}
