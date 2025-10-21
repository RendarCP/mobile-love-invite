"use client";

import { useState, useEffect } from "react";
import { Heart, Car, Train, Bus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import MoneyGift from "@/components/sections/MoneyGift";
import WeddingCalendar from "@/components/sections/WeddingCalendar";
import PhotoGallery from "@/components/sections/PhotoGallery";
import NaverMap from "@/components/sections/NaverMap";
import PhotoUpload from "@/components/sections/PhotoUpload";
import AttendanceCheck from "@/components/sections/AttendanceCheck";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

// 카카오톡 SDK 및 네이버 맵 확장 타입 정의
declare global {
  interface Window {
    naver: unknown;
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
      Navi?: {
        share: (options: {
          name: string;
          x: number;
          y: number;
          coordType: string;
        }) => void;
      };
    };
  }
}

/**
 * 모바일 청첩장 메인 앱 컴포넌트
 * 참고: https://mcard.fromtoday.co.kr/w/Hr9Hp3/
 */
export default function HomePage() {
  const weddingDate = new Date("2025-12-27T15:20:00");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // 웨딩홀 정보 (실제 좌표로 변경해주세요)
  const venueInfo = {
    name: "상록아트홀",
    address: "서울특별시 강남구 언주로 508(역삼동 701번지)",
    phone: "02-564-5757",
    latitude: 37.5039191,
    longitude: 127.0428353,
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, []);

  // 각 섹션별 스크롤 애니메이션 훅
  const greetingAnimation = useScrollAnimation({ delay: 0 });
  const mainPhotoAnimation = useScrollAnimation({ delay: 150 });
  const calendarAnimation = useScrollAnimation({ delay: 100 });
  const galleryAnimation = useScrollAnimation({ delay: 200 });
  const locationAnimation = useScrollAnimation({ delay: 100 });
  const attendanceAnimation = useScrollAnimation({ delay: 100 });
  const giftAnimation = useScrollAnimation({ delay: 150 });
  const uploadAnimation = useScrollAnimation({ delay: 100 });

  // API 초기화 및 뷰포트 최적화
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return;

    // 카카오 SDK 초기화
    const initKakaoSDK = () => {
      const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

      if (window.Kakao && kakaoAppKey) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoAppKey);
          console.log("카카오 SDK 초기화 완료:", window.Kakao.isInitialized());
        }

        // 카카오 내비 기능 확인
        if (window.Kakao.Navi) {
          console.log("카카오 내비 기능 사용 가능");
        } else {
          console.log("카카오 내비 기능 사용 불가");
        }
      } else if (!kakaoAppKey) {
        console.warn(
          "카카오 앱 키가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_KAKAO_APP_KEY를 설정해주세요."
        );
      } else {
        console.log("카카오 SDK 스크립트가 로드되지 않음. 재시도...");
        setTimeout(initKakaoSDK, 1000);
      }
    };

    // 네이버 맵 API 동적 로딩
    const loadNaverMapAPI = () => {
      const naverMapKey = process.env.NEXT_PUBLIC_NAVER_MAP_KEY;

      if (naverMapKey && !window.naver) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapKey}`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          console.log("네이버 맵 API 로드 완료");
        };

        script.onerror = () => {
          console.error("네이버 맵 API 로드 실패");
        };
      } else if (!naverMapKey) {
        console.warn(
          "네이버 맵 키가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_NAVER_MAP_KEY를 설정해주세요."
        );
      }
    };

    // 초기화 실행
    initKakaoSDK();
    loadNaverMapAPI();
  }, []);

  return (
    <div
      className="max-w-md mx-auto bg-white shadow-lg min-h-screen-mobile"
      suppressHydrationWarning
    >
      {/* 최상단 커버 섹션 - 이미지 스타일 */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "600px", maxHeight: "100dvh" }}
      >
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="/images/wedding.webp"
            alt="웨딩 커버 사진"
            width={400}
            height={600}
            className="w-full h-full object-cover image-mask select-none"
            loading="eager"
            decoding="async"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: "100%",
              WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)`,
              maskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              transform: "translateZ(0)",
              willChange: "auto",
              backfaceVisibility: "hidden",
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          />
        </div>

        {/* 비디오 오버레이 - screen blend mode */}
        <div id="video-overlay" className="absolute inset-0 z-8">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
            style={{ mixBlendMode: "screen" }}
          >
            <source src="/videos/light.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 중앙 날짜 */}
        <div
          id="center-text"
          className="absolute left-[45%] top-[15%]  flex items-center justify-center z-20"
        >
          <div className="text-center">
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider drop-shadow-2xl mb-3 opacity-0 date-slide-from-left date-delay-1 text-shadow">
              25
            </div>
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider -mt-6 drop-shadow-2xl mb-3 opacity-0 date-slide-from-right date-delay-2 text-shadow">
              12
            </div>
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider -mt-6 drop-shadow-2xl mb-3 opacity-0 date-slide-from-left date-delay-3 text-shadow">
              27
            </div>
          </div>
        </div>
      </section>
      {/* 하단 커플 정보 */}
      <div id="couple-info" className="text-center pb-8 px-6 pt-8">
        <h2 className="text-xl font-medium text-text-primary mb-2">
          성욱 | 회진
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          2025년 12월 27일 토요일 오후 3시 20분
          <br />
          상록아트홀 5층 아트홀
        </p>
      </div>

      {/* 인사말 섹션 */}
      <section
        id="greeting"
        ref={greetingAnimation.elementRef}
        className={`px-6 py-8 bg-white text-center scroll-slide-up ${
          greetingAnimation.isVisible ? "animate" : ""
        }`}
      >
        {/* 상단 장식 아이콘 */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <Heart className="w-6 h-6 text-wedding-primary" />
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-8">
          <div className="w-20 h-px bg-wedding-primary mx-auto"></div>
        </div>

        {/* INVITATION */}
        <div className="mb-6">
          <p className="text-xs text-text-secondary/60 tracking-widest mb-2">
            INVITATION
          </p>
          <h3 className="text-lg font-bold text-text-primary mb-4">
            소중한 분들을 초대합니다
          </h3>
        </div>

        {/* 하단 인사말 */}
        <div className="text-text-secondary leading-relaxed space-y-3 text-[13px] font-point">
          <p>
            함박눈 고운 겨울날,
            <br />
            저희 두 사람이 서로의 마음에 깊은 <br />
            <span className="text-wedding-primary">사랑</span>의 언약을하려
            합니다.
          </p>
          <p>
            <span className="text-wedding-primary">기쁨</span>이든{" "}
            <span className="text-wedding-primary">슬픔</span>이든 평생을 함께
            하며 <br /> 나눌 소중한 사랑.
          </p>
          <p>
            <span className="text-wedding-primary">축복</span>과 격려를
            전해주시면 더없는 <br /> 기쁨이겠습니다.
          </p>
        </div>
      </section>

      {/* 메인 헤더 - 이미지 스타일 */}
      <section
        ref={mainPhotoAnimation.elementRef}
        className={`relative bg-white scroll-slide-up-delay ${
          mainPhotoAnimation.isVisible ? "animate" : ""
        }`}
      >
        {/* 상단 날짜 */}
        <div id="top-date" className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-light text-text-primary tracking-wider mb-2">
            25 | 12 | 27
          </h1>
          <p className="text-text-secondary text-sm tracking-widest">
            SATURDAY
          </p>
        </div>

        {/* 메인 웨딩 사진 */}
        <div id="main-photo" className="px-6 mb-6">
          <div className="h-52 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/KSC03250_s-1.jpg"
              alt="웨딩 메인 사진"
              width={400}
              height={208}
              className="w-full h-full object-cover select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-medium text-text-primary mb-2">
            조경연 • 김혜경{" "}
            <span className="text-gray-500 text-sm">의 아들</span> 조성욱
          </h2>
          <h2 className="text-xl font-medium text-text-primary mb-2">
            양형교 • 박수진 <span className="text-gray-500 text-sm">의 딸</span>{" "}
            양회진
          </h2>
        </div>
      </section>

      {/* 웨딩 캘린더 섹션 */}
      <section
        id="wedding-calendar"
        ref={calendarAnimation.elementRef}
        className={`px-6 py-8 scroll-slide-up ${
          calendarAnimation.isVisible ? "animate" : ""
        }`}
      >
        <WeddingCalendar weddingDate={weddingDate} />
      </section>

      {/* 갤러리 섹션 */}
      <section
        id="gallery"
        ref={galleryAnimation.elementRef}
        className={`px-6 py-8  scroll-scale-up ${
          galleryAnimation.isVisible ? "animate" : ""
        }`}
      >
        <PhotoGallery />
      </section>

      {/* 장소 정보 섹션 */}
      <section
        id="location-info"
        ref={locationAnimation.elementRef}
        className={`px-6 py-8 bg-white scroll-slide-up ${
          locationAnimation.isVisible ? "animate" : ""
        }`}
      >
        <h2 className="text-xl font-bold text-text-primary text-center mb-6">
          오시는 길
        </h2>

        {/* 네이버 지도 */}
        <div id="naver-map" className="mb-6">
          <NaverMap
            latitude={venueInfo.latitude}
            longitude={venueInfo.longitude}
            venueName={venueInfo.name}
            venueAddress={venueInfo.address}
          />
        </div>

        {/* 교통편 안내 */}
        <div id="transport-info" className="space-y-4">
          <div className="flex items-start">
            <Train className="w-5 h-5 text-wedding-primary mt-1 mr-4" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">지하철</h4>
              <p className="text-text-secondary text-sm">
                2호선, 수인분당선 &ldquo;선릉역&rdquo; 5번 출구 도보 5분
                <br />
                셔틀버스: 선릉역 5번 출구에서 운행
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Bus className="w-5 h-5 text-wedding-primary mt-1 mr-4" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">버스</h4>
              <p className="text-text-secondary text-sm">
                KT 강남지사 하차: 141(도봉산), 242(중랑,신내역), 361(여의도)
                <br />
                한국기술센터, 상록회관 하차: 146(상계동), 341(하남), 360(송파),
                740(덕은동)
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Car className="w-5 h-5 text-wedding-primary mt-1 mr-4" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">자동차</h4>
              <p className="text-text-secondary text-sm">
                네비게이션 &ldquo;서울상록회관&rdquo; <br />
                또는 &ldquo;서울시 강남구 언주로 508&rdquo; 입력
              </p>
            </div>
          </div>
        </div>

        <div id="map-button" className="mt-6 text-center">
          <Button
            size="sm"
            className="bg-wedding-primary hover:bg-wedding-primary/90 text-white rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
            onClick={() => setIsMapModalOpen(true)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            지도 보기
          </Button>
        </div>
      </section>

      {/* 참석의사 전달 섹션 */}
      <section
        id="attendance-check"
        ref={attendanceAnimation.elementRef}
        className={`px-6 py-8 scroll-slide-up ${
          attendanceAnimation.isVisible ? "animate" : ""
        }`}
      >
        <AttendanceCheck />
      </section>

      {/* 마음 전하는 곳 */}
      <section
        id="gift-info"
        ref={giftAnimation.elementRef}
        className={`px-6 py-8 bg-white scroll-slide-up-delay ${
          giftAnimation.isVisible ? "animate" : ""
        }`}
      >
        <h2 className="text-xl font-bold text-text-primary text-center mb-6">
          마음 전하는 곳
        </h2>
        <div className="text-center">
          <p className="text-text-secondary text-sm mb-4">
            참석이 어려우신 분들을 위해
            <br />
            계좌번호를 안내드립니다.
          </p>
          <MoneyGift />
        </div>
      </section>

      {/* 스냅사진 업로드 섹션 */}
      <div
        ref={uploadAnimation.elementRef}
        className={`scroll-fade-in ${
          uploadAnimation.isVisible ? "animate" : ""
        }`}
      >
        <PhotoUpload />
      </div>

      {/* 감사 인사 */}
      <div
        className="relative mobile-viewport-fix bg-cover bg-center bg-no-repeat text-gray-700 text-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hanok.webp')",
          backgroundAttachment: "scroll",
          transform: "translateZ(0)",
          willChange: "auto",
          contain: "layout style",
          minHeight: "500px",
          maxHeight: "80vh",
          WebkitMaskImage: `linear-gradient(180deg, 
            transparent, 
            rgba(0, 0, 0, .013) 1.1%, 
            rgba(0, 0, 0, .049) 2.3%, 
            rgba(0, 0, 0, .104) 3.58%, 
            rgba(0, 0, 0, .175) 4.94%, 
            rgba(0, 0, 0, .259) 6.34%, 
            rgba(0, 0, 0, .352) 7.78%, 
            rgba(0, 0, 0, .45) 9.26%, 
            rgba(0, 0, 0, .55) 10.74%, 
            rgba(0, 0, 0, .648) 12.22%, 
            rgba(0, 0, 0, .741) 13.66%, 
            rgba(0, 0, 0, .825) 15.06%, 
            rgba(0, 0, 0, .896) 16.42%, 
            rgba(0, 0, 0, .951) 17.7%, 
            rgba(0, 0, 0, .987) 18.9%, 
            #000 20%, 
            #000 80%, 
            rgba(0, 0, 0, .987) 81.1%, 
            rgba(0, 0, 0, .951) 82.3%, 
            rgba(0, 0, 0, .896) 83.58%, 
            rgba(0, 0, 0, .825) 84.94%, 
            rgba(0, 0, 0, .741) 86.34%, 
            rgba(0, 0, 0, .648) 87.78%, 
            rgba(0, 0, 0, .55) 89.26%, 
            rgba(0, 0, 0, .45) 90.74%, 
            rgba(0, 0, 0, .352) 92.22%, 
            rgba(0, 0, 0, .259) 93.66%, 
            rgba(0, 0, 0, .175) 95.06%, 
            rgba(0, 0, 0, .104) 96.42%, 
            rgba(0, 0, 0, .049) 97.7%, 
            rgba(0, 0, 0, .013) 98.9%, 
            transparent)`,
          maskImage: `linear-gradient(180deg, 
            transparent, 
            rgba(0, 0, 0, .013) 1.1%, 
            rgba(0, 0, 0, .049) 2.3%, 
            rgba(0, 0, 0, .104) 3.58%, 
            rgba(0, 0, 0, .175) 4.94%, 
            rgba(0, 0, 0, .259) 6.34%, 
            rgba(0, 0, 0, .352) 7.78%, 
            rgba(0, 0, 0, .45) 9.26%, 
            rgba(0, 0, 0, .55) 10.74%, 
            rgba(0, 0, 0, .648) 12.22%, 
            rgba(0, 0, 0, .741) 13.66%, 
            rgba(0, 0, 0, .825) 15.06%, 
            rgba(0, 0, 0, .896) 16.42%, 
            rgba(0, 0, 0, .951) 17.7%, 
            rgba(0, 0, 0, .987) 18.9%, 
            #000 20%, 
            #000 80%, 
            rgba(0, 0, 0, .987) 81.1%, 
            rgba(0, 0, 0, .951) 82.3%, 
            rgba(0, 0, 0, .896) 83.58%, 
            rgba(0, 0, 0, .825) 84.94%, 
            rgba(0, 0, 0, .741) 86.34%, 
            rgba(0, 0, 0, .648) 87.78%, 
            rgba(0, 0, 0, .55) 89.26%, 
            rgba(0, 0, 0, .45) 90.74%, 
            rgba(0, 0, 0, .352) 92.22%, 
            rgba(0, 0, 0, .259) 93.66%, 
            rgba(0, 0, 0, .175) 95.06%, 
            rgba(0, 0, 0, .104) 96.42%, 
            rgba(0, 0, 0, .049) 97.7%, 
            rgba(0, 0, 0, .013) 98.9%, 
            transparent)`,
        }}
      >
        <div className="relative z-10 w-full max-w-md mx-auto px-6">
          {/* 메인 텍스트 */}
          <div className="mb-8 text-center">
            <p className="text-white text-2xl font-bold tracking-wide drop-shadow-lg font-point">
              감사합니다
            </p>
            {/* <p className="text-base text-white font-bold tracking-wide drop-shadow-lg">
              2025.12.27
            </p> */}
          </div>
        </div>
      </div>
      <footer id="footer" className="border-none">
        {/* 최하단 카카오톡 버튼과 저작권 */}
        <div className="bg-white/90 backdrop-blur-sm  border-gray-200/50 py-8 px-6">
          <div className="max-w-md mx-auto text-center space-y-3">
            {/* 카카오톡 공유 버튼 */}
            <button
              onClick={() => {
                if (window.Kakao && window.Kakao.Share) {
                  window.Kakao.Share.sendDefault({
                    objectType: "feed",
                    content: {
                      title: "2025년 12월 27일",
                      description: "성욱 ♥ 회진 결혼식에 초대합니다",
                      imageUrl:
                        window.location.origin + "/images/KSC03250_s-1.jpg",
                      link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                      },
                    },
                    buttons: [
                      {
                        title: "청첩장 보기",
                        link: {
                          mobileWebUrl: window.location.href,
                          webUrl: window.location.href,
                        },
                      },
                    ],
                  });
                } else {
                  // 카카오톡 공유 API가 없을 경우 URL 복사
                  navigator.clipboard.writeText(window.location.href);
                  alert("링크가 복사되었습니다!");
                }
              }}
              className="inline-flex items-center space-x-2 text-gray-800 text-xs font-medium py-2 px-4 rounded-full transition-all duration-200 hover:scale-105"
            >
              <span className="text-sm">
                <Image
                  src="/images/icon-kakaotalk.svg"
                  alt="카카오톡"
                  width={16}
                  height={16}
                  className="w-4 h-4 select-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    WebkitUserSelect: "none",
                    WebkitTouchCallout: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                />
              </span>
              <span>카카오톡으로 초대장 보내기</span>
            </button>
          </div>
        </div>
        <div className="text-center text-[10px] text-text-secondary py-5 font-point">
          © 2025 Seongwook & Hoejin Wedding Invitation
          <br />
          Crafted by Seongwook
        </div>
      </footer>

      {/* 지도 보기 팝업 모달 */}
      <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-hidden p-0 bg-white gap-0">
          <DialogTitle className="sr-only">오시는 길</DialogTitle>
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-4 border-gray-200">
            <h3 className="text-lg font-medium text-text-primary">오시는 길</h3>
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 지도 이미지 */}
          <div>
            <div className="w-full">
              <Image
                src="/images/wedding_location.webp"
                alt="상록아트홀 위치 안내"
                width={400}
                height={300}
                priority
                className="w-full h-auto rounded-lg select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  maxHeight: "80vh",
                  objectFit: "contain",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
