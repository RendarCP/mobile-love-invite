import React, { useEffect, useRef } from "react";

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

  // 카카오맵 내비 공유 함수
  const handleKakaoNavi = () => {
    if (typeof window !== "undefined") {
      window.open("https://kko.kakao.com/OXftsQIo4C", "_blank");
    }
  };

  useEffect(() => {
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
        zoom: 16,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
      };

      // 지도 인스턴스 생성
      mapRef.current = new naverMaps.Map(mapElement.current, mapOptions);

      // 마커 생성
      const marker = new naverMaps.Marker({
        position: new naverMaps.LatLng(latitude, longitude),
        map: mapRef.current,
        title: venueName,
      });
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
      {typeof window !== "undefined" && !window.naver && (
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
          <div className="flex-shrink-0 w-8 h-8 bg-rose-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🏛️</span>
          </div>
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
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            네이버지도
          </button>
          <button
            onClick={handleKakaoNavi}
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            카카오맵
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
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            티맵
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaverMap;
