import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";

let ERC20Abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
let AMM_abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "_burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "_mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount2",
        type: "uint256",
      },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenIn",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    name: "swap",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token2",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
let usd_deployedAddress = "0x9634CFB05682Ce0cfbbF34298532DeCe9FaAFEc4";
let usdt_deployedAddress = "0x947Afe39bcda41df6AaA9c0925EEADb1a27474B0";
let SwapStream_DeployedContractAddress =
  "0xF099D5bA8d7E203aaF16cEE70006523fe16F269E";

export async function getSigner() {
  if (window.ethereum) {
    // console.log("ethereum provider exists");
  } else {
    alert("Please install or Unlock metamask First !");
    return 0;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();

  return signer;
}

export async function getERCContract(signer, contractName, setter) {
  let contract;
  if (contractName == "usdt") {
    contract = new ethers.Contract(usdt_deployedAddress, ERC20Abi, signer);
  } else if (contractName == "usd") {
    contract = new ethers.Contract(usd_deployedAddress, ERC20Abi, signer);
  } else {
    return null;
  }
  if (setter) {
    setter(contract);
  }
  return contract;
}

export async function getPlatformContract(signer, setter) {
  let contract = new ethers.Contract(
    SwapStream_DeployedContractAddress,
    AMM_abi,
    signer
  );
  if (setter) {
    setter(contract);
  }
  return contract;
}

export async function swap(contract, tokenIn, amount, updator) {
  try {
    let tokenAddress;
    if (tokenIn == "usd") {
      tokenAddress = usd_deployedAddress;
    } else if (tokenIn == "usdt") {
      tokenAddress == usdt_deployedAddress;
    }
    let res = await contract?.swap(tokenAddress, amount);
    await res.wait();
    updator();
  } catch (e) {
    console.log(e);
    updator();
    return 0;
  }
}

export async function approve(contract, desiredAmount, updator) {
  try {
    let res = await contract?.approve(
      SwapStream_DeployedContractAddress,
      parseEther(desiredAmount.toString())
    );
    updator();
    await res.wait();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function allowance(contract, address, desiredAmount) {
  try {
    let res = await contract?.allowance(
      address,
      SwapStream_DeployedContractAddress
    );
    res = parseInt(res);
    console.log("allowed tokens are ", res);
    res = res / 10 ** 18;
    console.log("ETH :allowed tokens are ", res);
    return res;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function getBalance(contract, userAddress, label, setter) {
  try {
    let bal = await contract?.balanceOf(userAddress);
    bal = parseInt(bal);
    bal = bal / 10 ** 18;
    // console.log("balance of " + label + " is ", bal);

    if (setter) setter(bal);
    return bal;
  } catch (e) {
    console.log(e);

    return 0;
  }
}

export async function AddLiquidity(contract, amount1, amount2, updator) {
  try {
    let res = await contract?.addLiquidity(
      parseEther(amount1.toString()),
      parseEther(amount2.toString()),
      {}
    );
    await res.wait();
    updator(true);
  } catch (e) {
    console.log({ e });
    updator(false, e.reason);

    return 0;
  }
}

export async function RemoveLiquidity(
  contract,
  shares,
  intermediateUpdator,
  updator
) {
  try {
    let res = await contract?.removeLiquidity(shares);
    intermediateUpdator();

    await res.wait();
    updator();
  } catch (e) {
    console.log(e);
    updator();

    return 0;
  }
}
