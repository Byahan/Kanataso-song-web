"use client";

import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");

  useEffect(() => {
    const minTime = new Promise((res) => setTimeout(res, 800));

    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    const imagesReady = Promise.all(
      Array.from(document.images).map(
        (img) =>
          img.complete ||
          new Promise((res) => {
            img.onload = img.onerror = () => res(true);
          })
      )
    );

    Promise.all([minTime, fontsReady, imagesReady]).then(() => {
      setPhase("exit");
      setTimeout(() => setPhase("done"), 800);
    });
  }, []);

  return (
    <div className={poppins.variable}>
      {phase !== "done" && (
        <div className={`introOverlay ${phase === "exit" ? "exit" : ""}`}>
          <div className="introLogo">
            <Image
              src="/logo2.svg"
              alt="PPTenshi Logo"
              width={120}
              height={120}
              priority
            />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
