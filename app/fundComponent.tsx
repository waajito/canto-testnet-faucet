"use client";

import { Checkbox } from "./components/Checkbox/Checkbox";
import styles from "./page.module.css";
import Image from "next/image";
import { PT_Mono } from "next/font/google";
import React from "react";
import { sendFunds } from "./actions";
import { ethers } from "ethers";
import { abi, tokens as tokensConfig } from "./config/tokens";
const ptMono = PT_Mono({ weight: "400", subsets: ["latin"] });

export default function FundsUI() {
  const [address, setAddress] = React.useState("");
  const [isValidAddress, setIsValidAddress] = React.useState(false);
  const [tokens, setTokens] = React.useState({
    atom: false,
    eth: false,
    usdc: false,
    usdt: false,
    note: false,
    canto: false,
  });

  const [balTokens, setBalTokens] = React.useState({
    atom: "0",
    eth: "0",
    usdc: "0",
    usdt: "0",
    note: "0",
    canto: "0",
  });

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("Request Funds");

  //connect wallet
  const getBalances = async () => {
    console.log(balTokens);

    const provider = new ethers.JsonRpcProvider(
      "https://canto-testnet.plexnode.wtf"
    );

    if (ethers.isAddress(address)) {
      provider.on("block", (blockNumber) => {
        tokensConfig.forEach((token) => {
          const contract = new ethers.Contract(token.address, abi, provider);

          contract.balanceOf(address).then((balance) => {
            console.log(
              token.name + " : " + ethers.formatUnits(balance, token.decimals)
            );
            setBalTokens({
              ...balTokens,
              [token.symbol.toLowerCase()]: ethers.formatUnits(
                balance,
                token.decimals
              ),
            });

            console.log({
              ...balTokens,
              [token.symbol.toLowerCase()]: ethers.formatUnits(
                balance,
                token.decimals
              ),
            });
          });
        });
        console.log(balTokens);
      });
    } else {
      setIsValidAddress(ethers.isAddress(address));
    }
  };

  async function addTestNetwork() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1E15" }],
        });
      } catch (error: any) {
        console.log(error.code);
        if (error.code === 4902) {
          window.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1E15",
                  rpcUrls: ["https://canto-testnet.plexnode.wtf"],
                  chainName: "Canto Testnet",
                  nativeCurrency: {
                    name: "Canto Coin",
                    symbol: "CANTO",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://testnet.tuber.build"],
                },
              ],
            })

            .catch((error: unknown) => {
              console.error(error);
            });
        }
      }
    }
  }

  //func to add testnet tokens to metamask
  async function addTokens() {
    for (const tokenObj of tokensConfig) {
      try {
        if (tokenObj.symbol != "Canto") {
          //@ts-ignore
          ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20", // Initially only supports ERC20, but eventually more!
              options: {
                address: tokenObj.address, // The address that the token is at.
                symbol: tokenObj.symbol.slice(0, 11), // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenObj.decimals, // The number of decimals in the token
                image: tokenObj.logoURI, // A string url of the token logo
              },
            },
          });
        }
      } catch (error) {
        // console.log(error)
      }
    }
  }
  return (
    <div className={styles.card}>
      <h2 className="title">Canto Testnet Faucet</h2>
      <Image src="/logo.svg" alt="canto" width={100} height={60} />

      <div className="row">
        <button
          className={styles.button}
          style={{
            minWidth: "10rem",
          }}
          onClick={addTokens}
        >
          import test tokens
        </button>
        <button
          className={styles.button}
          style={{
            minWidth: "10rem",
          }}
          onClick={addTestNetwork}
        >
          add network
        </button>
        <button
          className={styles.button}
          style={{
            minWidth: "10rem",
          }}
          onClick={getBalances}
        >
          get balances
        </button>
      </div>
      <form
        action={() => {
          sendFunds({ address, tokens }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
              setMessage("Funds Sent");
            } else {
              setMessage("Something went wrong");
            }
          });
        }}
      >
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
              <span className={styles["item-balance"]}>{balTokens.atom}</span>
            </div>
            <div className={styles.item}>
              <div>ETH : </div>
              <span className={styles["item-balance"]}>{balTokens.eth}</span>
            </div>
            <div className={styles.item}>
              <div>USDC : </div>
              <span className={styles["item-balance"]}>{balTokens.usdc}</span>
            </div>
          </div>
          <div className={styles["balance-grid"]}>
            <div className={styles.item}>
              <div>USDT : </div>
              <span className={styles["item-balance"]}>{balTokens.usdt}</span>
            </div>
            <div className={styles.item}>
              <div>Canto : </div>
              <span className={styles["item-balance"]}>{balTokens.canto}</span>
            </div>
            <div className={styles.item}>
              <div>Note : </div>
              <span className={styles["item-balance"]}>{balTokens.note}</span>
            </div>
          </div>
        </div>

        <input
          className={styles.button}
          type="submit"
          value={loading ? "Sending..." : message}
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
