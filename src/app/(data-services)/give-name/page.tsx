"use client"
import { Header1 } from '@/components/Headers'
import { TextMD, TextSM } from '@/components/Text'
import { useGlobalState } from '@/contexts/AppContext'
import { SupportedSoftware } from '@/types/types'
import { ArrowRightIcon, CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { Button, Flex, Grid, GridItem, IconButton, Input, Textarea, chakra, useClipboard, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function placeholderValueForSoftwareType(swType: SupportedSoftware | undefined) {
    return "BigDataPlatform"
}


function GiveNameToSoftwarePage() {
    // const [software, setSoftware] = useObject<Software>({ name: "", description: "" })
    const { appState, dispatch } = useGlobalState();
    const [isLoading, setIsLoading] = useState(false);
    const [softwareName, setSoftwareName] = useState("FinDecisionMaker")
    const [softwareDescription, setSoftwareDescription] = useState("")
    const [suggestedSoftwareNames, setSuggestedSoftwareNames] = useState(["First Option", "Second Option", "Third Option"])
    const templateAreas = `
    "title title"
    "descr input"
    "btngen btnsubmit"
`
    const templateRows = "1fr 1fr 1fr"
    const templateColumns = "1fr 1fr"

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
        })
            .then(res => {
                setIsLoading(false)
                return res.json()
            }).then((data: string[]) => {
                console.log("The data is: ", data)
                setIsLoading(false)
                setSuggestedSoftwareNames(data)
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

        <Grid w="100vw" h="100vh" placeItems="center" templateAreas={templateAreas} templateColumns={templateColumns} templateRows={templateRows}>
            <GridItem gridArea="title">

                <Header1 text='Name your software' />
            </GridItem>
            <GridItem gridArea="descr">
                <Textarea resize="both" placeholder="Describe your software" value={softwareDescription} onChange={(e) => setSoftwareDescription(e.target.value)} />
            </GridItem>
            <GridItem gridArea="btngen">
                <Button variant="outline" isLoading={isLoading} onClick={() => generateTitleWithAi(appState?.appType, softwareDescription)}>Generate Using AI</Button>
            </GridItem>
            <GridItem gridArea="input">
                <Flex flexDir="column" rowGap="1rem">
                    <TextMD text='Write a name here or give a description above for your Copilot' />
                    <Input size="lg" htmlSize={25} w="auto" value={softwareName} onChange={(e) => setSoftwareName(e.target.value)} placeholder={placeholderValueForSoftwareType(appState?.appType)} />
                    {suggestedSoftwareNames.map(suggestion => (<UserSuggestion key={suggestion} suggestion={suggestion} />))}
                </Flex>

            </GridItem>
            <GridItem gridArea="btnsubmit">

                <Button rightIcon={<ArrowRightIcon />} onClick={continueToNextPage}>Continue Creating {appState?.appType} Software</Button>
            </GridItem>
        </Grid>

    )
}

function UserSuggestion({ suggestion }: { suggestion: string }) {
    const { onCopy, value, setValue, hasCopied } = useClipboard('')
    const toast = useToast()
    console.log("Current Value copied: ", value)
    const handleCopy = () => {
        onCopy()
        setValue(suggestion)
        toast({
            title: 'AI Suggestion Copied',
            status: "success",
            duration: 3000
        })
    }
    return <Flex w="100%" justifyContent="space-between" alignItems={"center"} columnGap={"1rem"} px="2rem">
        <TextSM text={suggestion} />
        <IconButton aria-label="copy" onClick={handleCopy} icon={!hasCopied ? <CopyIcon /> : <CheckIcon />}></IconButton>
    </Flex>
}

export default GiveNameToSoftwarePage