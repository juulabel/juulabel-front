import QueryProvider from "@/_lib/Provider/QueryProvider";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { MSWComponent } from "@/_lib/Provider/MockProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "주라벨",
  description: "우리술, 우리에게 자부심이 되도록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex justify-center items-center ">
          <QueryProvider>
            <MSWComponent>{children}</MSWComponent>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
