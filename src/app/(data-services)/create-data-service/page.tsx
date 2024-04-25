"use client"
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import React, { useState } from 'react'
import { Button, Flex, Grid, chakra } from "@chakra-ui/react"
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';


enum OASValidationResult {
    Success,
    Failure, Loading
}


const VALIDATE_OPENAPI_FILE_URL = "/api/fetch-file"

function FillDataSourcesPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
    const router = useRouter();
    const [validationState, setValidationState] = useState(OASValidationResult.Loading);
    const [loading, setIsLoading] = useState(false)
    const handleVerifyUrl = () => {
        console.log("Submitting to API: " + appState?.inputUrl)
        // const request = new Request({ body: appState?.inputUrl, url: "/api/fetch-file", method: "GET" })
        setIsLoading(true);
        fetch(VALIDATE_OPENAPI_FILE_URL, { method: "POST", body: appState?.inputUrl })
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

    console.log("The state currently is: ", appState?.selectedApiData)
    return (
        <Container>
            <Flex flexDir="column" rowGap="2rem">
                <chakra.span fontSize={"1.2rem"}>Url is: {appState?.inputUrl}</chakra.span>
                <Button onClick={() => handleVerifyUrl()} isLoading={loading}>Verify Url</Button>
                {validationState === OASValidationResult.Loading && <chakra.span fontWeight={"bold"} fontSize={"1.1rem"}>Not yet Validated</chakra.span>}
                {validationState === OASValidationResult.Success && <chakra.span fontWeight={"bold"} fontSize={"1.1rem"}>Successfully Validated</chakra.span>}
                {validationState === OASValidationResult.Failure && <chakra.span fontWeight={"bold"} fontSize={"1.1rem"}>Validation Failed</chakra.span>}
                {loading && <chakra.span fontSize="1.1rem">Checking if the URL points to a valid OpenAPI file...</chakra.span>}
            </Flex>
        </Container>
    )
}

export default FillDataSourcesPage
