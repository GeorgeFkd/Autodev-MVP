"use client"
import React, { useState } from 'react'
import { Input, Button, Box, Flex } from '@chakra-ui/react'
import { useGlobalState } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import { Header1, Header3 } from '@/components/Headers'
import { isUrlLike } from 'src/utils/utils'
import { OASValidationResult } from '@/types/types'
import { TextMD, TextSM } from '@/components/Text'
const templateAreas = `
    "side" "input" "rest"
    "side" "input" "rest"
    "side" "submit" "rest"
    `

const templateRows = "1fr 1fr 1fr"
const templateColumns = "1fr 1fr 1fr"




function DataServicesPage() {
    const { appState, dispatch } = useGlobalState();
    const [loading, setIsLoading] = useState(false)
    const [validationState, setValidationState] = useState(OASValidationResult.Loading);
    console.log(appState?.appName)
    const router = useRouter();
    const [urlInput, setUrlInput] = useState("https://api.ember-climate.org/openapi.json")
    function handleSubmit(userInp: string) {
        if (!isUrlLike(userInp)) { return; }
        console.log("Submitting URL: ", userInp)
        //@ts-expect-error
        dispatch({ type: "set-url", payload: userInp })
        verifyOpenAPIUrl(userInp);
    }

    const verifyOpenAPIUrl = (inputUrl: string | undefined) => {
        if (!inputUrl) return;
        console.log("Submitting to API: " + inputUrl)
        setIsLoading(true);
        fetch("/api/fetch-file", { method: "POST", body: inputUrl })
            .then((val) => {
                console.log("Returned Successfully: ")
                return val.json()
            }).then(val => {
                console.log("Object val: ", val);
                setIsLoading(false)
                //@ts-expect-error
                dispatch({ type: "set-api-data", payload: val })
                router.push("/choose-paths")
                setValidationState(OASValidationResult.Success)
            })
            .catch(err => {
                console.log("Threw error: ", err)
                setValidationState(OASValidationResult.Failure)
            })
    }
    //https://www1.aade.gr/aadeapps3/posApi/rest/openapi.json
    return (
        <Container>
            <Flex flexDir="column" rowGap="2.5rem">
                <Header1 text={appState?.appName || ""} />
                <Header3 text={`Submit an OpenAPI Specification URL(json)`} />
                {/* <chakra.h1 fontSize={"1.6rem"} fontWeight={"bold"}>Submit an OpenAPI Specification URL(json)</chakra.h1> */}
                <Input variant="outline" type="url" value={urlInput} placeholder='Input OAS Url here' onChange={e => setUrlInput(e.target.value)} />
                <Button onClick={() => handleSubmit(urlInput)} isLoading={loading}>Submit</Button>
                {/* For Debug purposes */}
                <Box>Url currently is: {appState?.inputUrl}</Box>
                {validationState === OASValidationResult.Loading && <TextSM text="Not Yet Validated" />}
                {validationState === OASValidationResult.Success && <TextSM text="Successfully Validated" />}
                {validationState === OASValidationResult.Failure && <TextSM text="Validation Failed" />}
                {loading && <TextMD text="Checking if the URL points to a valid OpenAPI file..." />}
            </Flex>
        </Container>
    )
}

export default DataServicesPage