import { SupportedSoftware, type ApiData, type AppContext, type DataFromOpenAPIUrl, type GeneralWebsiteUrl, type Layout, type OpenAPIUrl, type Page, type SelectedApiData, AnalyticsDataType, MetadataForData, NFR_TYPE } from "@/types/types";
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


export const EMPTY_APP_CONTEXT: AppContext = { inputUrl: "some weird page", pages: [], selectedApiData: [], appName: "", appType: SupportedSoftware.NONE,nfr:{Performance:0,Maintainability:0,Reliability:0,Security:0} }

export type AllActions = setUrlAction;


interface ChangeMetadataInput {
    index:number,
    data:Partial<MetadataForData>
}


export default function appReducer(app: AppContext, action: AllActions): AppContext {
    if (action.type == "set-url") {
        const payload: string = action.payload;
        return {
            ...app,
            inputUrl: payload
        }
    }

    if (action.type == "set-non-functional-requirement") {
        //@ts-expect-error
        const payload:Partial<Record<NFR_TYPE,number>> = action.payload;
        return {
            ...app,
            nfr:{
                ...app.nfr,
                ...payload
            }
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
        const apiDataWithoutMetadata: SelectedApiData = payloadFetched.map(o => ({ ...o, range: { from: new Date(), to: new Date() }, frequency: "",analyticsDataType:AnalyticsDataType.NONE }))
        return {
            ...app,
            selectedApiData: apiDataWithoutMetadata
        }
    }

    if(action.type === "set-api-data-elem-with-metadata"){
        //@ts-expect-error
        const payload:ChangeMetadataInput = action.payload
        const updatedApiData = app.selectedApiData
        updatedApiData[payload.index] = {
            ...(updatedApiData[payload.index]),
            ...payload.data
        }

        return {
            ...app,
            selectedApiData:updatedApiData
        }
    }

    if (action.type === "set-api-data-with-metadata") {
        //@ts-expect-error
        const payload: ApiData[] = action.payload;
        return {
            ...app,
            selectedApiData: payload
        }
    }

    if (action.type === "set-api-data-analytics-types-ai") {
        //@ts-expect-error
        const payload: AnalyticsDataType[] = action.payload

        const newSelectedApiData = app.selectedApiData.map((d, index) => ({ ...d, analyticsDataType: payload[index] }))
        console.log("With analytics AI it is: ", newSelectedApiData)
        return {
            ...app,
            selectedApiData: newSelectedApiData
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