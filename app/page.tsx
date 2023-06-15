import FundsUI from "./fundComponent";
import styles from "./page.module.css";
import { ethers } from "ethers";
import abi from "../app/config/faucetABI.json";

export default function Home() {
  async function sendFunds(formData: any) {
    "use server";

    //ethers provider using RPC URL
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY is not defined");
    }
    //ethers signer using private key
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const FaucetContract = new ethers.Contract(
      "0xDFd5Fab8372F5E92CC09A6a519cbAb1F97438cad",
      abi,
      signer
    );
    console.log(formData.tokens.note);
    try {
      const tx = await FaucetContract.getNamesTokens(
        formData.address,
        ethers.parseUnits("10", 18),
        formData.tokens.note,
        formData.tokens.usdc,
        formData.tokens.usdt,
        formData.tokens.eth,
        formData.tokens.atom
      );
    } catch (error: any) {
      console.error(error.info.error.message);
    }
  }
  return (
    <main className={styles.main}>
      <FundsUI onSumbit={sendFunds} />
    </main>
  );
}
