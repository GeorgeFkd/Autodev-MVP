import React, { useEffect, useState } from 'react'
import { chakra } from "@chakra-ui/react"

interface ResizableBoxProps {
    width: number,
    height: number,
    setWidth: (width: number) => void,
    setHeight: (height: number) => void,
    children: React.ReactNode,

}

function ResizableBox({ width, height, setWidth, setHeight, children }: ResizableBoxProps) {
    console.log("Rerendering")
    useEffect(() => {
        const handleResize = () => {
            console.log("Setting new width and height")
            //to not trigger a rerender when it covers the whole screen
            //should only respond to the user dragging it
            if (Math.abs(window.innerWidth - width) > 30 && Math.abs(window.innerHeight - height) > 30) return;
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    const handleMouseDown = () => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (event.buttons === 1) {
            console.log("Setting new width and height")
            setWidth(event.clientX);
            setHeight(event.clientY);
        }
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };


    return (
        <chakra.div onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} resize={"both"} border="3px solid green" w={width} h={height} overflow={"hidden"}>{children}</chakra.div>
    )
}

export default ResizableBox