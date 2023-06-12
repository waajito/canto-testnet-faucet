"use client";

import { Checkbox } from "./components/Checkbox/Checkbox";
import styles from "./page.module.css";
import Image from "next/image";
import { PT_Mono } from "next/font/google";
import React from "react";

const ptMono = PT_Mono({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const [address, setAddress] = React.useState("");
  const [tokens, setTokens] = React.useState([]);
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2 className="title">Canto Testnet Faucet</h2>
        <Image src="/logo.svg" alt="canto" width={100} height={60} />
        <form action="" method="post">
          <input
            className={styles.input}
            type="text"
            name="address"
            id="address"
            placeholder="Enter The Address"
            autoComplete="off"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className={styles["tokens-grid"]}>
            <div className={styles.item}>
              <div className="token-name">ATOM</div>

              <Checkbox label="ATOM" onChange={() => {}} />
            </div>
            <div className={styles.item}>
              <div className="token-name">ETH</div>

              <Checkbox label="ETH" onChange={() => {}} />
            </div>

            <div className={styles.item}>
              <div className="token-name">USDC</div>

              <Checkbox label="USDC" onChange={() => {}} />
            </div>
          </div>

          <div className={styles["tokens-grid"]}>
            <div className={styles.item}>
              <div className="token-name">USDT</div>

              <Checkbox label="USDT" onChange={() => {}} />
            </div>
            <div className={styles.item}>
              <div className="token-name">NOTE</div>

              <Checkbox label="NOTE" onChange={() => {}} />
            </div>
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={address.length < 15}
          >
            Request Funds
          </button>
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
    </main>
  );
}
