import type { ApiData, AppContext, DataFromOpenAPIUrl, GeneralWebsiteUrl, Layout, OpenAPIUrl, SelectedApiData } from "@/types/types";
//i need some typing generally


interface AppAction<T> {
    type: string;
    payload: T;
}

type setUrlAction = AppAction<OpenAPIUrl | GeneralWebsiteUrl>;
type addSelectedApiDataAction = AppAction<ApiData>;
//this will also be used to edit the frequency for data
type editSelectedApiDataAction = AppAction<ApiData>;

type addLayout = AppAction<Layout>;
type editLayout = AppAction<Layout>;

type addPage = AppAction<string>;
type editPage = AppAction<string>;


export const EMPTY_APP_CONTEXT: AppContext = { inputUrl: "some weird page", pages: [], selectedApiData: [] }

export type AllActions = setUrlAction;

export default function appReducer(app: AppContext, action: AllActions): AppContext {
    if (action.type == "set-url") {
        const payload: string = action.payload;
        return {
            ...app,
            inputUrl: payload
        }
    }

    if (action.type == "set-api-data") {
        const payloadFetched: DataFromOpenAPIUrl[] = action.payload;
        const apiDataWithoutMetadata: SelectedApiData = payloadFetched.map(o => ({ ...o, frequency: null, range: null }))
        return {
            ...app,
            selectedApiData: apiDataWithoutMetadata
        }
    }

    return app;

    //for the rest of the functions
}
// function AppReducer(app:AppContext,action:)