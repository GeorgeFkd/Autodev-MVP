"use client"
import { Button, Flex } from "@chakra-ui/react";
import { ysabeau600 } from "@/styles/fonts";
import { Header1 } from "@/components/Headers";
import Container from "@/components/Container";
import { SupportedSoftware } from "@/types/types";
import { useGlobalState } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";



const supportedSoftwareRoutes = [
  { href: "/give-name", text: "Data Services", swType: SupportedSoftware.DATA_SERVICES }, { href: "/give-name", text: "E-Commerce", swType: SupportedSoftware.E_COMMERCE }
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
function SoftwareTypeSelectGrid({ data }: SoftwareTypeSelectGridProps) {
  return (
    <Flex flexDirection={"column"} rowGap="1.5rem">
      {data.map((prop, index) => {
        return <CreateSoftwareBtn key={prop.text} href={prop.href} text={prop.text} swType={prop.swType} />
      })}
    </Flex>
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


  return <Button w={"15rem"} fontSize="1.1rem" onClick={handleClick}
    className={ysabeau600.className}>{text}</Button>

}
