"use client"
import { useGlobalState } from '@/contexts/AppContext'
import { ApiData, Frequency as FrequencyVal } from '@/types/types';
import { Flex, chakra, Menu, MenuButton, MenuList, MenuItem, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import type { MetadataForData, TimeRange } from '@/types/types';
import { useGoHome } from '@/hooks/useGoHome';
import { defaultMetadataForDataSources, fromFreqGetString, fromStringGetFreq } from 'src/utils/utils';
import useArrayData from '@/hooks/useArrayData';




function SetPathsMetadataPage() {
    const { appState, dispatch } = useGlobalState();
    useGoHome({ condition: (state) => (!state.selectedApiData || state.selectedApiData.length === 0) })

    const toast = useToast();
    const router = useRouter();

    const initialData: MetadataForData[] = defaultMetadataForDataSources(appState?.selectedApiData.length || 0)
    const { editElementAt: handleMetadataChange, data: pathsMetadata } = useArrayData<MetadataForData>({ initialData: initialData });

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

    const addMetaDataToApi = () => {
        const updatedSelectedData: ApiData[] = appState?.selectedApiData!;
        console.log("Paths Metadata: ", pathsMetadata)
        pathsMetadata.forEach((metadata, index) => {
            updatedSelectedData[index] = { ...updatedSelectedData[index], ...metadata }
        })
        //@ts-expect-error
        dispatch({ type: "set-api-data-with-metadata", payload: updatedSelectedData })
        router.push("/connect-with-layouts")
        console.log("Updated data is: ", appState?.selectedApiData)
    }

    return (
        <Flex flexDir="column" w="100vw" h="100vh" rowGap={"1rem"} alignItems={"center"} paddingTop="1rem" px="2.5rem">
            {appState?.selectedApiData.map((apiData, index) => {
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

            <MenuButton data-test-id="frequency-menu" as={Button}>
                {labelFrequency || "Frequency"}
            </MenuButton>
            <MenuList>
                {Object.keys(FrequencyVal).map(d => {
                    console.log("Option: ", d)
                    return <MenuItem data-test-id={`frequency-${d}`} key={d} onClick={(e) => handleChange(index, { frequency: fromStringGetFreq(d) })}>{d}</MenuItem>
                })}
            </MenuList>
        </Menu>
        {/* use the labels provided */}
        <input type="date" value={fromDate} onChange={e => handleDateChange(e.target.value, true)} />
        <input type="date" value={toDate} onChange={e => handleDateChange(e.target.value, false)} />
    </Flex>
}

export default SetPathsMetadataPage