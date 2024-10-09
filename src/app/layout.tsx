import { MSWComponent } from "@/_components/MSWComponent";
import { AuthProvider } from "@/_lib/Provider/AuthProvider";
import QueryProvider from "@/_lib/Provider/QueryProvider";
import ToastProvider from "@/_lib/Provider/ToastProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
      <body className={`${pretendard.variable} h-screen`}>
        <div className="flex h-full items-center justify-center">
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <MSWComponent>{children}</MSWComponent>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
