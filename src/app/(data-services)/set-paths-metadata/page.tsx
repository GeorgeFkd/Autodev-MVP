"use client"
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { ApiData, Frequency } from '@/types/types';
import { Flex, chakra, Menu, MenuButton, MenuList, MenuItem, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function SetPathsMetadataPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
    const toast = useToast();
    const router = useRouter();
    const [frequencies, setFrequencies] = useState<string[]>([]);
    if (!appState?.selectedApiData) {
        return "Something went wrong"
    }

    const handleFrequencySet = (index: number, frequency: string) => {
        console.log("Setting frequency for: ", appState?.selectedApiData[index].description, "to: ", frequency)
        setFrequencies(prev => {
            //copy is necessary
            const newArr = [...prev]
            newArr[index] = frequency
            return newArr;
        })
    }

    const updateFrequenciesOfApi = (newFreqs: string[]) => {
        const updatedSelectedData = appState?.selectedApiData;
        frequencies.forEach((val, index) => {
            updatedSelectedData[index].frequency = fromStringGetFreq(val)
        })
        //@ts-expect-error
        dispatch({ type: "set-api-data", payload: updatedSelectedData })
        router.push("/connect-with-layouts")
        console.log("Updated data is: ", appState?.selectedApiData)

    }

    const fromStringGetFreq = (freq: string) => {
        if (freq === "Hourly") return Frequency.Hourly;
        if (freq === "Daily") return Frequency.Daily;
        if (freq === "Weekly") return Frequency.Weekly;
        if (freq === "Monthly") return Frequency.Monthly;
        if (freq === "Quarterly") return Frequency.Quarterly;
        if (freq === "Yearly") return Frequency.Yearly;
    }


    const handleSubmit = () => {
        if (!(frequencies.length === appState?.selectedApiData?.length)) {
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
                description: "Updating the frequency info was successfull",
                status: "success",
                duration: 5000,
                isClosable: true
            })
            updateFrequenciesOfApi(frequencies)
            console.log("Everything is set go to next page")
        }
    }

    return (
        <Flex flexDir="column" w="100vw" h="100vh" rowGap={"1rem"} alignItems={"center"} paddingTop="1rem" px="2.5rem">
            {appState.selectedApiData.map((apiData, index) => {
                return <ApiPathComponent key={apiData.identification} data={apiData} handleChange={handleFrequencySet} label={frequencies[index]} index={index} />
            })}
            <Button w="35%" onClick={(e) => handleSubmit()}>Submit</Button>
        </Flex>
    )
}

interface EditApiPathProps {
    data: ApiData;
    handleChange: (index: number, frequency: string) => void;
    label: string;
    index: number;
}

function ApiPathComponent({ data, handleChange, label, index }: EditApiPathProps) {
    return <Flex py="0.5rem" px="1rem" w="100%" key={data.identification} columnGap={"1.5rem"} border="solid black 1px">
        <chakra.span fontWeight={"bold"}>Description: <chakra.span fontWeight={"initial"}>{data.description}</chakra.span></chakra.span>
        <chakra.span fontWeight={"bold"}>Id: <chakra.span fontWeight={"initial"}>{data.identification}</chakra.span></chakra.span>
        <Menu>

            <MenuButton as={Button}>
                {label || "Frequency"}
            </MenuButton>
            <MenuList>
                {Object.keys(Frequency).map(d => {
                    console.log("Option: ", d)
                    return <MenuItem key={d} onClick={(e) => handleChange(index, d)}>{d}</MenuItem>
                })}
            </MenuList>
        </Menu>
    </Flex>
}

export default SetPathsMetadataPage