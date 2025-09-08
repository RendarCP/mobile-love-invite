import { useState } from "react";
import { Heart, Car, Train, Bus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MoneyGift from "@/components/sections/MoneyGift";
import WeddingCalendar from "@/components/sections/WeddingCalendar";
import PhotoGallery from "@/components/sections/PhotoGallery";
import NaverMap from "@/components/sections/NaverMap";
import PhotoUpload from "@/components/sections/PhotoUpload";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// 카카오톡 SDK 확장 타입 정의
declare global {
  interface Window {
    Kakao?: {
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
function App() {
  const weddingDate = new Date("2025-12-27T15:20:00");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // 웨딩홀 정보 (실제 좌표로 변경해주세요)
  const venueInfo = {
    name: "상록아트홀",
    address: "서울특별시 강남구 언주로 508(역삼동 701번지)",
    phone: "02-564-5757",
    latitude: 37.503862, // 워커힐 호텔 좌표 (예시)
    longitude: 127.0431764,
  };

  // 각 섹션별 스크롤 애니메이션 훅
  const greetingAnimation = useScrollAnimation({ delay: 0 });
  const mainPhotoAnimation = useScrollAnimation({ delay: 150 });
  const calendarAnimation = useScrollAnimation({ delay: 100 });
  const galleryAnimation = useScrollAnimation({ delay: 200 });
  const locationAnimation = useScrollAnimation({ delay: 100 });
  const giftAnimation = useScrollAnimation({ delay: 150 });
  const uploadAnimation = useScrollAnimation({ delay: 100 });

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
      {/* 최상단 커버 섹션 - 이미지 스타일 */}
      <section className="relative h-screen bg-gradient-to-br from-rose-200 via-rose-100 to-orange-100 overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <img
            src="/images/KSC03250_s-1.jpg"
            alt="웨딩 커버 사진"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/30"></div>
        </div>

        {/* 비디오 오버레이 - screen blend mode */}
        <div id="video-overlay" className="absolute inset-0 z-10">
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

        {/* 상단 텍스트 */}
        <div
          id="top-text"
          className="absolute top-8 left-6 right-6 z-20 opacity-0 fade-in-delayed"
        >
          <div className="flex justify-between items-start">
            <span className="text-white/95 text-sm font-light tracking-[0.3em] drop-shadow-md">
              SEONGWOOK
            </span>
            <span className="text-white/95 text-sm font-light tracking-[0.3em] drop-shadow-md">
              HOEJIN
            </span>
          </div>
        </div>

        {/* 중앙 날짜 */}
        <div
          id="center-text"
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="text-center">
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider drop-shadow-2xl mb-4 opacity-0 date-slide-from-left date-delay-1">
              25
            </div>
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider -mt-6 drop-shadow-2xl mb-4 opacity-0 date-slide-from-right date-delay-2">
              12
            </div>
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider -mt-6 drop-shadow-2xl mb-4 opacity-0 date-slide-from-left date-delay-3">
              27
            </div>
          </div>
        </div>

        {/* 하단 텍스트 */}
        <div
          id="bottom-text"
          className="absolute bottom-20 left-6 right-6 z-20 opacity-0 fade-in-delayed"
        >
          <div className="flex justify-between items-end">
            <span className="text-white/95 text-sm font-light tracking-[0.3em] drop-shadow-md">
              TO BE
            </span>
            <span className="text-white/95 text-sm font-light tracking-[0.3em] drop-shadow-md">
              TOGETHER
            </span>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div
          id="scroll-indicator"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 opacity-0 fade-in-delayed"
        >
          <div className="w-6 h-10 border-2 border-white/60 rounded-full">
            <div className="w-1 h-3 bg-white/60 rounded-full mx-auto mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

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
            <Heart className="w-6 h-6 text-rose-primary/50" />
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-8">
          <div className="w-20 h-px bg-rose-primary/30 mx-auto"></div>
        </div>

        {/* INVITATION */}
        <div className="mb-6">
          <p className="text-xs text-text-secondary/60 tracking-widest mb-2">
            INVITATION
          </p>
          <h3 className="text-lg font-medium text-text-primary mb-4">
            소중한 분들을 초대합니다
          </h3>
        </div>

        {/* 하단 인사말 */}
        <div className="text-text-secondary leading-relaxed space-y-3 text-sm">
          <p>
            살랑하는 바람결에
            <br />
            사랑이 묻어나는 계절입니다.
          </p>
          <p>
            여기 곱고 예쁜 두 사람이{" "}
            <span className="text-rose-primary">사랑</span>을 맺어
            <br />
            인생의 반려자가 되려 합니다.
          </p>
          <p>
            새 인생을 시작하는 이 자리에 오셔서
            <br />
            <span className="text-rose-primary">축복</span>해 주시면
            감사하겠습니다.
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
            <img
              src="/images/KSC03250_s-1.jpg"
              alt="웨딩 메인 사진"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 하단 커플 정보 */}
        <div id="couple-info" className="text-center pb-8 px-6">
          <h2 className="text-xl font-medium text-text-primary mb-2">
            성욱 | 회진
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            2025년 12월 27일 토요일 오후 3시 20분
            <br />
            상록아트홀 5층 아트홀
          </p>
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
        className={`px-6 py-8 bg-cream-primary/30 scroll-scale-up ${
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
        <h2 className="text-xl font-medium text-text-primary text-center mb-6">
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

        {/* 웨딩홀 정보 */}
        {/* <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-rose-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-text-primary mb-1">
                  {venueInfo.name}
                </h3>
                <p className="text-text-secondary text-sm mb-2">
                  {venueInfo.address}
                </p>
                <p className="text-text-secondary text-sm">
                  Tel. {venueInfo.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* 교통편 안내 */}
        <div id="transport-info" className="space-y-4">
          <div className="flex items-start">
            <Train className="w-5 h-5 text-rose-primary mt-1 mr-4" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">지하철</h4>
              <p className="text-text-secondary text-sm">
                2호선, 수인분당선 "선릉역" 5번 출구 도보 5분
                <br />
                셔틀버스: 선릉역 5번 출구에서 운행
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Bus className="w-5 h-5 text-rose-primary mt-1 mr-4" />
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
            <Car className="w-5 h-5 text-rose-primary mt-1 mr-4" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">자동차</h4>
              <p className="text-text-secondary text-sm">
                네비게이션 "서울상록회관" <br />
                또는 "서울시 강남구 언주로 508" 입력
              </p>
            </div>
          </div>
        </div>

        <div id="map-button" className="mt-6 text-center">
          <Button onClick={() => setIsMapModalOpen(true)}>지도 보기</Button>
        </div>
      </section>

      {/* 마음 전하는 곳 */}
      <section
        id="gift-info"
        ref={giftAnimation.elementRef}
        className={`px-6 py-8 bg-white scroll-slide-up-delay ${
          giftAnimation.isVisible ? "animate" : ""
        }`}
      >
        <h2 className="text-xl font-medium text-text-primary text-center mb-6">
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
        className="relative h-screen bg-cover bg-center bg-no-repeat text-gray-700 text-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/KSC03250_s-1.jpg')",
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
            <p className="text-white text-lg mb-6 font-light tracking-wide drop-shadow-lg">
              감사합니다
            </p>
            <p className="text-base text-white font-light tracking-wide drop-shadow-lg">
              2025.12.27
            </p>
          </div>
        </div>
      </div>
      <footer id="footer">
        {/* 최하단 카카오톡 버튼과 저작권 */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 py-4 px-6">
          <div className="max-w-md mx-auto text-center space-y-3">
            {/* 카카오톡 공유 버튼 */}
            <button
              onClick={() => {
                if (window.Kakao && window.Kakao.Share) {
                  window.Kakao.Share.sendDefault({
                    objectType: "feed",
                    content: {
                      title: "성욱 ♥ 회진 결혼식에 초대합니다",
                      description:
                        "2025년 12월 27일\n여러분의 축복 속에서 새로운 시작을 하려 합니다.",
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
              className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-xs font-medium py-2 px-4 rounded-full transition-all duration-200 hover:scale-105"
            >
              <span className="text-sm">💬</span>
              <span>카카오톡으로 초대장 보내기</span>
            </button>

            {/* 저작권 정보 */}
            <p className="text-xs text-gray-500 opacity-70">
              Copyright © 2025. Seongwook & Hoejin All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 지도 보기 팝업 모달 */}
      <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-hidden p-0 bg-white">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-text-primary">오시는 길</h3>
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 지도 이미지 */}
          <div className="p-4">
            <div className="w-full">
              <img
                src="/images/location.jpg"
                alt="상록아트홀 위치 안내"
                className="w-full h-auto rounded-lg shadow-sm"
                style={{ maxHeight: "70vh", objectFit: "contain" }}
              />
            </div>

            {/* 웨딩홀 정보 */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-text-primary text-sm mb-2">
                📍 {venueInfo.name}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed mb-2">
                {venueInfo.address}
              </p>
              <p className="text-text-secondary text-xs">
                📞 {venueInfo.phone}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
