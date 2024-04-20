"use client"

import Image from "next/image";
import Link from "next/link";
import "../types/types"
import { Button, Grid, GridItem, VStack } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
export default function Home() {
  return (
    <Grid height="100vh" width="100vw" placeItems={"center"}>
      <GridItem>
        <chakra.h1 fontSize={"3.5rem"} fontWeight={"bold"}>Pick the type of software you want to create</chakra.h1>
      </GridItem>
      <GridItem>
        <VStack>
          <Button><Link href={"/data-services"}>Data Services(Statistics+Dashboards)</Link></Button>
          <Button>E-Commerce Site</Button>
        </VStack>
      </GridItem>
    </Grid>
  );
}