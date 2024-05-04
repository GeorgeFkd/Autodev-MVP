"use client"
import Container from '@/components/Container';
import { Header3 } from '@/components/Headers';
import { useGlobalState } from '@/contexts/AppContext'
import { ApiData } from '@/types/types';
import { Button, Checkbox, Flex, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function ChoosePathsPage() {
    const { appState, dispatch } = useGlobalState();
    const [checkedVals, setCheckedVals] = useState<string[]>([]);
    const router = useRouter();
    const handleChecked = (id: string) => {
        if (checkedVals.includes(id)) {
            setCheckedVals(prev => prev.filter(i => i !== id))
            return;
        }
        setCheckedVals(prev => [...prev, id])
    }

    const handleSubmit = () => {
        console.log("Handling submit")
        const userSelectedPaths = appState?.selectedApiData.filter(apiPath => checkedVals.includes(apiPath.identification))
        //@ts-expect-error
        dispatch({ type: "set-api-data", payload: userSelectedPaths })
        router.push("/set-paths-metadata")
    }


    if (appState?.selectedApiData === undefined || appState?.selectedApiData?.length === 0) {
        return "Something went wrong"
    }
    return (
        <Container>
            <Header3 text="From the URL you provided you have access to the following functionalities:" />
            <SelectOpenAPIPathsList data={appState.selectedApiData} handleChecked={handleChecked} />
            <Button size={"lg"} alignSelf={"center"} onClick={(e) => handleSubmit()}>Submit</Button>

        </Container>
    )
}

interface SelectOpenAPIPathsListProps {
    data: ApiData[],
    handleChecked: (id: string) => void
}

function SelectOpenAPIPathsList({ data, handleChecked }: SelectOpenAPIPathsListProps) {
    return (
        <Flex px="2.5rem" rowGap={"1rem"} flexDir={"column"}>
            {data.map(apiData => {
                return (<PathCheckbox key={apiData.identification} data={apiData} handleChecked={handleChecked} />)
            })}
        </Flex>
    )
}

interface PathCheckboxProps {
    data: ApiData,
    handleChecked: (id: string) => void
}

function PathCheckbox({ data, handleChecked }: PathCheckboxProps) {
    return (
        <Flex py="0.5rem" px="1rem" w="100%" key={data.identification} columnGap={"1.5rem"} border="solid black 1px">
            <chakra.span fontWeight={"bold"}>Description: <chakra.span fontWeight={"initial"}>{data.description}</chakra.span></chakra.span>
            <chakra.span fontWeight={"bold"}>Id: <chakra.span fontWeight={"initial"}>{data.identification}</chakra.span></chakra.span>
            <Checkbox colorScheme='green' onChange={(e) => handleChecked(data.identification)}>Include</Checkbox>
        </Flex>
    )
}

export default ChoosePathsPage