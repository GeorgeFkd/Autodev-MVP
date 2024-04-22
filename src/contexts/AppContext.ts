import type { AppContext as AppContextType } from "@/types/types";
import { createContext, useContext } from "react";
export const AppContext = createContext<AppContextType | null>(null);
export const AppDispatchContext = createContext(null);




export function useAppContext() {
    return useContext(AppContext);
}

export function useDispatch() {
    return useContext(AppDispatchContext);
}