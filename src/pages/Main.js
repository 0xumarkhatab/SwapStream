import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Text,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Img,
} from "@chakra-ui/react";
import Timer from "./components/Timer";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  claimReward,
  getClaimDeadline,
  getContract,
  getEstimatedReward,
  getSigner,
  getStakeDeadline,
  stakeAmount,
  stakingRewardRatePerSecond,
  startStaking,
} from "@/SmartContractInteraction";
import { useRouter } from "next/router";
function Main() {
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState(null);
  const [Loader, setLoader] = useState(false);
  const Navigate = useRouter();

  async function ensureContractIsFetched() {
    if (!contract) {
      let _signer = await getSigner();
      let _contract = await getContract(_signer, setContract);
      return _contract;
    }
    return contract;
  }

  async function updateApp() {
    console.log("updating");
  }
  useEffect(() => {
    if (address) {
      updateApp();
    }
  }, [address]);

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      color={"white"}
      align={"center"}
      justify={"center"}
      paddingTop={"20vh"}
      bg={"black"}
      background={`linear-gradient(rgba(0, 0,0, 0.4), rgba(0, 0, 0, 1)),url("./intro_bg.jpg")`}
      backgroundSize={"cover"}
    >
      <VStack
        width={"70vw"}
        height={"70vh"}
        color={"white"}
        padding={"10vw"}
        background={`linear-gradient(rgba(0, 0,0, 0.4), rgba(0, 0, 0, 0.8))`}
        backgroundSize={"cover"}
        // border={"1px solid rgba(255,255,255,0.2)"}
        boxShadow={"1px 1px 1px 1px white"}
        borderRadius={"20px"}
        justify={"center"}
      >
        {!address ? (
          <ConnectButton />
        ) : (
          <VStack paddingTop={["20vh", "10vh"]} justify={"flex-start"}>
            <Tabs colorScheme={"cyan"}>
              <TabList
                width={"fit-content"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Tab>Swap</Tab>
                <Tab>Add Liquidity</Tab>
                <Tab>Remove Liquidity</Tab>
              </TabList>

              <TabPanels>
                <TabPanel justifyItems={"space-between"}>
                  <Stack
                    align={"center"}
                    direction={["column", "column", "row"]}
                    spacing={5}
                  >
                    <Heading>Swap the Tokens</Heading>
                  </Stack>

                  <VStack height={"60vh"} paddingTop={"10vh"} spacing={10}>
                    {
                      <>
                        <Input variant="outline" />

                        <Button colorScheme={"green"}>Swap</Button>
                      </>
                    }
                  </VStack>
                </TabPanel>
                <TabPanel justifyItems={"space-between"}>
                  <Stack
                    align={"center"}
                    direction={["column", "column", "row"]}
                    spacing={5}
                  >
                    <Heading>Add Liquidity</Heading>
                  </Stack>

                  <VStack height={"60vh"} paddingTop={"10vh"} spacing={10}>
                    {
                      <>
                        <Input variant="outline" />

                        <Button colorScheme={"green"}>Swap</Button>
                      </>
                    }
                  </VStack>
                </TabPanel>
                <TabPanel justifyItems={"space-between"}>
                  <Stack
                    align={"center"}
                    direction={["column", "column", "row"]}
                    spacing={5}
                  >
                    <Heading>Remove Liquidity</Heading>
                  </Stack>

                  <VStack height={"60vh"} paddingTop={"10vh"} spacing={10}>
                    {
                      <>
                        <Input variant="outline" />

                        <Button colorScheme={"green"}>Swap</Button>
                      </>
                    }
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default Main;
