"use client"
import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { ysabeau600 } from "@/styles/fonts";
import { Header1 } from "@/components/Headers";
import Container from "@/components/Container";
import { SupportedSoftware } from "@/types/types";
import { useGlobalState } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";



const supportedSoftwareRoutes = [
  { href: "/give-name", text: "Data Services", swType: SupportedSoftware.DATA_SERVICES },
  { href: "/give-name", text: "E-Commerce", swType: SupportedSoftware.E_COMMERCE },
  { href: "/give-name", text: "CRM", swType: SupportedSoftware.CLIENTELE_MANAGEMENT },
  { href: "/give-name", text: "Process Automation", swType: SupportedSoftware.BUSINESS_PROCESS },
  { href: "/give-name", text: "Web Blog", swType: SupportedSoftware.WEB_BLOG }
]

export default function Home() {
  return (
    <Container>
      <Header1 text="Pick the type of software you want to create" />
      <SoftwareTypeSelectGrid data={supportedSoftwareRoutes} />
    </Container>

  );
}


interface SoftwareTypeSelectGridProps {
  data: CreateSoftwareBtnProps[];
}

const templateColumns = "1fr 1fr 1fr 1fr"
const templateRows = "1fr 1fr 1fr"
const gap = 6

function SoftwareTypeSelectGrid({ data }: SoftwareTypeSelectGridProps) {
  return (
    <Grid templateColumns={templateColumns} templateRows={templateRows} gap={gap} rowGap="1.5rem">
      {data.map((prop, index) => {
        return <GridItem key={prop.text}><CreateSoftwareBtn href={prop.href} text={prop.text} swType={prop.swType} /></GridItem>
      })}
    </Grid>
  )
}


interface CreateSoftwareBtnProps {
  href: string;
  text: string;
  swType: SupportedSoftware
}

function CreateSoftwareBtn({ href, text, swType }: CreateSoftwareBtnProps) {
  const { dispatch, appState } = useGlobalState();
  const router = useRouter()
  const handleClick = () => {
    //couldnt implement this properly with links
    //@ts-expect-error
    dispatch({ "type": "set-app-type", payload: swType })
    console.log(appState)
    router.push(href)
  }


  return <Button textOverflow={"revert"} w={"12rem"} h={"12rem"} fontSize="1.1rem" onClick={handleClick}
    className={ysabeau600.className}>{text}</Button>

}
