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
    const generateTheCode = () => {
        if (!appState?.inputUrl || appState?.inputUrl === "some weird page") {
            console.log("Skipping code generation request")
            return;
        }
        console.log("Generating code for URL: ", appState?.inputUrl)
        fetch(`http://api.openapi-generator.tech/api/gen/clients/${selectedLanguage}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                openAPIUrl: appState?.inputUrl,
                options: {},
                spec: {}
            })
        })
            .then((response) => {
                console.log("Response received from API", response)
                // dispatch({ type: "setGeneratedCode", payload: data })
                //"link":string,"code":string
                return response.json()
            })
            .then((data) => {
                //not the best UX but good for now
                console.log("Data received from API", data)
                const downloadLink = data.link;
                console.log("Download link: ", downloadLink)
                window.open(downloadLink, "_blank")
            })
            .catch((error) => {
                console.log(error)
            })

    }


    useEffect(() => {
        let ignore = false;
        //for some reason this does not work in production
        if (!ignore) {
            fetch("http://api.openapi-generator.tech/api/gen/clients").then((response) => {
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
            <Button onClick={() => generateTheCode()}>Submit</Button>
        </Container>
    )
}

export default GenerateCodePage