"use client"

import Link from "next/link";
import { Button, Flex } from "@chakra-ui/react";
import { ysabeau600 } from "@/styles/fonts";
import { Header1 } from "@/components/Headers";
import Container from "@/components/Container";
export default function Home() {
  return (
    <Container>
      <Header1 text="Pick the type of software you want to create" />
      <SoftwareTypeSelectGrid data={[{ href: "/data-services", text: "Data Services" }, { href: "e-commerce", text: "E-Commerce" }]} />
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
        return <CreateSoftwareBtn key={prop.href} href={prop.href} text={prop.text} />
      })}
    </Flex>
  )
}


interface CreateSoftwareBtnProps {
  href: string;
  text: string;
}

function CreateSoftwareBtn({ href, text }: CreateSoftwareBtnProps) {
  return <Button w={"15rem"} fontSize="1.1rem" as={Link} href={href} className={ysabeau600.className}>{text}</Button>

}
