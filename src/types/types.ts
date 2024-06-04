
export type OpenAPIUrl = string;
export type GeneralWebsiteUrl = string;

export enum StatisticalGraphType {
    ScatterPlot = "Scatterplot",
    PieChart = "Piechart",
    BarGraph = "Bargraph",
    LineGraph = "Linegraph",

}

export interface DataFromOpenAPIUrl {
    // need to find a way to have a unique identifier to be used to locate in the file the thing i need
    identification: string;
    description: string;
}

export enum Frequency {
    Hourly = "hourly",
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
    Quarterly = "quarterly",
    Yearly = "yearly",
}


export interface TimeRange {
    from: Date
    to: Date
}

export interface MetadataForData {
    frequency?: Frequency
    range?: TimeRange
    graph?: StatisticalGraphType
    analyticsDataType: AnalyticsDataType
}
export type ApiData = (DataFromOpenAPIUrl & MetadataForData)
export type SelectedApiData = ApiData[]

export type GridTemplateColumns = string;
export type GridTemplateRows = string;
export type GridTemplateAreas = string[];
export type ComponentsInGrid = string[];

export interface Layout {
    columns: GridTemplateColumns;
    rows: GridTemplateRows;
    areas: GridTemplateAreas;
    //can be produced by the areas above by getting the unique items
    components: ComponentsInGrid;
}

export interface ComponentInLayout {
    componentName: string;
    row: number;
    column: number;
    //pixels
    sizeX: number;
    sizeY: number;
}

export interface ApiDataComponent {
    data: ApiData,
    component: ComponentInLayout,
}



export interface Page {
    layout: Layout,
    associatedData: ApiDataComponent[],
    pageName: string
}

export enum SupportedSoftware {
    E_COMMERCE = "E-Commerce",
    DATA_SERVICES = "Data Services",
    NONE = "No Type",
    WEB_BLOG = "Blog",
    CLIENTELE_MANAGEMENT = "Clients Management System",
    BUSINESS_PROCESS = "Process Automation"
}

export interface AppContext {
    inputUrl: OpenAPIUrl | GeneralWebsiteUrl;
    selectedApiData: SelectedApiData;
    pages: Page[];
    appName: string;
    appType: SupportedSoftware
}

export enum AnalyticsDataType {
    REALTIME = "Real time",
    HISTORICAL = "Historical",
    NONE="Analytics Data Type"
}

export enum OASValidationResult {
    Success,
    Failure, Loading
}

export type CodegenInput = {
    openAPIUrl: string,
    language: string,
    options: {},
    spec: {},
}


export type CodegenResult = {
    link: string,
    code: string
}


