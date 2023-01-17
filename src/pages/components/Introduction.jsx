import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Text,
  Stack,
  Img,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function Introduction() {
  return (
    <Stack
      width={"100vw"}
      minH={"100vh"}
      bg={"black"}
      height={"fit-content"}
      color={"white"}
      justify={"center"}
      align={"center"}
      paddingTop={["15vh", "10vh", "5vh"]}
      direction={["column", "column", "column", "row"]}
      background={`linear-gradient(rgba(0, 0,0, 0.6), rgba(0, 0, 0, 0.2)),url("./intro_bg.jpg")`}
      backgroundSize={"cover"}
    >
      <VStack paddingLeft={"5vw"} width={["50vw"]} spacing={5} align={"left"}>
        <Heading
          fontFamily={"sans-serif"}
          fontWeight={"900"}
          fontSize={["2.5em", "2.5em", "3.0em", "3.5em"]}
        >
          Upgrade Your Swaps
        </Heading>
        <Text fontSize={"18px"}>
          Unlock the full potential of DeFi with our AMM dapp. Swap, add
          liquidity, and remove liquidity with just a few clicks. No middlemen,
          no restrictions, just a seamless and professional experience. Join our
          community of traders and liquidity providers and experience the future
          of decentralized finance. Try it now!
        </Text>
        <Link href={"/Main"}>
          <Button colorScheme={"blue"} width={"fit-content"}>
            Trade Now
          </Button>
        </Link>
      </VStack>
      {/* <Img

        justify={"center"}
        width={["100%", "80%", "60%"]}
        height={["80%", "70%", "60%"]}
        objectFit={"contain"}
        src="./intro_bg.jpg"
      />
       */}
    </Stack>
  );
}

export default Introduction;
