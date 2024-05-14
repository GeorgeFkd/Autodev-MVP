import { setUrlAction } from "@/logic/reducer";
import type { AppContext as AppContextType } from "@/types/types";
import { createContext, useContext } from "react";
export const AppContext = createContext<AppContextType | null>(null);
type Dispatch<A> = (value: A) => void
export const AppDispatchContext = createContext<Dispatch<setUrlAction> | null>(null);


export function useGlobalState() {
    return { appState: useAppContext(), dispatch: useDispatch() }
}

function useAppContext() {
    return useContext(AppContext);
}

function useDispatch() {
    return useContext(AppDispatchContext);
}