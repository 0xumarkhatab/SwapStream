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
  FormControl,
  FormLabel,
  Select,
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
import BalanceItem from "./components/BalanceItem";
function Main() {
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [swapAmount, setSwapAmount] = useState(0);
  const [sourceToken, setSourceToken] = useState("usd");
  const [destinationToken, setDestinationToken] = useState("usdt");
  const [walletAddress, setWalletAddress] = useState(null);
  const [usdBalance, setUsdBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [liquidityBalance, setLiquidityBalance] = useState(0);
  /**
   * liquidity state variables
   */
  const [usdLiquidity, setUsdLiquidity] = useState(0);
  const [usdtLiquidity, setUsdtLiquidity] = useState(0);
  const [liquidityClaimAmount, setLiquidityClaimAmount] = useState(0);

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
      setWalletAddress(address);
      updateApp();
    }
  }, [address]);

  async function Swap() {
    alert("Swapping" + swapAmount + sourceToken + " for " + destinationToken);
  }
  async function addLiquidity() {
    alert(
      "adding " +
        usdLiquidity +
        " USD and " +
        usdtLiquidity +
        " USDT to liquidity"
    );
  }
  async function removeLiquidity() {
    alert("removing " + liquidityClaimAmount + " liquidity balance");
  }

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
        {!walletAddress && <ConnectButton />}
        {walletAddress && (
          <VStack padding={"10vh"}>
            <HStack width={"50vw"} justify={"center"} spacing={10}>
              <BalanceItem label={"USD"} amount={usdBalance} />
              <BalanceItem label={"USDt"} amount={usdtBalance} />
              <BalanceItem label={"Liquidity"} amount={liquidityBalance} />
            </HStack>
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
                  <Heading>Swap the Tokens</Heading>

                  <VStack height={"40vh"} spacing={10}>
                    {
                      <>
                        <Box p={5}>
                          <FormControl>
                            <FormLabel>Source Token</FormLabel>
                            <Select
                              colorScheme={"blue"}
                              value={sourceToken}
                              cursor={"pointer"}
                              onChange={(e) => {
                                setSourceToken(e.target.value);
                                if (e.target.value == "usd")
                                  setDestinationToken("usdt");
                                else setDestinationToken("usd");
                              }}
                            >
                              <option
                                style={{
                                  color: "black",
                                  cursor: "pointer",
                                }}
                                value="usd"
                              >
                                USD
                              </option>
                              <option
                                style={{
                                  color: "black",
                                  cursor: "pointer",
                                }}
                                value="usdt"
                              >
                                USDt
                              </option>
                            </Select>
                          </FormControl>
                          <FormControl>
                            <FormLabel>Destination Token</FormLabel>
                            <Input
                              value={destinationToken.toUpperCase()}
                              disabled
                            />
                          </FormControl>

                          <FormControl mt={4}>
                            <FormLabel>
                              Enter {sourceToken.toUpperCase()} Amount
                            </FormLabel>
                            <Input
                              type="number"
                              value={swapAmount}
                              onChange={(e) => setSwapAmount(e.target.value)}
                            />
                          </FormControl>

                          <FormControl mt={4}>
                            <Button onClick={Swap} colorScheme={"blue"}>
                              Trade
                            </Button>
                          </FormControl>
                        </Box>
                      </>
                    }
                  </VStack>
                </TabPanel>
                <TabPanel justifyItems={"space-between"}>
                  <Heading>Add liquidty </Heading>

                  <VStack height={"40vh"} spacing={10}>
                    <FormControl mt={4}>
                      <FormLabel>Enter USD Amount</FormLabel>
                      <Input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setUsdLiquidity(e.target.value)}
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Enter USDT Amount</FormLabel>
                      <Input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setUsdtLiquidity(e.target.value)}
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <Button onClick={addLiquidity} colorScheme={"blue"}>
                        Add Liquidity
                      </Button>
                    </FormControl>
                  </VStack>
                </TabPanel>
                <TabPanel justifyItems={"space-between"}>
                  <Heading>Add liquidty </Heading>

                  <VStack height={"40vh"} spacing={10}>
                    <FormControl mt={4}>
                      <FormLabel>Enter Shares to claim</FormLabel>
                      <Input
                        type="number"
                        placeholder="0"
                        onChange={(e) =>
                          setLiquidityClaimAmount(e.target.value)
                        }
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <Button onClick={removeLiquidity} colorScheme={"blue"}>
                        Add Liquidity
                      </Button>
                    </FormControl>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )}
      </VStack>

      {/* <VStack
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
        {!walletAddress ? (
          <ConnectButton />
        ) : (
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
                <Heading>Swap the Tokens</Heading>

                <VStack height={"60vh"} paddingTop={"10vh"} spacing={10}>
                  {
                    <>
                      <Box p={5}>
                        <FormControl>
                          <FormLabel>Source Token</FormLabel>
                          <Select
                            value={sourceToken}
                            onChange={(e) => {
                              setSourceToken(e.target.value);
                              if (e.target.value == "usd")
                                setDestinationToken("usdt");
                              else setDestinationToken("usd");
                            }}
                          >
                            <option value="usd">USD</option>
                            <option value="usdt">USDt</option>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel>Destination Token</FormLabel>
                          <Input value={destinationToken} disabled />
                        </FormControl>

                        <FormControl mt={4}>
                          <FormLabel>
                            Enter {sourceToken.toLocaleUpperCase()} Amount
                          </FormLabel>
                          <Input
                            type="number"
                            value={swapAmount}
                            onChange={(e) => setSwapAmount(e.target.value)}
                          />
                        </FormControl>
                        <FormControl mt={4}>
                          <Button colorScheme={"blue"}>Trade</Button>
                        </FormControl>
                      </Box>
                    </>
                  }
                </VStack>
              </TabPanel>
              <TabPanel justifyItems={"space-between"}></TabPanel>
              <TabPanel justifyItems={"space-between"}></TabPanel>
            </TabPanels>
          </Tabs>

        )}
      </VStack> */}
    </Box>
  );
}

export default Main;
