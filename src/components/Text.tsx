import React from 'react';
import { chakra } from "@chakra-ui/react";
import { ysabeau400 } from '@/styles/fonts';
const fontSizes = ["1.1rem", "1.25rem", "1.5rem", "1.75rem", "2rem"]

function TextSM({ text }: { text: string }) {
    return <chakra.span className={ysabeau400.className} fontSize={fontSizes[0]}>{text}</chakra.span>
}

function TextMD({ text }: { text: string }) {
    return <chakra.span className={ysabeau400.className} fontSize={fontSizes[1]}>{text}</chakra.span>

}

function TextLG({ text }: { text: string }) {
    return <chakra.span className={ysabeau400.className} fontSize={fontSizes[2]}>{text}</chakra.span>

}

function TextXL({ text }: { text: string }) {
    return <chakra.span className={ysabeau400.className} fontSize={fontSizes[3]}>{text}</chakra.span>
}

export { TextSM, TextMD, TextLG, TextXL }