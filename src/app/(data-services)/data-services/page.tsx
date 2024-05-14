"use client"
import React, { useState } from 'react'
import { Input, Button, Box, Flex } from '@chakra-ui/react'
import { useGlobalState } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import { Header1, Header3 } from '@/components/Headers'
import { isUrlLike } from 'src/utils/utils'
const templateAreas = `
    "side" "input" "rest"
    "side" "input" "rest"
    "side" "submit" "rest"
    `

const templateRows = "1fr 1fr 1fr"
const templateColumns = "1fr 1fr 1fr"




const CREATE_DATA_SERVICE_URL = "create-data-service"
function DataServicesPage() {
    const { appState, dispatch } = useGlobalState();
    console.log(appState?.appName)
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
                <Header1 text={appState?.appName || ""} />
                <Header3 text={`Submit an OpenAPI Specification URL(json)`} />
                {/* <chakra.h1 fontSize={"1.6rem"} fontWeight={"bold"}>Submit an OpenAPI Specification URL(json)</chakra.h1> */}
                <Input variant="outline" type="url" value={urlInput} placeholder='Input OAS Url here' onChange={e => setUrlInput(e.target.value)} />
                <Button onClick={() => handleUrlSubmit(urlInput)}>Submit</Button>
                <Box>Url currently is: {appState?.inputUrl}</Box>
            </Flex>
        </Container>
    )
}

export default DataServicesPage