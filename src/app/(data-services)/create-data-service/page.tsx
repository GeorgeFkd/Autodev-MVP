"use client"
import { useAppContext, useDispatch } from '@/contexts/AppContext'
import React, { useState } from 'react'
import { Button, VStack, chakra } from "@chakra-ui/react"
import { useRouter } from 'next/navigation';


enum OASValidationResult {
    Success,
    Failure, Loading
}

function FillDataSourcesPage() {
    const appState = useAppContext();
    const dispatch = useDispatch();
    const router = useRouter();
    const [validationState, setValidationState] = useState(OASValidationResult.Loading);
    const handleVerifyUrl = () => {
        console.log("Submitting to API: " + appState?.inputUrl)
        // const request = new Request({ body: appState?.inputUrl, url: "/api/fetch-file", method: "GET" })
        fetch("/api/fetch-file", { method: "POST", body: appState?.inputUrl })
            .then((val) => {
                console.log("Returned Successfully: ")

                return val.json()
            }).then(val => {
                console.log("Object val: ", val);
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
        <div>
            FillDataSourcesPage
            <VStack>
                <chakra.span>Url is: {appState?.inputUrl}</chakra.span>
                <Button onClick={() => handleVerifyUrl()}>Verify Url</Button>
                {validationState === OASValidationResult.Loading && "Not yet Validated"}
                {validationState === OASValidationResult.Success && "Successfully Validated"}
                {validationState === OASValidationResult.Failure && "Validation Failed"}

            </VStack>

        </div>
    )
}

export default FillDataSourcesPage
