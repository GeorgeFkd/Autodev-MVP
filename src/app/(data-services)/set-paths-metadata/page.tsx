"use client";
import { useGlobalState } from "@/contexts/AppContext";
import {
    ApiData,
    Frequency as FrequencyVal,
    AnalyticsDataType as AnalyticsDataTypeVal,
} from "@/types/types";
import {
    Flex,
    chakra,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { MetadataForData, TimeRange } from "@/types/types";
import { useGoHome } from "@/hooks/useGoHome";
import {
    defaultMetadataForDataSources,
    fromAnalyticsDataTypeGetString,
    fromFreqGetString,
    fromStringGetAnalyticsDataType,
    fromStringGetFreq,
} from "src/utils/utils";
import useArrayData from "@/hooks/useArrayData";
import { ChevronDownIcon } from "@chakra-ui/icons";

function SetPathsMetadataPage() {
    useGoHome({
        condition: (state) =>
            !state.selectedApiData || state.selectedApiData.length === 0,
    });
    const { appState, dispatch } = useGlobalState();
    const [aiAnalyticsSuggestions, setAiAnalyticsSuggestions] = useState<
        AnalyticsDataTypeVal[]
    >([]);


    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            const body = JSON.stringify({
                descriptions: appState?.selectedApiData.map((f) => f.description),
            });
            fetch("/api/generate-analytics-types", {
                method: "POST",
                body,
            })
                .then((res) => {
                    console.log("The response was: ", res);
                    return res.json() as Promise<boolean[]>;
                })
                .then((data) => {
                    console.log("The data is: ", data);
                    const analyticsTypes = data.map((d) => {
                        if (d) {
                            return AnalyticsDataTypeVal.REALTIME;
                        } else {
                            return AnalyticsDataTypeVal.HISTORICAL;
                        }
                    });
                    setData(prev => {
                        return prev.map((data, index) => {
                            return { ...data, analyticsDataType: analyticsTypes[index] }
                        })
                    })
                    setAiAnalyticsSuggestions(analyticsTypes);

                    addMetaDataToApi(false)

                    // dispatch({ type: "set-api-data-with-metadata", payload: updatedSelectedData, });
                    // dispatch({ type: "set-api-data-analytics-types-ai", payload: analyticsTypes })
                    // console.log("App state actually is: ", appState?.selectedApiData);
                });
        }

        return () => {
            ignore = false;
        };
    }, []);
    const toast = useToast();
    const router = useRouter();

    const initialData: MetadataForData[] = defaultMetadataForDataSources(
        appState?.selectedApiData.length || 0
    );
    const {
        editElementAt: handleMetadataChange,
        data: pathsMetadata,
        setData,
    } = useArrayData<MetadataForData>({ initialData: initialData });

    const handleSubmit = () => {
        if (!(pathsMetadata.length === appState?.selectedApiData?.length)) {
            console.log("Show popup to user");
            toast({
                title: "Validation Failed",
                description: "You havent submitted a frequency for each of the apis",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                description: "Updating the frequency info was successful",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            addMetaDataToApi(true);
            console.log("Everything is set go to next page");
        }
    };

    const addMetaDataToApi = (shouldReroute: boolean) => {
        const updatedSelectedData: ApiData[] = appState?.selectedApiData!;
        console.log("Paths Metadata: ", pathsMetadata);
        pathsMetadata.forEach((metadata, index) => {
            updatedSelectedData[index] = {
                ...updatedSelectedData[index],
                ...metadata,
            };
        });
        //@ts-expect-error
        dispatch({
            type: "set-api-data-with-metadata",
            payload: updatedSelectedData,
        });
        console.log("Updated data is: ", appState?.selectedApiData);

        if (shouldReroute) {
            router.push("/connect-with-layouts");
        }

    };

    return (
        <Flex
            flexDir="column"
            w="100vw"
            h="100vh"
            rowGap={"1rem"}
            alignItems={"center"}
            paddingTop="1rem"
            px="2.5rem"
        >
            {appState?.selectedApiData.map((apiData, index) => {
                return (
                    <ApiPathComponent
                        analyticsTypesWereGeneratedByAI={
                            !(aiAnalyticsSuggestions.length === 0)
                        }
                        key={apiData.identification}
                        data={apiData}
                        handleChange={handleMetadataChange}
                        labelFromTime="From Date"
                        labelToTime="To Date"
                        labelFrequency={fromFreqGetString(pathsMetadata[index]?.frequency)}
                        labelAnalyticsType={fromAnalyticsDataTypeGetString(
                            apiData.analyticsDataType === AnalyticsDataTypeVal.NONE ? aiAnalyticsSuggestions[index] : pathsMetadata[index]?.analyticsDataType
                        )}
                        index={index}
                    />
                );
            })}
            <Button w="35%" onClick={(e) => handleSubmit()}>
                Submit
            </Button>
        </Flex>
    );
}

interface EditApiPathProps {
    data: ApiData;
    handleChange: (index: number, metadata: Partial<MetadataForData>) => void;
    labelFrequency: string;
    labelToTime: string;
    labelFromTime: string;
    labelAnalyticsType: string;
    index: number;
    analyticsTypesWereGeneratedByAI: boolean;
}

const DEFAULT_TIME_RANGE: TimeRange = {
    from: new Date(),
    to: new Date(),
};
function ApiPathComponent({
    data,
    handleChange,
    labelFrequency,
    labelToTime,
    labelFromTime,
    index,
    labelAnalyticsType,
    analyticsTypesWereGeneratedByAI,
}: EditApiPathProps) {
    const [fromDate, setFromDate] = useState<string>(
        DEFAULT_TIME_RANGE.from.toDateString()
    );
    const [toDate, setToDate] = useState<string>(
        DEFAULT_TIME_RANGE.to.toDateString()
    );
    const setDates = () => {
        handleChange(index, {
            range: { from: new Date(fromDate), to: new Date(toDate) },
        });
    };

    console.log("For the api path component:", data, labelAnalyticsType);
    //++ add Validation that the two dates are properly set
    //fromDate is before toDate
    const handleDateChange = (date: string, isFrom: boolean): void => {
        console.log("Changing Date to: ", date, isFrom);
        if (isFrom) {
            setFromDate(date);
        } else {
            setToDate(date);
        }
        setDates();
    };
    return (
        <Flex
            py="0.5rem"
            px="1rem"
            w="100%"
            key={data.identification}
            columnGap={"1.5rem"}
            border="solid black 1px"
        >
            <chakra.span fontWeight={"bold"}>
                Description:{" "}
                <chakra.span fontWeight={"initial"}>{data.description}</chakra.span>
            </chakra.span>
            <chakra.span fontWeight={"bold"}>
                Id:{" "}
                <chakra.span fontWeight={"initial"}>{data.identification}</chakra.span>
            </chakra.span>
            <Menu>
                <MenuButton
                    data-test-id="frequency-menu"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                >
                    {labelFrequency || "Frequency"}
                </MenuButton>
                <MenuList>
                    {Object.keys(FrequencyVal).map((d) => {
                        return (
                            <MenuItem
                                data-test-id={`frequency-${d}`}
                                key={d}
                                onClick={(e) =>
                                    handleChange(index, { frequency: fromStringGetFreq(d) })
                                }
                            >
                                {d}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
            {/* use the labels provided */}
            <input
                type="date"
                value={fromDate}
                onChange={(e) => handleDateChange(e.target.value, true)}
            />
            <input
                type="date"
                value={toDate}
                onChange={(e) => handleDateChange(e.target.value, false)}
            />
            <Menu>
                <MenuButton
                    data-test-id="frequency-menu"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                >
                    {labelAnalyticsType || "Analytics Type"}
                </MenuButton>
                <MenuList>
                    {Object.keys(AnalyticsDataTypeVal).map((d) => {
                        return (
                            <MenuItem
                                data-test-id={`analytics-type-${d}`}
                                key={d}
                                onClick={(e) =>
                                    handleChange(index, {
                                        analyticsDataType: fromStringGetAnalyticsDataType(d),
                                    })
                                }
                            >
                                {d}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
            {analyticsTypesWereGeneratedByAI && "<- Generated By AI"}
        </Flex>
    );
}

export default SetPathsMetadataPage;
