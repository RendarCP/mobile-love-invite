import { Heart, Car, Train, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoneyGift from "@/components/sections/MoneyGift";
import WeddingCalendar from "@/components/sections/WeddingCalendar";
import PhotoGallery from "@/components/sections/PhotoGallery";
import NaverMap from "@/components/sections/NaverMap";

/**
 * 모바일 청첩장 메인 앱 컴포넌트
 * 참고: https://mcard.fromtoday.co.kr/w/Hr9Hp3/
 */
function App() {
  const weddingDate = new Date("2025-12-27T15:20:00");

  // 웨딩홀 정보 (실제 좌표로 변경해주세요)
  const venueInfo = {
    name: "상록아트홀",
    address: "서울특별시 강남구 언주로 508(역삼동 701번지)",
    phone: "02-564-5757",
    latitude: 37.503862, // 워커힐 호텔 좌표 (예시)
    longitude: 127.0431764,
  };

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
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider drop-shadow-2xl mb-2 opacity-0 date-slide-from-left date-delay-1">
              25
            </div>
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider -mt-6 drop-shadow-2xl mb-2 opacity-0 date-slide-from-right date-delay-2">
              12
            </div>
            <div className="text-white text-7xl font-partial font-light leading-none tracking-wider -mt-6 drop-shadow-2xl mb-2 opacity-0 date-slide-from-left date-delay-3">
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
      <section id="greeting" className="px-6 py-8 bg-white text-center">
        {/* 상단 장식 아이콘 */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <Heart className="w-6 h-6 text-rose-primary/50" />
          </div>
        </div>

        {/* 인사말 내용 */}
        <div className="text-text-secondary leading-relaxed space-y-4 text-sm">
          <p>
            두 사람이 꽃과 나무처럼 같아야서
            <br />
            서로의 모든 것이 되기 위해
          </p>
          <p>
            오랜 기다림 끝에 혼례식을 치르는 날
            <br />
            새삶은 더욱 아름다워라
          </p>
          <p className="text-text-primary font-medium">
            이해인, &lt;사랑의 사람들이여&gt;
          </p>
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
      <section className="relative bg-white">
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
      <section id="wedding-calendar" className="px-6 py-8">
        <WeddingCalendar weddingDate={weddingDate} />
      </section>

      {/* 갤러리 섹션 */}
      <section id="gallery" className="px-6 py-8 bg-cream-primary/30">
        <PhotoGallery />
      </section>

      {/* 장소 정보 섹션 */}
      <section id="location-info" className="px-6 py-8 bg-white">
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
          <div className="flex items-start space-x-3">
            <Train className="w-5 h-5 text-sage-primary mt-1" />
            <div>
              <h4 className="font-medium text-text-primary text-sm">지하철</h4>
              <p className="text-text-secondary text-sm">
                5호선 광나루역 1번 출구 → 셔틀버스 이용
                <br />
                2호선 강변역 1번 출구 → 택시 10분
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Bus className="w-5 h-5 text-sage-primary mt-1" />
            <div>
              <h4 className="font-medium text-text-primary text-sm">버스</h4>
              <p className="text-text-secondary text-sm">
                광나루역.한양대앞 정류장 (2224, 2412, 6411)
                <br />→ 무료 셔틀버스 환승
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Car className="w-5 h-5 text-sage-primary mt-1" />
            <div>
              <h4 className="font-medium text-text-primary text-sm">자가용</h4>
              <p className="text-text-secondary text-sm">
                발레파킹 서비스 이용 가능
                <br />
                내비게이션: 그랜드 워커힐 서울 검색
              </p>
            </div>
          </div>
        </div>

        <div id="map-button" className="mt-6 text-center">
          <Button className="bg-sage-primary hover:bg-sage-secondary text-white">
            지도 보기
          </Button>
        </div>
      </section>

      {/* 마음 전하는 곳 */}
      <section id="gift-info" className="px-6 py-8 bg-white">
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

      {/* 푸터 */}
      <footer
        id="footer"
        className="bg-text-primary text-white text-center py-6"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Heart className="w-4 h-4" />
          <span className="text-sm">성욱 ♥ 회진</span>
          <Heart className="w-4 h-4" />
        </div>
        <p className="text-xs opacity-70">2025.12.27</p>
      </footer>
    </div>
  );
}

export default App;
