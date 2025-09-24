import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface NaverMapProps {
  venueName: string;
  venueAddress: string;
  latitude: number;
  longitude: number;
}

/**
 * 네이버 맵 컴포넌트
 * 결혼식 장소의 위치를 표시하고 네비게이션 기능을 제공합니다.
 */
const NaverMap: React.FC<NaverMapProps> = ({
  venueName,
  venueAddress,
  latitude,
  longitude,
}) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 모바일 디바이스 감지 유틸 함수
  const isMobile = () =>
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // 카카오맵 길찾기: 카카오 SDK 사용 (모바일) → 실패 시 웹 링크 폴백
  const handleKakaoNavi = () => {
    if (typeof window === "undefined") return;

    console.log("kakaoWebUrl venueName", venueName);
    // 1) 웹 폴백용 (앱 없거나 PC일 때)
    const kakaoWebUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
      venueName
    )},${latitude},${longitude}`;

    // 2) 모바일에서 카카오 SDK 사용
    if (isMobile()) {
      // 카카오 SDK가 로드되었는지 확인
      if (window.Kakao && window.Kakao.Navi) {
        try {
          window.Kakao.Navi.share({
            name: venueName,
            x: longitude,
            y: latitude,
            coordType: "wgs84",
          });
          return;
        } catch (error) {
          console.warn("카카오 내비 실행 실패, 웹으로 폴백:", error);
        }
      } else {
        console.warn("카카오 SDK가 로드되지 않음, 웹으로 폴백");
      }

      // SDK 실패 시 웹으로 폴백
      window.location.href = kakaoWebUrl;
      return;
    }

    // PC는 웹으로
    window.open(kakaoWebUrl, "_blank");
  };

  useEffect(() => {
    setIsClient(true);

    // 네이버 맵 API가 로드될 때까지 대기
    const initializeMap = () => {
      if (typeof window === "undefined") return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!window.naver || !(window.naver as any).maps) {
        console.warn("네이버 맵 API가 아직 로드되지 않았습니다.");
        return;
      }

      if (!mapElement.current) return;

      // 지도 생성
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const naverMaps = (window.naver as any).maps;
      const mapOptions = {
        center: new naverMaps.LatLng(latitude, longitude),
        zoom: 17,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        draggable: false,
        scrollWheel: false,
      };

      // 지도 인스턴스 생성
      mapRef.current = new naverMaps.Map(mapElement.current, mapOptions);

      // 마커 생성
      new naverMaps.Marker({
        position: new naverMaps.LatLng(latitude, longitude),
        map: mapRef.current,
        title: venueName,
      });

      setIsMapLoaded(true);
    };

    // 네이버 맵 API 로드 확인
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (window.naver && (window.naver as any).maps) {
        initializeMap();
      } else {
        // API가 아직 로드되지 않은 경우 대기
        const checkNaver = setInterval(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (window.naver && (window.naver as any).maps) {
            clearInterval(checkNaver);
            initializeMap();
          }
        }, 100);

        return () => clearInterval(checkNaver);
      }
    }
  }, [latitude, longitude, venueName, venueAddress]);

  return (
    <div className="relative">
      {/* 지도 컨테이너 */}
      <div
        ref={mapElement}
        className="w-full h-64 rounded-lg overflow-hidden shadow-sm border border-gray-200"
        style={{ minHeight: "256px" }}
      />

      {/* 로딩 상태 */}
      {isClient && !isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-rose-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">지도를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 지도 하단 정보 */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <h4 className="font-medium text-text-primary text-sm mb-1">
              {venueName}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              {venueAddress}
            </p>
          </div>
        </div>

        {/* 외부 앱 연결 버튼들 */}
        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.open(
                  `https://map.naver.com/v5/search/${encodeURIComponent(
                    venueName
                  )}/place/366784007?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202509052343&locale=ko&svcName=map_pcv5&searchText=상록아트홀`,
                  "_blank"
                );
              }
            }}
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
          >
            <Image
              src="/images/naverMap.png"
              alt="네이버지도"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>네이버지도</span>
          </button>
          <button
            onClick={handleKakaoNavi}
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
          >
            <Image
              src="/images/kakaoNavi.png"
              alt="카카오내비"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>카카오내비</span>
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                // 티맵 앱 스키마 (길찾기 형태)
                const tmapAppUrl = `tmap://route?goalx=${longitude}&goaly=${latitude}&goalname=${encodeURIComponent(
                  venueName
                )}`;

                // 모바일에서 앱 스키마 시도
                if (
                  /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                  )
                ) {
                  window.location.href = tmapAppUrl;
                } else {
                  // PC에서는 티맵 웹사이트로 이동
                  window.open("https://www.tmap.co.kr", "_blank");
                }
              }
            }}
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
          >
            <Image
              src="/images/tmap.png"
              alt="티맵"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>티맵</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaverMap;
