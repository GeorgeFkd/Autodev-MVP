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
    // const [width, setWidth] = useState(100);
    console.log("Rerendering")
    // const [height, setHeight] = useState(100);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    })

    const handleMouseMove = (event: MouseEvent) => {
        if (event.buttons === 1) {
            setWidth(event.clientX);
            setHeight(event.clientY);
        }
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };


    return (
        <chakra.div resize={"both"} border="3px solid green" w={width} h={height} overflow={"hidden"}>{children}</chakra.div>
    )
}

export default ResizableBox