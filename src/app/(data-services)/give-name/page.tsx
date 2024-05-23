"use client"
import Container from '@/components/Container'
import { Header1 } from '@/components/Headers'
import { useGlobalState } from '@/contexts/AppContext'
import { SupportedSoftware } from '@/types/types'
import { ArrowRightIcon } from '@chakra-ui/icons'
import { Button, Input, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function GiveNameToSoftwarePage() {
    // const [software, setSoftware] = useObject<Software>({ name: "", description: "" })
    const { appState, dispatch } = useGlobalState();
    const [isLoading, setIsLoading] = useState(false);
    const [softwareName, setSoftwareName] = useState("")
    const [softwareDescription, setSoftwareDescription] = useState("")
    const router = useRouter();
    const generateTitleWithAi = (swType: SupportedSoftware | undefined, description: string) => {
        if (!swType) return;
        setIsLoading(true)
        console.log("Generating with AI the title for the software")
        console.log("Type: ", swType, " Description: ", description)
        //fetch from ChatGPT stuff
        fetch("/api/generate-name", {
            method: "POST",
            body: JSON.stringify({ description, softwareType: swType })
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log("The data is: ", data)
            setIsLoading(false)
        })
        // const chatGptFinal = ""
        // setSoftwareName(chatGptFinal)
        // setIsLoading(false)
    }

    const submitTitle = () => {
        console.log("Submitting name: ", softwareName)
        //@ts-expect-error
        dispatch({ type: "set-app-name", payload: softwareName })
    }

    const continueToNextPage = () => {
        submitTitle()
        if (appState?.appType == SupportedSoftware.DATA_SERVICES) {
            router.push("/data-services")
            return;
        }

        if (appState?.appType == SupportedSoftware.E_COMMERCE) {
            router.push("/e-commerce")
            return;
        }

        router.push("/")
        //display toast and reroute user to the beginning page
    }

    return (
        <Container>
            <Header1 text='Name your software' />
            <Textarea placeholder="Describe your software" w="45%" h="40%" value={softwareDescription} onChange={(e) => setSoftwareDescription(e.target.value)} />
            <Button variant="outline" isLoading={isLoading} onClick={() => generateTitleWithAi(appState?.appType, softwareDescription)}>Generate Using AI</Button>
            <Input size="lg" w="35%" value={softwareName} onChange={(e) => setSoftwareName(e.target.value)} placeholder='Write a name here or give a description above for your Copilot' />
            <Button rightIcon={<ArrowRightIcon />} onClick={continueToNextPage}>Continue Creating {appState?.appType} Software</Button>
        </Container>
    )
}

export default GiveNameToSoftwarePage