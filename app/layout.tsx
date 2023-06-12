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
      <body className={silkscreen.className}>{children}</body>
    </html>
  );
}
