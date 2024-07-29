import QueryProvider from "@/_lib/Provider/QueryProvider";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/_lib/Provider/ToastProvider";
import "react-toastify/dist/ReactToastify.css";
import { MSWComponent } from "@/_components/MSWComponent";

const pretendard = localFont({
  src: "fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

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
    <html lang="kr">
      <body className={`${pretendard.variable}`}>
        <div className="flex items-center justify-center">
          <QueryProvider>
            <ToastProvider>
              <MSWComponent>{children}</MSWComponent>
            </ToastProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
