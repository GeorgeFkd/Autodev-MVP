import React, { useCallback, useEffect, useState } from 'react'
import { chakra } from "@chakra-ui/react"

interface ResizableBoxProps {
    width: number,
    height: number,
    setWidth: (width: number) => void,
    setHeight: (height: number) => void,
    children: React.ReactNode,
    normaliseByX: number,
    normaliseByY: number

}

function ResizableBox({ width, height, setWidth, setHeight, children, normaliseByX, normaliseByY }: ResizableBoxProps) {
    const [drag, setDrag] = useState({ active: false, x: -1, y: -1 })

    console.log("Rerendering")
    const handleMouseMove = (e: MouseEvent) => {
        if (e.buttons === 1) {

            console.log("Setting new width and height")
            console.log("Existing: ", width, height)
            console.log("New: ", e.clientX, e.clientY)
            //the problem is that clientX and Y is dependent on the position of the screen
            console.log("Normalizing By: ", normaliseByX, normaliseByY)
            const newW = Math.abs(e.clientX - normaliseByX)
            const newH = Math.abs(e.clientY - normaliseByY)
            setWidth(newW)
            setHeight(newH)
        }
    }
    const handleMouseDown = (event: MouseEvent) => {
        setDrag({
            active: true,
            x: event.clientX,
            y: event.clientY
        })
    }



    const handleMouseUp = (event: MouseEvent) => {
        setDrag({ ...drag, active: false })
    }


    return (
        //@ts-ignore
        <chakra.div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} resize={"both"} border="3px solid grey" boxShadow="dark-lg" w={width + "px"} h={height + "px"} overflow={"hidden"}>{children}</chakra.div>
    )
}

export default ResizableBox