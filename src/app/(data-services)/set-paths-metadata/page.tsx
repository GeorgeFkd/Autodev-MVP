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
    Input,
    IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Frequency, MetadataForData, TimeRange } from "@/types/types";
import { useGoHome } from "@/hooks/useGoHome";
import {
    formatDateForInputElem,
    fromAnalyticsDataTypeGetString,
    fromFreqGetString,
    fromStringGetAnalyticsDataType,
    fromStringGetFreq,
} from "src/utils/utils";
import { ArrowBackIcon, ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";

function generateRandomFreqVals(length: number | undefined): Frequency[] {
    if (length === undefined || length === null) return []
    const keysOfEnum = Object.values(FrequencyVal)
    const variantsNum = keysOfEnum.length;
    let randomArr = []
    for (let i = 0; i < variantsNum; i++) {
        const randomIndex = Math.floor(Math.random() * variantsNum);
        randomArr.push(randomIndex)
    }
    return randomArr.map(num => keysOfEnum[num])
}


function SetPathsMetadataPage() {
    useGoHome({
        condition: (state) =>
            !state.selectedApiData || state.selectedApiData.length === 0,
    });
    const { appState, dispatch } = useGlobalState();
    const toast = useToast();
    const router = useRouter();
    const [current, setCurrent] = useState(0)
    const currentApiData = appState?.selectedApiData[current]
    useEffect(() => {
        let ignore = false;
        window.addEventListener('keydown', handleArrowKeys);
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
                    const frequencies = generateRandomFreqVals(appState?.selectedApiData.length)
                    const updatedApiData = appState?.selectedApiData.map((data, index) => {
                        return { ...data, analyticsDataType: analyticsTypes[index], frequency: frequencies[index] }
                    })
                    //@ts-expect-error
                    dispatch({ type: "set-api-data-with-metadata", payload: updatedApiData })
                    toast({
                        position: "top-right",
                        title: "AI Generation",
                        description: "The pre-filled data was generated by AI",
                        duration: 3000,
                        status: "info"
                    })
                });
        }

        return () => {
            ignore = true;
            window.removeEventListener("keydown", handleArrowKeys)
        };
    }, []);
    if (!currentApiData) {
        return "Something went wrong"
    }
    console.log("Rendering with state: ", appState)

    const handleMetadataChange = (index: number, data: Partial<MetadataForData>) => {
        //@ts-expect-error
        dispatch({ type: "set-api-data-elem-with-metadata", payload: { index, data } })
    }

    const handleNext = () => {
        setCurrent(prev => (prev + 1) % appState.selectedApiData.length)
    }

    const handlePrev = () => {
        setCurrent(prev => {
            if (prev === 0) {
                return appState.selectedApiData.length - 1
            }
            return prev - 1
        })
    }

    const handleArrowKeys = (e: KeyboardEvent) => {
        console.log("The event is: ", e)

        if (!(e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "a" || e.key === "d")) {
            e.preventDefault()
            return;
        }

        if (e.key === "ArrowRight" || e.key === "d") {
            e.preventDefault();
            handleNext()

        } else if (e.key === "ArrowLeft" || e.key === "a") {
            e.preventDefault();
            handlePrev()
        }
    }

    const handleSubmit = () => {
        console.log("State before submitting", appState?.selectedApiData)
        if (!appState?.selectedApiData?.length) {
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
                description: "Updating the Metadata for the Data Sources was successful",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            router.push("connect-with-layouts")
            console.log("Everything is set go to next page");
        }
    };

    return (
        <Flex mt="1rem" alignItems={"center"} flexDir={"row"} justifyContent={"space-between"}>
            <Flex p="1.5rem" w="18rem" h="100vh" flexDir={"column"} justifyItems={"center"} alignItems={"center"}>
                <chakra.span>Available Data:</chakra.span>
                <Flex flexDir={"column"} >
                    {appState?.selectedApiData.map((apiData, index) => {
                        return (
                            <Flex key={apiData.identification} cursor={"pointer"} onClick={(e) => setCurrent(index)} bgColor={index === current ? "green" : "initial"} justifyContent={"center"} alignItems={"center"} h="8rem" w="100%" borderBottom={index === appState.selectedApiData.length - 1 ? "" : "solid 2px black"} borderLeft="solid 3px black">
                                <chakra.span fontWeight={"bold"} textAlign={"center"} >
                                    {apiData.description}
                                </chakra.span>
                                {/* TODO: Add a check mark for whichever has been filled */}
                            </Flex>
                        );
                    })}
                </Flex>
            </Flex>
            <Flex
                flexDir="column"
                w="100vw"
                h="100vh"
                rowGap={"1rem"}
                alignItems={"center"}
                paddingTop="1rem"
                px="2.5rem"
            >
                {/* {appState?.selectedApiData.map((apiData, index) => {
                return ( */}
                <ApiPathComponent
                    key={currentApiData.identification}
                    data={currentApiData}
                    handleChange={handleMetadataChange}
                    labelFromTime="From Date"
                    labelToTime="To Date"
                    labelFrequency={fromFreqGetString(currentApiData.frequency)}
                    labelAnalyticsType={fromAnalyticsDataTypeGetString(currentApiData.analyticsDataType)}
                    index={current}
                />
                <Flex w="32rem" justifyContent={"space-between"}>
                    <Button aria-label="previous" leftIcon={<ArrowBackIcon />} onClick={() => setCurrent(prev => {
                        if (prev === 0) {
                            return appState.selectedApiData.length - 1
                        }
                        return prev - 1
                        // return (current - 1)%appState.selectedApiData.length

                    })}>Previous</Button>
                    <Button aria-label="next" rightIcon={<ArrowForwardIcon />} onClick={() => setCurrent(prev => (prev + 1) % appState.selectedApiData.length)}>Next</Button>
                </Flex>


                {/* );
            })} */}
                <Button w="35%" onClick={(e) => handleSubmit()}>
                    Submit
                </Button>
            </Flex>
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
}: EditApiPathProps) {

    console.log("For the api path component:", data, labelAnalyticsType);
    //++ add Validation that the two dates are properly set
    //fromDate is before toDate
    const handleDateChange = (date: string, isFrom: boolean): void => {
        console.log("Changing Date to: ", date, isFrom);
        if (isFrom) {
            handleChange(index, {
                //@ts-expect-error
                range: { to: data.range?.to, from: new Date(date) }
            })
        } else {
            handleChange(index, {
                //@ts-expect-error
                range: { to: new Date(date), from: data.range?.from }
            })
        }

    };
    return (
        <Flex
            borderRadius={"1rem"}
            boxShadow={"dark-lg"}
            py="0.5rem"
            px="1rem"
            w="35rem"
            h="35rem"
            key={data.identification}
            rowGap={"1.5rem"}
            p="1.5rem"
            flexDirection={"column"}
            justifyContent={"space-around"}
            border="solid black 1px"
        >
            <chakra.span alignSelf={"center"} fontSize={"1.3rem"} fontWeight={"bold"}>{data.description}</chakra.span>
            {/* <chakra.span fontWeight={"bold"}>
                Id:{" "}
                <chakra.span fontWeight={"initial"}>{data.identification}</chakra.span>
            </chakra.span> */}
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
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <chakra.label fontWeight="bold" alignSelf={"center"}>From Date: </chakra.label>
                <Input w="18rem" type="date" value={formatDateForInputElem(data.range?.from)} onChange={(e) => handleDateChange(e.target.value, true)} />
                {/* <input
                    type="date"
                    value={formatDateForInputElem(data.range?.from)}
                    onChange={(e) => handleDateChange(e.target.value, true)}
                /> */}
            </Flex>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <chakra.label fontWeight="bold" alignSelf={"center"}>To Date: </chakra.label>
                <Input w="18rem" type="date" value={formatDateForInputElem(data.range?.to)} onChange={(e) => handleDateChange(e.target.value, false)} />
            </Flex>
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

            {/* analyticsTypesWereGeneratedByAI && "<- Generated By AI" */}
        </Flex>
    );
}

export default SetPathsMetadataPage;
