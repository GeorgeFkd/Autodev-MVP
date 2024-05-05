"use client";
import Container from '@/components/Container';
import { useGlobalState } from '@/contexts/AppContext'
import React, { useEffect, useState } from 'react'
import { Button, Menu, MenuButton, MenuItem, MenuList, chakra } from "@chakra-ui/react"
import { ArrowDownIcon } from "@chakra-ui/icons"

function GenerateCodePage() {
    const { appState, dispatch } = useGlobalState();
    const [availableLanguages, setAvailableLanguages] = useState([""])
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const generateTheCode = () => {
        if (!appState?.inputUrl || appState?.inputUrl === "some weird page") {
            console.log("Skipping code generation request")
            return;
        }
        setIsLoading(true)
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
        }).then((response) => {
            return response.json()
        }).then((data) => {
            setIsLoading(false)
            const downloadLink = data.link;
            console.log("Download link: ", downloadLink)
            window.open(downloadLink, "_blank")
        })
    }


    useEffect(() => {
        let ignore = false;
        //for some reason this does not work in production
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
            <Button onClick={() => generateTheCode()} isLoading={isLoading}>Submit</Button>
        </Container>
    )
}

export default GenerateCodePage