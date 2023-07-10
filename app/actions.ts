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

  //contract instance
  const FaucetContract = new Contract(
    "0x53f378F4a4bbc427C1860e5736127128F33b03Ad",
    abi,
    signer
  );

  try {
    // verify captcha
    const verificationStatus = await (
      await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        body: `secret=${process.env.PRIVATE_RECAPTCHA_KEY}&response=${formData.captcha}`,
      })
    ).json();

    if (!verificationStatus.success) {
      return {
        status: 500,
        message: "Captcha verification failed",
      };
    }

    await FaucetContract.getNamedTokens(
      formData.address,
      ethers.parseUnits("100", 18),
      formData.tokens.note,
      formData.tokens.usdc,
      formData.tokens.usdt,
      formData.tokens.eth,
      formData.tokens.atom,
      formData.tokens.canto
    );
    return {
      status: 200,
      message: "Sent funds successfully",
    };
  } catch (error: any) {
    // if error contains "FAUCET::Not enough of token: invalid request" then return "we are running low on funds"
    if (JSON.stringify(error).includes("FAUCET::Not enough of token")) {
      return {
        status: 500,
        message: "We are running low on funds",
      };
    }

    return {
      status: 500,
      message: JSON.stringify(error).split("::")[1],
    };
  }
}
