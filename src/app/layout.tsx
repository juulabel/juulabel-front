import ServiceWorkerRegistration from "@/_components/ServiceWorkerRegistration";
import NotificationProvider from "@/_components/notification/NotificationProvider";
import { AuthProvider } from "@/_lib/Provider/AuthProvider";
import QueryProvider from "@/_lib/Provider/QueryProvider";
import ToastProvider from "@/_lib/Provider/ToastProvider";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const pretendard = localFont({
  src: "fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF843F",
};

export const metadata: Metadata = {
  title: "주라벨",
  description: "우리술, 우리에게 자부심이 되도록",
  icons: [
    { rel: "icon", url: "/app/favicon.svg" },
    { rel: "apple-touch-icon", url: "/app/favicon.svg" },
  ],
  applicationName: "주라벨",
  formatDetection: {
    telephone: false,
  },
  manifest: "/app/manifest.json",
  other: {
    "msapplication-TileColor": "#FF843F",
    "msapplication-tap-highlight": "no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} h-screen`}>
        <div className="flex h-full items-center justify-center">
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <NotificationProvider>{children}</NotificationProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </div>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
