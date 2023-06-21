"use server";

import { ethers, Contract, Wallet } from "ethers";
import abi from "../app/config/faucetABI.json";

export async function sendFunds(formData: any): Promise<{
  status: number;
  message: string;
}> {
  //ethers provider using RPC URL
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not defined");
  }
  //ethers signer using private key
  const signer = new Wallet(process.env.PRIVATE_KEY, provider);

  const FaucetContract = new Contract(
    "0x53f378F4a4bbc427C1860e5736127128F33b03Ad",
    abi,
    signer
  );
  try {
    await FaucetContract.getNamedTokens(
      formData.address,
      ethers.parseUnits("10", 18),
      formData.tokens.note,
      formData.tokens.usdc,
      formData.tokens.usdt,
      formData.tokens.eth,
      formData.tokens.atom,
      formData.tokens.canto
    );
    return {
      status: 200,
      message: "sent funds successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error,
    };
  }
}
