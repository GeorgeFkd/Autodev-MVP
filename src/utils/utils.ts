import { Frequency, AnalyticsDataType, MetadataForData } from "@/types/types";


export function downloadFile(val: Blob, filename: string) {
    const url = URL.createObjectURL(val);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

}

export function isUrlLike(url: string) {
    try {
        new URL(url)
    } catch (_) {
        return false;
    }
    return true;
}

export function fromStringGetFreq(freq: string | undefined): Frequency {
    if (freq === undefined) return Frequency.Hourly;
    if (freq === "Hourly") return Frequency.Hourly;
    if (freq === "Daily") return Frequency.Daily;
    if (freq === "Weekly") return Frequency.Weekly;
    if (freq === "Monthly") return Frequency.Monthly;
    if (freq === "Quarterly") return Frequency.Quarterly;
    if (freq === "Yearly") return Frequency.Yearly;
    return Frequency.Hourly;
}

export function fromFreqGetString(freq: Frequency | undefined): string {
    switch (freq) {
        case Frequency.Hourly: return "Hourly";
        case Frequency.Daily: return "Daily";
        case Frequency.Weekly: return "Weekly";
        case Frequency.Monthly: return "Monthly";
        case Frequency.Quarterly: return "Quarterly";
        case Frequency.Yearly: return "Yearly";
        case undefined: return "Frequency";
    }
}

export function fromAnalyticsDataTypeGetString(d: AnalyticsDataType) {
    console.log("AnalyticsDataType->String", d)
    if (d === AnalyticsDataType.HISTORICAL) return "Historical"
    if (d === AnalyticsDataType.REALTIME) return "Real time"
    return "Analytics Type"
}

export function fromStringGetAnalyticsDataType(data: string) {
    console.log("String->AnalyticsDataType", data)
    if (data === "HISTORICAL" || data === "Historical") return AnalyticsDataType.HISTORICAL
    if (data === "REALTIME" || data === "Real time") return AnalyticsDataType.REALTIME
    return AnalyticsDataType.NONE
}

//probably not the correct place to put this
export function defaultMetadataForDataSources(length: number):MetadataForData[] {
    return new Array(length).fill({ range: { from: Date(), to: Date() }, frequency: "",analyticsDataType:AnalyticsDataType.NONE })

}