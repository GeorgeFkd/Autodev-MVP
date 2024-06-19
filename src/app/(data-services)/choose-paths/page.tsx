"use client"
import Container from '@/components/Container';
import { Header3 } from '@/components/Headers';
import { useGlobalState } from '@/contexts/AppContext'
import { ApiData } from '@/types/types';
import { Box, Button, Checkbox, Flex, Grid, GridItem, chakra, useToast } from '@chakra-ui/react';
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


function ChoosePathsPage() {
    const { appState, dispatch } = useGlobalState();
    const toast = useToast()
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

    useEffect(() => {
        toast({
            title: "Support Message",
            description: "You can click on the functionalities you want to include",
            status: "info",
            duration: 5000,
            isClosable: true,
        })
    }, [])


    if (appState?.selectedApiData === undefined || appState?.selectedApiData?.length === 0) {
        return "Something went wrong"
    }
    return (
        <Container>
            <Header3 text="From the URL you provided you have access to the following functionalities:" />
            <SelectOpenAPIPathsList data={appState.selectedApiData} checkedVals={checkedVals} handleChecked={handleChecked} />
            <Button size={"lg"} alignSelf={"center"} onClick={(e) => handleSubmit()}>Submit</Button>

        </Container>
    )
}

interface SelectOpenAPIPathsListProps {
    data: ApiData[],
    handleChecked: (id: string) => void
    checkedVals: string[]
}

function SelectOpenAPIPathsList({ data, handleChecked, checkedVals }: SelectOpenAPIPathsListProps) {
    return (
        <Grid templateColumns={"1fr 1fr 1fr 1fr"} gridGap={"1.25rem"} >
            {data.map(apiData => {
                return (<GridItem key={apiData.identification} ><PathCheckbox data={apiData} handleChecked={handleChecked} isChecked={checkedVals.includes(apiData.identification)} /></GridItem>)
            })}
        </Grid>
    )
}

interface PathCheckboxProps {
    data: ApiData,
    handleChecked: (id: string) => void
    isChecked: boolean
}

function PathCheckbox({ data, handleChecked, isChecked }: PathCheckboxProps) {
    return (
        <Box whileHover={{ scale: 1.075 }} as={motion.div} cursor={"pointer"} boxShadow={`${!isChecked ? "":"6px 6px 1px"}`} borderRadius={"0.75rem"} w="20rem" h="12rem" onClick={(e) => handleChecked(data.identification)} py="0.5rem" px="1rem" key={data.identification} border={`solid ${isChecked ? "green 4px" : "black 1px"}`}>
            <Flex w="100%" h="100%" columnGap={"1.5rem"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                <chakra.span fontSize={"1.2rem"} fontWeight={"initial"}>{data.description}</chakra.span>
                {/* <chakra.span fontWeight={"bold"}>Id: <chakra.span fontWeight={"initial"}>{data.identification}</chakra.span></chakra.span> */}
                {/* <Checkbox colorScheme='green' onChange={(e) => handleChecked(data.identification)}>Include</Checkbox> */}
            </Flex>
        </Box>
    )
}

export default ChoosePathsPage