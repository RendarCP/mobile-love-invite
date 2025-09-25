import type { Metadata, Viewport } from "next";
import "./index.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
// import "./globals.css";

export const metadata: Metadata = {
  title: "성욱 ♥ 회진 결혼식에 초대합니다",
  description: "성욱 ❤︎ 회진",
  keywords: "결혼식, 청첩장, 성욱, 회진, 2025, 상록아트홀",
  authors: [{ name: "성욱 & 회진" }],
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "성욱 ♥ 회진 결혼식에 초대합니다",
    description: "성욱 ❤︎ 회진",
    images: [
      {
        url: "/images/KSC03250_s-1.jpg",
        width: 1200,
        height: 630,
        alt: "성욱과 회진의 결혼식 청첩장",
      },
    ],
    type: "website",
    siteName: "성욱 ♥ 회진 결혼식",
  },
  twitter: {
    card: "summary_large_image",
    title: "성욱 ♥ 회진 결혼식에 초대합니다",
    description: "성욱 ❤︎ 회진",
    images: ["/images/KSC03250_s-1.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 카카오 SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
        />
        <Script src="https://developers.kakao.com/sdk/js/kakao.js"></Script>
        {/* 네이버 맵 API는 동적으로 로드됩니다 */}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
