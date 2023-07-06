import Image from "next/image";
import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

const image = fetch(new URL("../..public/bg.png", import.meta.url)).then(
  (res) => res.arrayBuffer()
);

export async function GET() {
  const imageData = await image;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* @ts-ignore */}
        <img width="256" height="256" src={imageData} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
