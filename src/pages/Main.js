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
import InstructionStep from "./components/InstructionStep";
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
  const [testInstructionsReaded, setTestInstructionsReaded] = useState(false);
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

  async function handleAllowance(
    _contract,
    allowedTokens,
    desiredAmount,
    label,
    postAllowance
  ) {
    console.log("Allowed metrics ,", {
      allowedTokens,
      desiredAmount,
      label,
    });

    if (allowedTokens < desiredAmount) {
      setLoadingMessage("Approve Platform !");
      let res = await approve(_contract, desiredAmount - allowedTokens, () => {
        setLoadingMessage("Approving...");
      });
      if (res) {
        alert("Successfully granted permission !");
        if (postAllowance) postAllowance();
      } else {
        setLoader(false);
        alert("Error in Approving !");
        return 0;
      }
    } else {
      if (postAllowance) {
        postAllowance();
      }
    }
  }
  async function Swap() {
    if (!platformContract) {
      await getPlatformContract();
    }
    setLoader(true);

    let _signer = await getSigner();
    let _contract = await getERCContract(_signer, sourceToken);
    let allowedTokens = await allowance(_contract, walletAddress);
    let res = await handleAllowance(
      _contract,
      allowedTokens,
      swapAmount,
      sourceToken,
      async () => {
        await swap(
          platformContract,
          sourceToken,
          swapAmount,
          () => {
            setLoadingMessage("Swapping...");
          },
          () => {
            setLoader(false);
            updateApp();
            alert("Tokens Swapped!");
          }
        );
      }
    );
  }
  async function addLiquidity() {
    setLoader(true);

    if (!platformContract) {
      setLoadingMessage("Preparing...");
      await fetchContracts();
    }

    let _signer = await getSigner();

    let _usd_contract = await getERCContract(_signer, "usd");
    let _usdt_contract = await getERCContract(_signer, "usdt");

    let allowedUSD = await allowance(_usd_contract, walletAddress);
    let allowedUSDt = await allowance(_usdt_contract, walletAddress);
    if (allowedUSD < usdLiquidity || allowedUSDt < usdtLiquidity) {
      await handleAllowance(_usd_contract, allowedUSD, usdLiquidity, "usd");
      await handleAllowance(_usdt_contract, allowedUSDt, usdtLiquidity, "usdt");
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
      liquidityClaimAmount,
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

        {walletAddress && !testInstructionsReaded && (
          <VStack padding={"10vh"}>
            <InstructionStep
              number={1}
              text={"Make Sure you have some MATIC in your Wallet"}
            />
            <InstructionStep
              number={2}
              text={`Mint some USDs from the contract address 0x9634CFB05682Ce0cfbbF34298532DeCe9FaAFEc4`}
            />
            <InstructionStep
              number={3}
              text={`Mint some USDTs from the contract address 0x947Afe39bcda41df6AaA9c0925EEADb1a27474B0`}
            />
            <FormControl mt={4}>
              <Button
                disabled={Loader}
                onClick={() => {
                  setTestInstructionsReaded(true);
                }}
                colorScheme={"blue"}
              >
                Get Started
              </Button>
            </FormControl>
          </VStack>
        )}
        {testInstructionsReaded && walletAddress && (
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
                              onChange={(e) =>
                                setSwapAmount(parseInt(e.target.value))
                              }
                            />
                          </FormControl>

                          <FormControl mt={4}>
                            <Button
                              disabled={Loader}
                              onClick={Swap}
                              colorScheme={"blue"}
                            >
                              {Loader ? loadingMessage : "Trade"}
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
