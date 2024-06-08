"use client";
import Container from '@/components/Container';
import { useGlobalState } from '@/contexts/AppContext'
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Flex, Menu, MenuButton, MenuItem, MenuList, chakra, useBoolean } from "@chakra-ui/react"
import { ArrowDownIcon } from "@chakra-ui/icons"


enum CodegenState {
    GenerateBlueprints,
    GenerateCode,
    NotYetStarted,
    FinishedFailure,
    FinishedSuccessfully
}

interface GitRepoResponse {
    success: boolean,
    urlOfRepo: string,
    msg: string,
    htmlUrlToDisplay: string
}

interface FrontendGenResponse {
    success: boolean,
    msg: string,
    info: any
}

function getMessageOfStep(step: CodegenState) {
    if (step === CodegenState.GenerateBlueprints) return "Generating Blueprints"
    if (step === CodegenState.GenerateCode) return "Generating Code"
    if (step === CodegenState.NotYetStarted) return ""
    if (step === CodegenState.FinishedFailure) return "The process has failed, you can retry and then contact the administrator"
    if (step === CodegenState.FinishedSuccessfully) return "The process has finished successfully, you just saved 2weeks of development time"
}

function GenerateCodePage() {
    const { appState, dispatch } = useGlobalState();
    const [availableLanguages, setAvailableLanguages] = useState([""])
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [currentStateOfGeneration, setCurrentStateOfGeneration] = useState({ loading: false, currentStep: CodegenState.NotYetStarted })
    const [linkText, setLinkText] = useState("")
    const generateBackendCode = async (inGhRepo: string) => {
        return fetch("/api/openapi-gen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                openAPIUrl: appState?.inputUrl,
                language: selectedLanguage,
                options: {},
                spec: {},
                ghRepoUrl: inGhRepo
            })
        }).then((response) => {
            return response.json()
        })
    }

    //these functions can also be extracted outside the component with one more param the state
    const generateFrontendCode = async (inGhRepo: string) => {
        return fetch("/api/frontend-code-gen", {
            method: "POST",
            body: JSON.stringify({
                userInput: appState,
                ghRepoUrl: inGhRepo
            })
        }).then((data) => {
            return data.json() as Promise<FrontendGenResponse>
        })
    }

    const createGhRepoAndIssues = async () => {
        return fetch("/api/init-git-repo", {
            method: "POST",
            body: JSON.stringify(appState)
        }).then((data) => {
            return data.json() as Promise<GitRepoResponse>
        })
    }

    const handleSubmit = async () => {
        if (!appState?.inputUrl || appState?.inputUrl === "some weird page") {
            console.log("Skipping code generation request")
            return;
        }

        setCurrentStateOfGeneration({ loading: true, currentStep: CodegenState.GenerateBlueprints })
        const ghRepoInitResult = await createGhRepoAndIssues();
        console.log("Github Init result: ", ghRepoInitResult)
        setLinkText("You can see more here: " + ghRepoInitResult.htmlUrlToDisplay)

        setCurrentStateOfGeneration({ loading: true, currentStep: CodegenState.GenerateCode })
        const backendCodegenResult = await generateBackendCode(ghRepoInitResult.urlOfRepo)
        setCurrentStateOfGeneration({ loading: false, currentStep: CodegenState.FinishedSuccessfully })
        console.log("For backend codegen: ", backendCodegenResult)

        setCurrentStateOfGeneration({ loading: true, currentStep: CodegenState.GenerateCode })
        const frontendCodegenResult = await generateFrontendCode(ghRepoInitResult.urlOfRepo)
        setCurrentStateOfGeneration({ loading: false, currentStep: CodegenState.FinishedSuccessfully })
        console.log("For frontend codegen: ", frontendCodegenResult)

        console.log("Continuing:")

    }


    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            fetch("/api/openapi-langs").then((response) => {
                return response.json() as Promise<string[]>
            })
                .then((data) => {
                    console.log("Total available languages: ", data)
                    setAvailableLanguages(data.filter(lang => lang.startsWith("scala") || lang.startsWith("java") || lang.startsWith("csharp")))
                    return;
                })
                .catch((error) => {
                    console.log(error)
                    setAvailableLanguages(["Error fetching data"])
                })

        }
        return () => {
            ignore = true;
        }
    }, [])


    return (
        <Container>
            <chakra.h1 fontSize={"1.5rem"}>Generate Code for: { }</chakra.h1>
            <chakra.p>URL: {appState?.inputUrl}</chakra.p>
            {linkText && <chakra.p>The Github Url is: {linkText}</chakra.p>}
            {/*  there is a bug here caused by scrolling */}
            <Menu placement="right-end">
                <MenuButton as={Button} rightIcon={<ArrowDownIcon />}>
                    {selectedLanguage || "Choose Programming Language"}
                </MenuButton>
                <MenuList>
                    {availableLanguages.map((language) => {
                        return <MenuItem key={language} onClick={() => setSelectedLanguage(language)}>{language}</MenuItem>

                    })}
                </MenuList>
            </Menu>
            {currentStateOfGeneration.currentStep !== CodegenState.NotYetStarted ? <ProgressMessage step={currentStateOfGeneration.currentStep} /> : <></>}
            <Button onClick={() => handleSubmit()} isLoading={currentStateOfGeneration.loading}>Generate Dev Blueprints</Button>
        </Container>
    )
}

interface ProgressMessageProps {
    step: CodegenState
}

function ProgressMessage({ step }: ProgressMessageProps) {
    return <chakra.span>{getMessageOfStep(step)}</chakra.span>
}

export default GenerateCodePage