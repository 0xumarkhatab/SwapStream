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
  AddLiquidity,
  allowance,
  approve,
  claimReward,
  getBalance,
  getClaimDeadline,
  getContract,
  getERCContract,
  getEstimatedReward,
  getPlatformContract,
  getSigner,
  getStakeDeadline,
  RemoveLiquidity,
  stakeAmount,
  stakingRewardRatePerSecond,
  startStaking,
  swap,
} from "@/SmartContractInteraction";
import { useRouter } from "next/router";
import BalanceItem from "./components/BalanceItem";
import { parseEther } from "ethers/lib/utils.js";
function Main() {
  const { address, isConnected } = useAccount();
  const [platformContract, setPlatformContract] = useState(null);
  const [usdContract, setUsdContract] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);

  const [Loader, setLoader] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);

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

  async function fetchContracts() {
    let _signer = await getSigner();
    platformContract == null &&
      (await getPlatformContract(_signer, setPlatformContract));

    usdContract == null &&
      (await getERCContract(_signer, "usd", setUsdContract));
    usdtContract == null &&
      (await getERCContract(_signer, "usdt", setUsdtContract));
  }

  async function getBalances() {
    if (!platformContract || !usdContract || !usdtContract) {
      await fetchContracts();
      return 0;
    }
    await getBalance(usdContract, address, "usd", setUsdBalance);
    await getBalance(usdtContract, address, "usdt", setUsdtBalance);
    await getBalance(
      platformContract,
      address,
      "liquidity",
      setLiquidityBalance
    );
  }
  async function updateApp() {
    setWalletAddress(address);
    await fetchContracts();
    await getBalances();
  }
  useEffect(() => {
    if (address) {
      updateApp();
    }
  }, [address]);
  useEffect(() => {
    if (platformContract && usdContract && usdtContract) {
      getBalances();
    }
  }, [platformContract, usdContract, usdtContract]);

  async function Swap() {
    if (!platformContract) {
      await getPlatformContract();
    }
    setLoader(true);

    let _signer = await getSigner();
    let _contract = await getERCContract(_signer, sourceToken);
    await allowance(_contract, walletAddress, swapAmount, async () => {
      await swap(platformContract, sourceToken, swapAmount, () => {
        setLoader(false);
        alert("Tokens Swapped!");
      });
    });
  }
  async function addLiquidity() {
    setLoader(true);

    if (!platformContract) {
      setLoadingMessage("Preparing...");
      await fetchContracts();
    }

    let _signer = await getSigner();

    let _usd_contract = usdContract
      ? usdContract
      : await getERCContract(_signer, "usd");
    let _usdt_contract = usdtContract
      ? usdtContract
      : await getERCContract(_signer, "usdt");

    let allowedUSD = await allowance(_usd_contract, walletAddress);
    let allowedUSDt = await allowance(_usdt_contract, walletAddress);
    console.log("Allowed metrics ,", {
      allowedUSD,
      usdLiquidity,
      allowedUSDt,
      usdtLiquidity,
    });
    if (allowedUSD < usdLiquidity || allowedUSDt < usdtLiquidity) {
      if (allowedUSD < usdLiquidity) {
        setLoadingMessage("Approve Platform !");
        let res = await approve(
          _usd_contract,
          usdLiquidity - allowedUSD,
          () => {
            setLoadingMessage("Approving...");
          }
        );
        if (res) {
          alert("Successfully granted permission !");
        } else {
          setLoader(false);
          alert("Error in Approving !");
          return 0;
        }
      }

      if (allowedUSDt < usdtLiquidity) {
        alert("Platform is not allowed for trading enough USDt !");

        let res = await approve(
          _usdt_contract,
          usdtLiquidity - allowedUSDt,
          () => {
            setLoadingMessage("Approving...");
          }
        );

        if (res) {
          alert("Successfully granted permission !");
        } else {
          setLoader(false);
          alert("Error in Approving !");
          return 0;
        }
      }
    } else {
      alert("Platform is Allowed for trading tokens !");
    }
    setLoadingMessage("Adding liquidity..");

    await AddLiquidity(
      platformContract,
      usdLiquidity,
      usdtLiquidity,
      (isSuccess, errMessage) => {
        setLoader(false);
        setLoadingMessage(null);
        updateApp();
        isSuccess
          ? alert("Liquidity Added 🎉")
          : alert("Failed to add liquidity! " + errMessage);
      }
    );
  }

  async function removeLiquidity() {
    setLoader(true);

    await RemoveLiquidity(
      platformContract,
      parseEther(liquidityClaimAmount.toString()),
      () => {
        setLoadingMessage("Removing...");
      },
      () => {
        setLoader(false);
        updateApp();
        alert("Liquidity tokens Claimed !");
      }
    );
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
              <Heading fontSize={"18px"}>{"Balances "}</Heading>

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
                            <Button
                              disabled={Loader}
                              onClick={Swap}
                              colorScheme={"blue"}
                            >
                              {Loader ? "Trading..." : "Trade"}
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
                        onChange={(e) =>
                          setUsdLiquidity(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Enter USDT Amount</FormLabel>
                      <Input
                        type="number"
                        placeholder="0"
                        onChange={(e) => setUsdtLiquidity()}
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <Button
                        disabled={Loader}
                        onClick={addLiquidity}
                        colorScheme={"blue"}
                      >
                        {Loader ? loadingMessage : "Add Liquidity"}
                      </Button>
                    </FormControl>
                  </VStack>
                </TabPanel>
                <TabPanel justifyItems={"space-between"}>
                  <Heading>Remove liquidty </Heading>

                  <VStack height={"40vh"} spacing={10}>
                    <FormControl mt={4}>
                      <FormLabel>Enter Shares to claim</FormLabel>
                      <Input
                        type="number"
                        placeholder={liquidityBalance.toFixed(2)}
                        defaultValue={liquidityBalance}
                        onChange={(e) => {
                          let val = parseInt(e.target.value);
                          if (val <= liquidityBalance)
                            setLiquidityClaimAmount(val);
                          else {
                            alert("You do not have this much equity !");
                          }
                        }}
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <Button
                        disabled={Loader}
                        onClick={removeLiquidity}
                        colorScheme={"red"}
                      >
                        {Loader ? "Removing" : "Remove"} Liquidity
                        {Loader && "..."}
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
