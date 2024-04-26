
export type OpenAPIUrl = string;
export type GeneralWebsiteUrl = string;

export enum StatisticalGraphType {
    ScatterPlot = "Scatterplot",
    PieChart = "Piechart",
    BarGraph = "Bargraph",
    Histogram = "Histogram",

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

export interface ApiDataComponent {
    data: ApiData,
    componentName: string,
}
// let metadata: MetadataForData = { frequency: Frequency.Daily, range: { from: null, to: null } }
// let apiData: DataFromOpenAPIUrl = { description: "Fetches pets from the pet store", identification: "getPetsById" }
// let all: LabeledApiData = { data: { ...metadata, ...apiData }, label: "Hello World" }
// let myvar: AssociateComponentWithData =
//     { "component": all }
// console.log(Object.keys(StatisticalGraphType))


export interface Page {
    layout: Layout,
    associatedData: ApiDataComponent[],
    pageName: string
}

export interface AppContext {
    inputUrl: OpenAPIUrl | GeneralWebsiteUrl;
    selectedApiData: SelectedApiData;
    pages: Page[]

}


