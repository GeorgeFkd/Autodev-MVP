"use client"
import React, { useState } from 'react'
import { Grid, GridItem, Input, Button, VStack, Box } from '@chakra-ui/react'
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
const templateAreas = `
    "side" "input" "rest"
    "side" "input" "rest"
    "side" "submit" "rest"
    `

const templateRows = "1fr 1fr 1fr"
const templateColumns = "1fr 1fr 1fr"
function DataServicesPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
    const router = useRouter();
    const [urlInput, setUrlInput] = useState("https://www1.aade.gr/aadeapps3/posApi/rest/openapi.json")
    function handleUrlSubmit(userInp: string) {
        //check if it is actually a URL
        let url;
        try {
            url = new URL(userInp)
        } catch (_) {
            console.log("User gave an invalid url")
            return;
        }
        console.log("Submitting URL: ", userInp)
        dispatch({ type: "set-url", payload: userInp })
        //go to another page
        router.push("create-data-service")
        console.log("Current state is: ", appState?.inputUrl)
    }


    //templateAreas={templateAreas} templateRows={templateRows} templateColumns={templateColumns}
    //https://www1.aade.gr/aadeapps3/posApi/rest/openapi.json
    return (
        <Grid w={"100vw"} placeItems={"center"} h="100vh" >
            <VStack>
                <GridItem>
                    <Input variant="outline" type="url" value={urlInput} placeholder='Input OAS Url here' onChange={e => setUrlInput(e.target.value)} />
                </GridItem>
                <GridItem>
                    <Button onClick={() => handleUrlSubmit(urlInput)}>Submit</Button>
                </GridItem>
                <GridItem>
                    <Box>Url is: {appState?.inputUrl}</Box>
                </GridItem>
            </VStack>


        </Grid>

    )
}

export default DataServicesPage