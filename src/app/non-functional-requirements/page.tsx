"use client"
import { Header2 } from "@/components/Headers"
import { TextLG } from "@/components/Text"
import { useGlobalState } from "@/contexts/AppContext";
import { MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Flex,Box, Button, IconButton,chakra } from "@chakra-ui/react"
import { useRouter } from 'next/navigation';







export default function NonFunctionalRequirementsPage(){
    const { appState, dispatch } = useGlobalState();
    const router = useRouter();
    console.log("App State is: ",appState)
    if(!appState?.nfr){
        return "Something went wrong"
    }
    const handleSubmit = (k:string,nfrValue:number)=>{
        const obj:Record<string,number> = {}
        obj[k] = nfrValue
        //@ts-expect-error
        dispatch({type:"set-non-functional-requirement",payload:obj})
    }

    const goToNextPage = () => {
        router.push("/")
    }


    return <Flex h="100%" flexDir={"column"} alignItems={"center"} mt="1rem" rowGap={"2rem"}>
        <Header2 text="Non Functional Requirements Page" />
        <Flex flexDir={"row"} justifyContent={"space-around"} w="100vw" columnGap={"2rem"} my="auto" alignSelf={"start"}>
            {Object.keys(appState?.nfr).map(k=>{
                //@ts-expect-error
                const val:number = appState.nfr[k] as number;
                return <RequirementsBar key={k} color={"lightgreen"} label={k} value={val} onChange={(a)=>handleSubmit(k,a)} />
            })}
        </Flex>
        <Button onClick={goToNextPage}>Submit</Button>
    </Flex>
}
interface RequirementsBarProps {
    label:string,
    value:number,
    color:string,
    onChange:(a:number)=>void
}

function translateValueToHeight(val:number){
    return val * 3
}

function getMessageForVal(val:number) {
    if (val <= 20) {
        return "For my scenario it barely matters"
    }

    if (val <= 40) {
        return "I don't care much but just a bit never hurt anyone"
    }

    if (val <= 60) {
        return "I care but let's not consume too much time for it"
    }

    if (val <= 80) {
        return "I care a lot and it should be actively pursued"
    }

    if (val <= 100) {
        return "It is critical and it must be prioritised"
    }

    return ""
}

function getColorForVal(val:number) {
    if (val <= 20) {
        return "lightgreen"
    }

    if (val <= 40) {
        return "green"
    }

    if (val <= 60) {
        return "yellow"
    }

    if (val <= 80) {
        return "orange"
    }

    if (val <= 100) {
        return "red"
    }
    return ""
}

function RequirementsBar({color,label,onChange,value}:RequirementsBarProps) {
    const height = translateValueToHeight(value);
    const width = 100
    const handleChange = (num:number) =>{
        //I can display helper stuff if i want to
        if(num === 0 || num === 110){
            return ;
        }
        if(num < 0) {
            onChange(10)
            return;
        }
        if(num > 110) {
            onChange(100)
            return;
        }

        onChange(num)
    }
    const maxVal = 100
    const maxHeight = translateValueToHeight(maxVal)
    const extraSpace = 100
    const theColor = getColorForVal(value)
    return <Flex flexDir={"row"} flexWrap={"wrap"} alignItems={"center"} columnGap={"1rem"} h={maxHeight + extraSpace}>
        <Flex flexDir={"column"} rowGap={"1rem"}>
        <TextLG text={label} />
        <IconButton aria-label="plus" icon={<PlusSquareIcon />} onClick={(e)=>handleChange(value+10)}></IconButton>
        <IconButton aria-label="minus" icon={<MinusIcon />} onClick={(e)=>handleChange(value-10)}></IconButton>
        
    </Flex>
    {/* I need to find a way to keep its bottom glued  */}
    <Box mt="auto" h={`${height}px`} w={`${width}px`} bgColor={theColor}> </Box>
    <Flex flexDir={"column"} rowGap={"0.5rem"}>

    <TextLG text={`Value: ${value}%`} />
    <chakra.span w="10rem" wordBreak={"break-word"}>{getMessageForVal(value)}</chakra.span>
    </Flex>
    
    
    </Flex>
}