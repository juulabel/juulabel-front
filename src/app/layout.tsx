import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import NotificationProvider from "@/_components/notification/NotificationProvider";
import GTMRouteTracker from "@/_common/GTMRouteTracker";
import Loading from "@/_common/Loading";
import { AuthProvider } from "@/_lib/Provider/AuthProvider";
import QueryProvider from "@/_lib/Provider/QueryProvider";
import ToastProvider from "@/_lib/Provider/ToastProvider";
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
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
        </Script>
      </head>
      <body className={`${pretendard.variable} h-screen`}>
        <Suspense fallback={<Loading />}>
          <GTMRouteTracker />
        </Suspense>
        <div className="flex h-full items-center justify-center">
          <QueryProvider>
            <ToastProvider>
              <AuthProvider>
                <NotificationProvider>{children}</NotificationProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </div>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      </body>
    </html>
  );
}
