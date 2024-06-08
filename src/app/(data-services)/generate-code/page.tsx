"use client";
import Container from '@/components/Container';
import { useGlobalState } from '@/contexts/AppContext'
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Flex, ListItem, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UnorderedList, chakra, useBoolean, useDisclosure } from "@chakra-ui/react"
import { ArrowDownIcon } from "@chakra-ui/icons"
import Link from 'next/link';
import { ApiDataComponent, AppContext, Page } from '@/types/types';


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
    const [selectedLanguage, setSelectedLanguage] = useState("java");
    const availableLanguages = useAvailableLanguages();
    const [currentStateOfGeneration, setCurrentStateOfGeneration] = useState({ loading: false, currentStep: CodegenState.NotYetStarted })
    const [githubUrl, setGithubUrl] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
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
        setGithubUrl(ghRepoInitResult.htmlUrlToDisplay)

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

    return (
        <Container>
            <chakra.h1 fontSize={"2rem"}>Generate Code for: {appState?.appName}</chakra.h1>
            <chakra.p>URL: {appState?.inputUrl}</chakra.p>
            <Button onClick={onOpen}>Show Summary</Button>
            <SummaryOfGeneration data={appState} isOpen={isOpen} onClose={onClose} />
            {githubUrl && <chakra.p>The Github Repo can be found <Link href={githubUrl}>here</Link></chakra.p>}
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

function useAvailableLanguages() {
    const [availableLanguages, setAvailableLanguages] = useState([""])
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
    return availableLanguages
}


interface SummarizeGenerationProps {
    data: AppContext | null,
    isOpen: boolean,
    onClose: () => void
}

function SummaryOfGeneration({ isOpen, data, onClose }: SummarizeGenerationProps) {
    if (!data) {
        return "Something went wrong"
    }
    return <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Generating an App with Automaton</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <AppSummary data={data} />
            </ModalBody>

            <ModalFooter w="100%">
                <Flex w="100%" flexDir="column">
                    <Button alignSelf={"center"} onClick={onClose}>Continue Code Generation</Button>
                </Flex>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

interface AppSummary {
    data: AppContext
}

function AppSummary({ data }: AppSummary) {

    return (
        <>
            <Flex flexDir="column" rowGap={"1rem"} mb="0.5rem">
                <chakra.p><chakra.span fontWeight={"bold"}>App Title:</chakra.span> {data.appName}</chakra.p>
                <chakra.p><chakra.span fontWeight={"bold"}>App Type:</chakra.span> {data.appType}</chakra.p>
                <chakra.p><chakra.span fontWeight={"bold"}>Data is from:</chakra.span> <Link href={data.inputUrl}>{data.inputUrl}</Link></chakra.p>
            </Flex>
            <hr></hr>
            <Flex flexDir={"column"} mt="1rem">
                <chakra.span alignSelf={"center"} fontWeight={"bold"}>Charts:</chakra.span>
                {data.pages.map(page => {
                    return (
                        <CodegenPage key={page.pageName} page={page} />
                    )
                })}
            </Flex></>
    )
}


interface CodegenPage {
    page: Page
}

function CodegenPage({ page }: CodegenPage) {
    return (<><Flex flexDir={"column"} key={page.pageName}>
        <chakra.p><chakra.span fontWeight={"bold"}>Page:</chakra.span> {page.pageName}</chakra.p>
        <chakra.span fontWeight={"bold"} ml="1rem" mb="1rem">Components</chakra.span>
        <Flex flexDir="column" ml="2rem" rowGap={"1rem"}>
            {page.associatedData.map(component => {
                return (
                    <CodegenComponent key={component.data.identification} data={component} />
                )
            })}
        </Flex>
    </Flex>
        <hr></hr></>)
}

interface CodegenComponent {
    data: ApiDataComponent
}

function CodegenComponent({ data }: CodegenComponent) {
    return <Flex flexDir={"column"} mb="1rem">
        <chakra.span><chakra.span fontWeight={"bold"} mr="1rem">Name:</chakra.span> {data.component.componentName}</chakra.span>
        <chakra.span><chakra.span fontWeight={"bold"} mr="1rem"> Data Source:</chakra.span> {data.data.description}</chakra.span>
        <chakra.span><chakra.span fontWeight={"bold"} mr="1rem">Statistics Chart:</chakra.span> {data.data.graph}</chakra.span>
        <hr></hr>
    </Flex>
}

interface ProgressMessageProps {
    step: CodegenState
}

function ProgressMessage({ step }: ProgressMessageProps) {
    return <chakra.span>{getMessageOfStep(step)}</chakra.span>
}

export default GenerateCodePage