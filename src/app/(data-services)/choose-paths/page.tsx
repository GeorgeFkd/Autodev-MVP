"use client"
import Container from '@/components/Container';
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { Button, Checkbox, Flex, VStack, chakra, Grid } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function ChoosePathsPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
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
    console.log("Checked Paths are: ", checkedVals)
    console.log("Paths are: ", appState.selectedApiData)
    return (
        <Container>
            <chakra.h1 fontSize={"1.8rem"}>From the URL you provided you have access to the following functionalities:</chakra.h1>
            <Flex px="2.5rem" rowGap={"1rem"} flexDir={"column"}>
                {appState.selectedApiData.map(apiData => {
                    return <Flex py="0.5rem" px="1rem" w="100%" key={apiData.identification} columnGap={"1.5rem"} border="solid black 1px">
                        <chakra.span fontWeight={"bold"}>Description: <chakra.span fontWeight={"initial"}>{apiData.description}</chakra.span></chakra.span>
                        <chakra.span fontWeight={"bold"}>Id: <chakra.span fontWeight={"initial"}>{apiData.identification}</chakra.span></chakra.span>
                        <Checkbox colorScheme='green' onChange={(e) => handleChecked(apiData.identification)}>Include</Checkbox>
                    </Flex>
                })}
            </Flex>
            <Button size={"lg"} alignSelf={"center"} onClick={(e) => handleSubmit()}>Submit</Button>

        </Container>
    )
}

export default ChoosePathsPage