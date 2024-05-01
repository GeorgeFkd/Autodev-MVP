"use client"

import Link from "next/link";
import { Button, Grid, GridItem, VStack } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { manropeSemiBold, ysabeau400, ysabeau600 } from "@/styles/fonts";
export default function Home() {
  return (
    <Grid height="100vh" width="100vw" placeItems={"center"}>
      <GridItem>
        <chakra.h1 fontSize={"3.5rem"} className={manropeSemiBold.className} fontWeight={"bold"}>Pick the type of software you want to create</chakra.h1>
      </GridItem>
      <GridItem>
        <VStack>
          <Button fontSize="1.1rem" as={Link} href="/data-services" className={ysabeau600.className}>Data Services</Button>
          <Button>E-Commerce Site</Button>
        </VStack>
      </GridItem>
    </Grid>
  );
}
