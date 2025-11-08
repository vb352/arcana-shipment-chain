import { BrowserProvider, Contract, ContractFactory, formatUnits, parseUnits } from "ethers";

// Arc Testnet Configuration
export const ARC_TESTNET = {
  chainId: "0x4CEF52", // 5041234 in hex
  chainName: "Arc Testnet",
  rpcUrls: ["https://rpc.testnet.arc.network"],
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
export const USDC_DECIMALS = 6;

export const connectWallet = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  
  return accounts[0];
};

export const addArcTestnet = async (): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [ARC_TESTNET],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      throw new Error("Please add Arc Testnet to MetaMask manually");
    }
    throw error;
  }
};

export const switchToArcTestnet = async (): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARC_TESTNET.chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await addArcTestnet();
    } else {
      throw error;
    }
  }
};

export const deployEscrowContract = async (
  abi: any[],
  bytecode: string,
  depositor: string,
  beneficiary: string,
  agent: string,
  amount: string // 6 decimal places
): Promise<string> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const factory = new ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy(
    depositor,
    beneficiary,
    agent,
    parseUnits(amount, USDC_DECIMALS),
    USDC_ADDRESS
  );
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  return address;
};

export const sendTransaction = async (to: string, data: string, value?: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const tx = await signer.sendTransaction({
    to,
    data,
    value: value ? parseUnits(value, 18) : undefined,
  });
  
  await tx.wait();
  return tx.hash;
};

export const formatUSDC = (amount: string): string => {
  return formatUnits(amount, USDC_DECIMALS);
};

export const parseUSDC = (amount: string): string => {
  return parseUnits(amount, USDC_DECIMALS).toString();
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
