"use client"
import { useAppContext, useDispatch, useGlobalState } from '@/contexts/AppContext'
import React, { useState } from 'react'
import { Button, Flex, Grid, chakra } from "@chakra-ui/react"
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { TextMD, TextSM } from '@/components/Text';


enum OASValidationResult {
    Success,
    Failure, Loading
}


const VALIDATE_OPENAPI_FILE_URL = "/api/fetch-file"

function FillDataSourcesPage() {
    const { appState, dispatch } = useGlobalState();
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
                <TextMD text={"Url is: " + appState?.inputUrl || "No Url Provided"} />
                <Button onClick={() => handleVerifyUrl()} isLoading={loading}>Verify Url</Button>
                {validationState === OASValidationResult.Loading && <TextSM text="Not Yet Validated" />}
                {validationState === OASValidationResult.Success && <TextSM text="Successfully Validated" />}
                {validationState === OASValidationResult.Failure && <TextSM text="Validation Failed" />}
                {loading && <TextMD text="Checking if the URL points to a valid OpenAPI file..." />}
            </Flex>
        </Container>
    )
}

export default FillDataSourcesPage
