"use client";

import { Checkbox } from "./components/Checkbox/Checkbox";
import styles from "./page.module.css";
import Image from "next/image";
import { PT_Mono } from "next/font/google";
import React from "react";
const ptMono = PT_Mono({ weight: "400", subsets: ["latin"] });

interface Props {
  onSubmit: (data: any) => void;
}
export default function FundsUI(props: Props) {
  const [address, setAddress] = React.useState("");
  const [tokens, setTokens] = React.useState({
    atom: false,
    eth: false,
    usdc: false,
    usdt: false,
    note: false,
    canto: false,
  });

  const [loading, setLoading] = React.useState(false);

  const isAddress = (address: string) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
    } else if (
      /^(0x)?[0-9a-f]{40}$/.test(address) ||
      /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
      // If it's all small caps or all all caps, return true
      return true;
    }
    return false;
  };

  return (
    <div className={styles.card}>
      <h2 className="title">Canto Testnet Faucet</h2>
      <Image src="/logo.svg" alt="canto" width={100} height={60} />
      <form action={props.onSubmit}>
        <input
          className={styles.input}
          type="text"
          name="address"
          id="address"
          placeholder="Enter The Address"
          autoComplete="off"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className={styles["tokens-grid"]}>
          <div className={styles.item}>
            <div className="token-name">ATOM</div>

            <Checkbox
              label="ATOM"
              onChange={() => {
                setTokens({
                  ...tokens,
                  atom: !tokens.atom,
                });
              }}
            />
          </div>
          <div className={styles.item}>
            <div className="token-name">ETH</div>

            <Checkbox
              label="ETH"
              onChange={() => {
                setTokens({
                  ...tokens,
                  eth: !tokens.eth,
                });
              }}
            />
          </div>

          <div className={styles.item}>
            <div className="token-name">USDC</div>

            <Checkbox
              label="USDC"
              onChange={() => {
                setTokens({
                  ...tokens,
                  usdc: !tokens.usdc,
                });
              }}
            />
          </div>
        </div>

        <div className={styles["tokens-grid"]}>
          <div className={styles.item}>
            <div className="token-name">USDT</div>

            <Checkbox
              label="USDT"
              onChange={() => {
                setTokens({
                  ...tokens,
                  usdt: !tokens.usdt,
                });
              }}
            />
          </div>
          <div className={styles.item}>
            <div className="token-name">Canto</div>

            <Checkbox
              label="Canto"
              onChange={() => {
                setTokens({
                  ...tokens,
                  canto: !tokens.canto,
                });
              }}
            />
          </div>
          <div className={styles.item}>
            <div className="token-name">NOTE</div>

            <Checkbox
              label="NOTE"
              onChange={() => {
                setTokens({
                  ...tokens,
                  note: !tokens.note,
                });
              }}
            />
          </div>
        </div>
        <div className={styles["balance-container"]}>
          <div className={styles["balance-grid"]}>
            <div className={styles.item}>
              <div>Atom : </div>
              <span className={styles["item-balance"]}>0.00</span>
            </div>
            <div className={styles.item}>
              <div>ETH : </div>
              <span className={styles["item-balance"]}>0.00</span>
            </div>
            <div className={styles.item}>
              <div>USDC : </div>
              <span className={styles["item-balance"]}>0.00</span>
            </div>
          </div>
          <div className={styles["balance-grid"]}>
            <div className={styles.item}>
              <div>USDT : </div>
              <span className={styles["item-balance"]}>0.00</span>
            </div>
            <div className={styles.item}>
              <div>Canto : </div>
              <span className={styles["item-balance"]}>0.00</span>
            </div>
            <div className={styles.item}>
              <div>Note : </div>
              <span className={styles["item-balance"]}>0.00</span>
            </div>
          </div>
        </div>

        <input
          className={styles.button}
          type="submit"
          value={loading ? "Sending..." : " Request Funds"}
          disabled={address.length < 15}
          onClick={(e) => {
            // e.preventDefault();
            console.log("submitting");

            setLoading(true);
            // props.onSubmit({ address, tokens });
          }}
        />
      </form>

      <p className={styles.description}>
        if you’d like to return the funds please send them over to{" "}
        <span
          style={{
            color: "#06fc99",
          }}
        >
          0x4A2812DAf2432EAD79D2c20Ba84d65CbfA524A4D
        </span>
      </p>
    </div>
  );
}
