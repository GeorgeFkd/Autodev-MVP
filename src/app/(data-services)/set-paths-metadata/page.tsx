"use client"
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { ApiData, Frequency as FrequencyVal } from '@/types/types';
import { Flex, chakra, Menu, MenuButton, MenuList, MenuItem, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import type { MetadataForData, TimeRange, Frequency } from '@/types/types';

const fromStringGetFreq = (freq: string | undefined) => {
    if (freq === undefined) return FrequencyVal.Hourly;
    if (freq === "Hourly") return FrequencyVal.Hourly;
    if (freq === "Daily") return FrequencyVal.Daily;
    if (freq === "Weekly") return FrequencyVal.Weekly;
    if (freq === "Monthly") return FrequencyVal.Monthly;
    if (freq === "Quarterly") return FrequencyVal.Quarterly;
    if (freq === "Yearly") return FrequencyVal.Yearly;
}

const fromFreqGetString = (freq: Frequency | undefined) => {
    switch (freq) {
        case FrequencyVal.Hourly: return "Hourly";
        case FrequencyVal.Daily: return "Daily";
        case FrequencyVal.Weekly: return "Weekly";
        case FrequencyVal.Monthly: return "Monthly";
        case FrequencyVal.Quarterly: return "Quarterly";
        case FrequencyVal.Yearly: return "Yearly";
        case undefined: return "Frequency";
    }
}

function SetPathsMetadataPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
    const toast = useToast();
    const router = useRouter();
    //to be able to handle both the time range and the frequency
    const [pathsMetadata, setPathsMetadata] = useState<MetadataForData[]>([]);
    const [frequencies, _] = useState<string[]>([]);
    if (!appState?.selectedApiData) {
        return "Something went wrong"
    }

    const handleMetadataChange = (index: number, metadata: Partial<MetadataForData>) => {
        //i could extract sth like this to a hook
        setPathsMetadata(prev => {
            const newArr = [...prev]
            newArr[index] = { ...newArr[index], ...metadata }
            return newArr;
        })
    }



    const addMetaDataToApi = () => {
        const updatedSelectedData = appState?.selectedApiData;
        pathsMetadata.forEach((metadata, index) => {
            updatedSelectedData[index] = { ...updatedSelectedData[index], ...metadata }
        })
        //@ts-expect-error
        dispatch({ type: "set-api-data", payload: updatedSelectedData })
        router.push("/connect-with-layouts")
        console.log("Updated data is: ", appState?.selectedApiData)

    }




    const handleSubmit = () => {
        if (!(pathsMetadata.length === appState?.selectedApiData?.length)) {
            console.log("Show popup to user")
            toast({
                title: "Validation Failed",
                description: "You havent submitted a frequency for each of the apis",
                status: "error",
                duration: 5000,
                isClosable: true
            })
        } else {
            toast({
                description: "Updating the frequency info was successful",
                status: "success",
                duration: 5000,
                isClosable: true
            })
            addMetaDataToApi()
            console.log("Everything is set go to next page")
        }
    }

    return (
        <Flex flexDir="column" w="100vw" h="100vh" rowGap={"1rem"} alignItems={"center"} paddingTop="1rem" px="2.5rem">
            {appState.selectedApiData.map((apiData, index) => {
                return <ApiPathComponent key={apiData.identification} data={apiData} handleChange={handleMetadataChange} labelFromTime="From Date" labelToTime='To Date' labelFrequency={fromFreqGetString(pathsMetadata[index]?.frequency)} index={index} />
            })}
            <Button w="35%" onClick={(e) => handleSubmit()}>Submit</Button>
        </Flex>
    )
}

interface EditApiPathProps {
    data: ApiData;
    handleChange: (index: number, metadata: Partial<MetadataForData>) => void;
    labelFrequency: string;
    labelToTime: string;
    labelFromTime: string;
    index: number;
}


const DEFAULT_TIME_RANGE: TimeRange = {
    from: new Date(),
    to: new Date()
}
function ApiPathComponent({ data, handleChange, labelFrequency, labelToTime, labelFromTime, index }: EditApiPathProps) {
    const [fromDate, setFromDate] = useState<string>(DEFAULT_TIME_RANGE.from.toDateString());
    const [toDate, setToDate] = useState<string>(DEFAULT_TIME_RANGE.to.toDateString());

    const setDates = () => {
        handleChange(index, { range: { from: new Date(fromDate), to: new Date(toDate) } })
    }


    //++ add Validation that the two dates are properly set
    //fromDate is before toDate
    const handleDateChange = (date: string, isFrom: boolean): void => {
        console.log("Changing Date to: ", date, isFrom)
        if (isFrom) {
            setFromDate(date)
        } else {
            setToDate(date)
        }
        setDates();
    }
    return <Flex py="0.5rem" px="1rem" w="100%" key={data.identification} columnGap={"1.5rem"} border="solid black 1px">
        <chakra.span fontWeight={"bold"}>Description: <chakra.span fontWeight={"initial"}>{data.description}</chakra.span></chakra.span>
        <chakra.span fontWeight={"bold"}>Id: <chakra.span fontWeight={"initial"}>{data.identification}</chakra.span></chakra.span>
        <Menu>

            <MenuButton as={Button}>
                {labelFrequency || "Frequency"}
            </MenuButton>
            <MenuList>
                {Object.keys(FrequencyVal).map(d => {
                    console.log("Option: ", d)
                    return <MenuItem key={d} onClick={(e) => handleChange(index, { frequency: fromStringGetFreq(d) })}>{d}</MenuItem>
                })}
            </MenuList>
        </Menu>
        <input type="date" value={fromDate} onChange={e => handleDateChange(e.target.value, true)} />
        <input type="date" value={toDate} onChange={e => handleDateChange(e.target.value, false)} />
    </Flex>
}

export default SetPathsMetadataPage