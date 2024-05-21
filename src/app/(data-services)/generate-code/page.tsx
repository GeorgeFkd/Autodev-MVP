"use client";
import Container from '@/components/Container';
import { useGlobalState } from '@/contexts/AppContext'
import React, { useEffect, useState } from 'react'
import { Button, Code, Menu, MenuButton, MenuItem, MenuList, chakra } from "@chakra-ui/react"
import { ArrowDownIcon } from "@chakra-ui/icons"


enum CodeGenSteps {
    GenerateBlueprints,
    GenerateCode,
    NotYetStarted,
    FinishedFailure,
    FinishedSuccessfully
}
function getMessageOfStep(step: CodeGenSteps) {
    if (step === CodeGenSteps.GenerateBlueprints) return "Generating Blueprints"
    if (step === CodeGenSteps.GenerateCode) return "Generating Code"
    if (step === CodeGenSteps.NotYetStarted) return ""
    if (step === CodeGenSteps.FinishedFailure) return "The process has failed, you can retry and then contact the administrator"
    if (step === CodeGenSteps.FinishedSuccessfully) return "The process has finished successfully, you just saved 2weeks of development time"
}

function GenerateCodePage() {
    const { appState, dispatch } = useGlobalState();
    const [availableLanguages, setAvailableLanguages] = useState([""])
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [currentStateOfGeneration, setCurrentStateOfGeneration] = useState({ loading: false, currentStep: CodeGenSteps.NotYetStarted })
    const generateTheCode = () => {
        if (!appState?.inputUrl || appState?.inputUrl === "some weird page") {
            console.log("Skipping code generation request")
            return;
        }
        setCurrentStateOfGeneration({ loading: true, currentStep: CodeGenSteps.GenerateCode })
        fetch("/api/openapi-gen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                openAPIUrl: appState?.inputUrl,
                language: selectedLanguage,
                options: {},
                spec: {}
            })
        })
            .then((response) => {
                return response.json()
            }).then((data) => {
                setCurrentStateOfGeneration({ loading: false, currentStep: CodeGenSteps.FinishedSuccessfully })
                //instead of that i should just return the url of the repo created and the issues page.
                // const downloadLink = data.link;
                // console.log("Download link: ", downloadLink)
                // window.open(downloadLink, "_blank")
            })
    }
    const initializeGithubRepoAndUploadCode = () => {
        if (!appState?.inputUrl || appState?.inputUrl === "some weird page") {
            console.log("Skipping code generation request")
            return;
        }
        setCurrentStateOfGeneration({ loading: true, currentStep: CodeGenSteps.GenerateBlueprints })
        fetch("/api/init-git-repo", {
            method: "POST",
            body: JSON.stringify(appState)
        }).then((data) => {
            return data.json()
        }).then((val) => {
            console.log("Final Val is: ", val)
            generateTheCode()
        })
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
            {currentStateOfGeneration.currentStep !== CodeGenSteps.NotYetStarted ? <ProgressMessage step={currentStateOfGeneration.currentStep} /> : <></>}
            <Button onClick={() => initializeGithubRepoAndUploadCode()} isLoading={currentStateOfGeneration.loading}>Generate Dev Blueprints</Button>
        </Container>
    )
}

interface ProgressMessageProps {
    step: CodeGenSteps
}

function ProgressMessage({ step }: ProgressMessageProps) {
    return <chakra.span>{getMessageOfStep(step)}</chakra.span>
}

export default GenerateCodePage