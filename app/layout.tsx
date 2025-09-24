import type { Metadata, Viewport } from "next";
import "./index.css";
import Script from "next/script";
// import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: "성욱 ♥ 회진 결혼식에 초대합니다",
  description:
    "2025년 12월 27일 상록아트홀에서 열리는 성욱과 회진의 결혼식에 초대합니다.",
  keywords: "결혼식, 청첩장, 성욱, 회진, 2025, 상록아트홀",
  authors: [{ name: "성욱 & 회진" }],
  icons: {
    icon: "/images/intro-flower01.png",
    shortcut: "/images/intro-flower01.png",
    apple: "/images/intro-flower01.png",
  },
  openGraph: {
    title: "성욱 ♥ 회진 결혼식에 초대합니다",
    description:
      "2025년 12월 27일 상록아트홀에서 열리는 성욱과 회진의 결혼식에 초대합니다.",
    images: ["/images/KSC03250_s-1.jpg"],
    type: "website",
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
      </body>
    </html>
  );
}
