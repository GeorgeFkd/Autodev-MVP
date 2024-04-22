"use client"
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { Button, Checkbox, Flex, VStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function ChoosePathsPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
    const [checkedVals, setCheckedVals] = useState<string[]>([]);
    const router = useRouter();
    const handleChecked = (id: string) => {
        if (checkedVals.includes(id)) {
            //remove it
            setCheckedVals(prev => prev.filter(i => i !== id))
        } else {
            setCheckedVals(prev => [...prev, id])
            //add it
        }
    }

    const handleSubmit = () => {
        console.log("Handling submit")
        const userSelectedPaths = appState?.selectedApiData.filter(apiPath => checkedVals.includes(apiPath.identification))
        //@ts-expect-error
        dispatch({ type: "set-api-data", payload: userSelectedPaths })
        router.push("/set-paths-metadata")
        //reroute him to the next page
    }


    if (appState?.selectedApiData === undefined || appState?.selectedApiData?.length === 0) {
        return "Something went wrong"
    }
    console.log("Checked Paths are: ", checkedVals)
    console.log("Paths are: ", appState.selectedApiData)
    return (
        <Flex w="100vw" h="100vh" rowGap="1rem" justifyContent={"center"} paddingTop="1rem" flexDir={"column"}>
            <chakra.h1 fontSize={"1.8rem"}>From the URL you provided you have access to the following functionalities:</chakra.h1>
            <VStack px="2.5rem" spacing={"1rem"}>
                {appState.selectedApiData.map(apiData => {
                    return <Flex py="0.5rem" px="1rem" w="100%" key={apiData.identification} columnGap={"1.5rem"} border="solid black 1px">
                        <chakra.span fontWeight={"bold"}>Description: <chakra.span fontWeight={"initial"}>{apiData.description}</chakra.span></chakra.span>
                        <chakra.span fontWeight={"bold"}>Id: <chakra.span fontWeight={"initial"}>{apiData.identification}</chakra.span></chakra.span>
                        <Checkbox colorScheme='green' onChange={(e) => handleChecked(apiData.identification)}>Include</Checkbox>
                    </Flex>
                })}
            </VStack>
            <Button size={"lg"} alignSelf={"center"} onClick={(e) => handleSubmit()}>Submit</Button>

        </Flex>
    )
}

export default ChoosePathsPage