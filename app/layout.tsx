import "./globals.css";
import { Inter, Silkscreen } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const silkscreen = Silkscreen({ weight: "400", subsets: ["latin"] });
export const metadata = {
  title: "Canto Testnet Faucet",
  description: "Used to get funds to work on canto testnet",
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
      </head>
      <body className={silkscreen.className}>{children}</body>
    </html>
  );
}
