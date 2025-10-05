import type { Metadata, Viewport } from "next";
import "./index.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
// import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 확대/축소 방지 메타 태그 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        />
        {/* iOS Safari 확대/축소 방지 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-touch-fullscreen" content="yes" />
        {/* 카카오 SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
        />
        <Script src="https://developers.kakao.com/sdk/js/kakao.js"></Script>
        {/* 네이버 맵 API는 동적으로 로드됩니다 */}

        {/* 확대/축소 방지 JavaScript */}
        <Script
          id="prevent-zoom"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // 터치 이벤트로 인한 확대/축소 방지
              document.addEventListener('touchstart', function(event) {
                if (event.touches.length > 1) {
                  event.preventDefault();
                }
              }, { passive: false });
              
              document.addEventListener('touchmove', function(event) {
                if (event.touches.length > 1) {
                  event.preventDefault();
                }
              }, { passive: false });
              
              // 더블탭 확대 방지
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function(event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, false);
              
              // 키보드 확대/축소 방지 (Ctrl + +/-)
              document.addEventListener('keydown', function(event) {
                if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=' || event.keyCode === 187 || event.keyCode === 189)) {
                  event.preventDefault();
                }
              });
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
