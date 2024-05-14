import { SupportedSoftware, type ApiData, type AppContext, type DataFromOpenAPIUrl, type GeneralWebsiteUrl, type Layout, type OpenAPIUrl, type Page, type SelectedApiData } from "@/types/types";
//i need some typing generally


interface AppAction<T> {
    type: string;
    payload: T;
}

export type setUrlAction = AppAction<OpenAPIUrl | GeneralWebsiteUrl>;
type addSelectedApiDataAction = AppAction<ApiData>;
//this will also be used to edit the frequency for data
type editSelectedApiDataAction = AppAction<ApiData>;

type addLayout = AppAction<Layout>;
type editLayout = AppAction<Layout>;

type addPage = AppAction<string>;
type editPage = AppAction<string>;


export const EMPTY_APP_CONTEXT: AppContext = { inputUrl: "some weird page", pages: [], selectedApiData: [], appName: "", appType: SupportedSoftware.NONE }

export type AllActions = setUrlAction;

export default function appReducer(app: AppContext, action: AllActions): AppContext {
    if (action.type == "set-url") {
        const payload: string = action.payload;
        return {
            ...app,
            inputUrl: payload
        }
    }

    if (action.type == "set-app-name") {
        const payload: string = action.payload;
        console.log("Doing set-app-name with arg: ", payload)
        return {
            ...app,
            appName: payload
        }
    }

    if (action.type == "set-app-type") {
        //@ts-expect-error
        const payload: SupportedSoftware = action.payload;
        return {
            ...app,
            appType: payload
        }

    }

    if (action.type == "set-api-data") {
        //@ts-expect-error
        const payloadFetched: DataFromOpenAPIUrl[] = action.payload;
        //@ts-expect-error
        const apiDataWithoutMetadata: SelectedApiData = payloadFetched.map(o => ({ ...o, frequency: null, range: null }))
        return {
            ...app,
            selectedApiData: apiDataWithoutMetadata
        }
    }

    if (action.type === "set-api-data-with-metadata") {
        //@ts-expect-error
        const payload: SelectedApiData = action.payload;
        return {
            ...app,
            selectedApiData: payload
        }
    }

    if (action.type == "add-page-with-layout") {
        console.log("Adding page with layout")
        //@ts-expect-error
        const payload: Page = action.payload;
        return {
            ...app,
            pages: [...app.pages, payload]
        }
    }

    return app;

    //for the rest of the functions
}
// function AppReducer(app:AppContext,action:)