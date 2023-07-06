"use client";

import { Checkbox } from "./components/Checkbox/Checkbox";
import styles from "./page.module.css";
import Image from "next/image";
import { PT_Mono } from "next/font/google";
import React, { createRef, useEffect, useRef } from "react";
import { sendFunds } from "./actions";
import { ethers, isAddress } from "ethers";
import { abi, tokens as tokensConfig } from "./config/tokens";
import ReCAPTCHA from "react-google-recaptcha";

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

  const [captcha, setCaptcha] = React.useState("");

  const [balanceStatus, setBalanceStatus] = React.useState<
    "NONE" | "LOADING" | "SUCCESS" | "ERROR"
  >("NONE");

  const [balTokens, setBalTokens] = React.useState<Record<string, string>>({
    atom: "0",
    eth: "0",
    usdc: "0",
    usdt: "0",
    note: "0",
    canto: "0",
  });
  const [onSuccess, setOnSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("Request Funds");

  //connect wallet
  async function getBalances() {
    //connecting to testnet
    const provider = new ethers.JsonRpcProvider(
      "https://canto-testnet.plexnode.wtf"
    );

    //checking if address is valid
    if (ethers.isAddress(address)) {
      //checking balances per token every time a new block is validated
      provider.on("block", async (blockNumber) => {
        //map tokens to get balances promises
        const bal = tokensConfig.map(async (token) => {
          const contract = new ethers.Contract(token.address, abi, provider);
          const balance = await contract.balanceOf(address);
          return {
            [token.symbol.toLowerCase()]: ethers.formatUnits(
              balance,
              token.decimals
            ),
          };
        });

        //get balances from promises
        const balances = await Promise.all(bal);

        //reduce balances to one object
        const balanceReducer = balances.reduce((prev, curr) => {
          return { ...prev, ...curr };
        }, {});
        balanceReducer["canto"] = ethers.formatUnits(
          await provider.getBalance(address),
          18
        );
        //set balances
        setBalTokens(balanceReducer);
        setBalanceStatus("SUCCESS");
      });
    } else {
      setIsValidAddress(ethers.isAddress(address));
    }
  }

  //add canto test network
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
  const [totalSelectedTokens, setTotalSelectedTokens] = React.useState(0);
  //check if any token is selected
  useEffect(() => {
    if (balanceStatus === "SUCCESS") {
      //check if any token is selected
      setTotalSelectedTokens(
        Object.values(tokens).filter((token) => token === true).length
      );

      console.log(totalSelectedTokens);
      //if no token is selected prevent default
      if (Object.values(tokens).filter((token) => token === true).length == 0) {
        setMessage("Select atleast one token");
      } else {
        setMessage("Request Funds");
      }
    }
  }, [tokens, balanceStatus, totalSelectedTokens]);

  //format token balance to currency
  function formatCurrency(value: string): string {
    if (Number(value) < 1 && Number(value) > 0) {
      return Number(value).toFixed(4);
    }
    if (Number(value) >= 1 && Number(value) < 10000) {
      return Number(value).toFixed(2);
    }
    if (Number(value) >= 10000 && Number(value) < 1000000) {
      return (Number(value) / 1000).toFixed(2) + "k";
    }
    if (Number(value) >= 1000000) {
      return (Number(value) / 1000000).toFixed(2) + "m";
    }
    return value;
  }

  return (
    <div className={styles.card}>
      <h2 className="title">Canto Testnet Faucet</h2>
      <Image src="/logo.svg" alt="canto" width={100} height={60} />

      {onSuccess ? (
        <>
          <div className={styles["balance-container"]}>
            <div className={styles["balance-grid"]}>
              <div className={styles.item}>
                <div>Atom : </div>
                <span className={styles["item-balance"]}>
                  {balTokens["atom"]}
                </span>
              </div>
              <div className={styles.item}>
                <div>ETH : </div>
                <span className={styles["item-balance"]}>
                  {formatCurrency(balTokens.eth)}
                </span>
              </div>
              <div className={styles.item}>
                <div>USDC : </div>
                <span className={styles["item-balance"]}>
                  {formatCurrency(balTokens.usdc)}
                </span>
              </div>
              <div className={styles.item}>
                <div>USDT : </div>
                <span className={styles["item-balance"]}>
                  {formatCurrency(balTokens.usdt)}
                </span>
              </div>
              <div className={styles.item}>
                <div>Canto : </div>
                <span className={styles["item-balance"]}>
                  {formatCurrency(balTokens.canto)}
                </span>
              </div>
              <div className={styles.item}>
                <div>Note : </div>
                <span className={styles["item-balance"]}>
                  {formatCurrency(balTokens.note)}
                </span>
              </div>
            </div>
          </div>
          <p>
            Thanks for using our test. Please return the funds once you are done
            testing.
          </p>
        </>
      ) : (
        <>
          <div className={styles.row}>
            <button className={styles.button} onClick={addTokens}>
              import tokens
            </button>
            <button className={styles.button} onClick={addTestNetwork}>
              add network
            </button>
          </div>
          <form
            action={() => {
              console.log("sending funds");
              sendFunds({ address, tokens, captcha }).then((res) => {
                setLoading(false);
                if (res.status === 200) {
                  setOnSuccess(true);
                  setMessage("Funds Sent");
                } else {
                  console.log(res.message);
                  setMessage(res.message);
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
                  <span className={styles["item-balance"]}>
                    {balTokens["atom"]}
                  </span>
                </div>
                <div className={styles.item}>
                  <div>ETH : </div>
                  <span className={styles["item-balance"]}>
                    {formatCurrency(balTokens.eth)}
                  </span>
                </div>
                <div className={styles.item}>
                  <div>USDC : </div>
                  <span className={styles["item-balance"]}>
                    {formatCurrency(balTokens.usdc)}
                  </span>
                </div>
                <div className={styles.item}>
                  <div>USDT : </div>
                  <span className={styles["item-balance"]}>
                    {formatCurrency(balTokens.usdt)}
                  </span>
                </div>
                <div className={styles.item}>
                  <div>Canto : </div>
                  <span className={styles["item-balance"]}>
                    {formatCurrency(balTokens.canto)}
                  </span>
                </div>
                <div className={styles.item}>
                  <div>Note : </div>
                  <span className={styles["item-balance"]}>
                    {formatCurrency(balTokens.note)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.recap}>
              <ReCAPTCHA
                //   size="invisible"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
                onChange={(e) => {
                  setCaptcha(e ?? "");
                }}
              />
            </div>
            <input
              className={styles.button}
              style={{
                minWidth: "100%",
              }}
              type="submit"
              value={
                !ethers.isAddress(address)
                  ? "Enter Address"
                  : captcha.length < 10
                  ? "Complete Captcha"
                  : balanceStatus === "NONE"
                  ? "Get Balances"
                  : balanceStatus === "LOADING"
                  ? "fetching..."
                  : loading
                  ? "Sending..."
                  : message
              }
              disabled={
                !ethers.isAddress(address) ||
                captcha.length < 10 ||
                balanceStatus === "LOADING" ||
                (balanceStatus === "SUCCESS" && totalSelectedTokens <= 0)
              }
              onClick={(e) => {
                if (balanceStatus !== "SUCCESS") {
                  e.preventDefault();
                  setBalanceStatus("LOADING");
                  getBalances();
                } else {
                  //if no token is selected prevent default
                  if (totalSelectedTokens <= 0) {
                    e.preventDefault();
                  }
                  setLoading(true);
                }
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
        </>
      )}
    </div>
  );
}
