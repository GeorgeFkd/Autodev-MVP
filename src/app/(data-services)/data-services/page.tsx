"use client"
import React, { useState } from 'react'
import { chakra, Grid, GridItem, Input, Button, VStack, Box, Flex } from '@chakra-ui/react'
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
const templateAreas = `
    "side" "input" "rest"
    "side" "input" "rest"
    "side" "submit" "rest"
    `

const templateRows = "1fr 1fr 1fr"
const templateColumns = "1fr 1fr 1fr"

function isUrlLike(url: string) {
    try {
        new URL(url)
    } catch (_) {
        return false;
    }
    return true;
}


const CREATE_DATA_SERVICE_URL = "create-data-service"
function DataServicesPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
    const router = useRouter();
    const [urlInput, setUrlInput] = useState("https://www1.aade.gr/aadeapps3/posApi/rest/openapi.json")
    function handleUrlSubmit(userInp: string) {
        //check if it is actually a URL
        if (!isUrlLike(userInp)) { return; }
        console.log("Submitting URL: ", userInp)
        //@ts-expect-error
        dispatch({ type: "set-url", payload: userInp })
        //go to another page
        router.push(CREATE_DATA_SERVICE_URL)
        console.log("Current state is: ", appState?.inputUrl)
    }
    //https://www1.aade.gr/aadeapps3/posApi/rest/openapi.json
    return (
        <Container>
            <Flex flexDir="column" rowGap="2.5rem">
                <chakra.h1 fontSize={"1.6rem"} fontWeight={"bold"}>Submit an OpenAPI Specification URL(json)</chakra.h1>
                <Input variant="outline" type="url" value={urlInput} placeholder='Input OAS Url here' onChange={e => setUrlInput(e.target.value)} />
                <Button onClick={() => handleUrlSubmit(urlInput)}>Submit</Button>
                <Box>Url currently is: {appState?.inputUrl}</Box>
            </Flex>
        </Container>
    )
}

export default DataServicesPage