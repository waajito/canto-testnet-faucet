import "./globals.css";
import { Inter, Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({ weight: "400", subsets: ["latin"] });
export const metadata = {
  title: "Canto Testnet Faucet",
  description:
    "Developers can request testnet tokens through the Canto Testnet Faucet, which allows them to test their dapp projects on the Canto testnet. This is particularly useful for testing smart contracts and other blockchain-related functionality.",
  keywords: [
    "canto",
    "testnet",
    "faucet",
    "testnet faucet",
    "canto testnet faucet",
    "canto faucet",
    "canto testnet",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className={silkscreen.className}>{children}</body>
    </html>
  );
}
