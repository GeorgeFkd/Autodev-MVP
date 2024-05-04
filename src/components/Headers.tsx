
import React from 'react'
import { manropeSemiBold, ysabeau600 } from "@/styles/fonts";
import { chakra } from "@chakra-ui/react";


function Header1({ text }: { text: string }) {
    return (
        <chakra.h1 fontSize={"3.5rem"} className={manropeSemiBold.className} fontWeight={"bold"}>{text}</chakra.h1>
    )
}

function Header2({ text }: { text: string }) {
    return (
        <chakra.h2 fontSize={"2.7rem"}>{text}</chakra.h2>
    )
}

function Header3({ text }: { text: string }) {
    return (
        <chakra.h3 fontSize={"2.3rem"}>{text}</chakra.h3>
    )
}

function Header4({ text }: { text: string }) {
    return (
        <chakra.h4 fontSize={"2rem"}>{text}</chakra.h4>
    )
}

function Header5({ text }: { text: string }) {
    return (
        <chakra.h5 fontSize={"1.8rem"}>{text}</chakra.h5>
    )
}

function Header6({ text }: { text: string }) {
    return (
        <chakra.h6 fontSize={"1.6rem"}>{text}</chakra.h6>
    )
}


export { Header1, Header2, Header3, Header4, Header5, Header6 }