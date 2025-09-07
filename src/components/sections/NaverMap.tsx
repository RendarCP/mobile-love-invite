import React, { useEffect, useRef } from "react";

// 네이버 맵 타입 정의
declare global {
  interface Window {
    naver: any;
  }
}

interface NaverMapProps {
  /** 웨딩홀 위도 */
  latitude: number;
  /** 웨딩홀 경도 */
  longitude: number;
  /** 웨딩홀 이름 */
  venueName: string;
  /** 웨딩홀 주소 */
  venueAddress: string;
}

/**
 * 네이버 맵을 표시하는 컴포넌트
 */
const NaverMap: React.FC<NaverMapProps> = ({
  latitude,
  longitude,
  venueName,
  venueAddress,
}) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // 네이버 맵 API가 로드될 때까지 대기
    const initializeMap = () => {
      if (!window.naver || !window.naver.maps) {
        console.warn("네이버 맵 API가 아직 로드되지 않았습니다.");
        return;
      }

      if (!mapElement.current) return;

      // 지도 생성
      const mapOptions = {
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 16,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        disableTwoFingerTapZoom: false,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        draggable: false,
        scrollWheel: false,
        disableDoubleTapZoom: true,
        disableDoubleClickZoom: true,
      };

      mapRef.current = new window.naver.maps.Map(
        mapElement.current,
        mapOptions
      );

      // 마커 생성
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(latitude, longitude),
        map: mapRef.current,
        title: venueName,
        // icon: {
        //   content: `
        //     <div style="
        //       background: #F4C2C2;
        //       color: white;
        //       padding: 8px 12px;
        //       border-radius: 20px;
        //       font-size: 12px;
        //       font-weight: 600;
        //       box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        //       position: relative;
        //       border: 2px solid white;
        //     ">
        //       💒 ${venueName}
        //       <div style="
        //         position: absolute;
        //         bottom: -5px;
        //         left: 50%;
        //         transform: translateX(-50%);
        //         width: 0;
        //         height: 0;
        //         border-left: 6px solid transparent;
        //         border-right: 6px solid transparent;
        //         border-top: 6px solid #F4C2C2;
        //       "></div>
        //     </div>
        //   `,
        //   anchor: new window.naver.maps.Point(0, 0),
        // },
      });

      // // 정보창 생성
      // const infoWindow = new window.naver.maps.InfoWindow({
      //   content: `
      //     <div style="padding: 16px; max-width: 200px;">
      //       <h4 style="margin: 0 0 8px 0; color: #2D2D2D; font-size: 14px; font-weight: 600;">
      //         ${venueName}
      //       </h4>
      //       <p style="margin: 0; color: #666; font-size: 12px; line-height: 1.4;">
      //         ${venueAddress}
      //       </p>
      //       <div style="margin-top: 12px;">
      //         <button onclick="window.open('https://map.naver.com/v5/search/${encodeURIComponent(
      //           venueName
      //         )}', '_blank')"
      //           style="
      //             background: #F4C2C2;
      //             color: white;
      //             border: none;
      //             padding: 6px 12px;
      //             border-radius: 4px;
      //             font-size: 11px;
      //             cursor: pointer;
      //             font-weight: 500;
      //           ">
      //           네이버지도 열기
      //         </button>
      //       </div>
      //     </div>
      //   `,
      //   borderWidth: 0,
      //   backgroundColor: "white",
      //   borderColor: "#F4C2C2",
      //   borderRadius: "8px",
      //   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      // });

      // // 마커 클릭 시 정보창 표시
      // window.naver.maps.Event.addListener(marker, "click", () => {
      //   if (infoWindow.getMap()) {
      //     infoWindow.close();
      //   } else {
      //     infoWindow.open(mapRef.current, marker);
      //   }
      // });
    };

    // 네이버 맵 API 로드 확인
    if (window.naver && window.naver.maps) {
      initializeMap();
    } else {
      // API가 아직 로드되지 않은 경우 대기
      const checkNaver = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(checkNaver);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkNaver);
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
      {!window.naver && (
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
            onClick={() =>
              window.open(
                `https://map.naver.com/v5/search/${encodeURIComponent(
                  venueName
                )}/place/366784007?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202509052343&locale=ko&svcName=map_pcv5&searchText=상록아트홀`,
                "_blank"
              )
            }
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            네이버지도
          </button>
          <button
            onClick={() =>
              window.open(`https://kko.kakao.com/OXftsQIo4C`, "_blank")
            }
            className="flex-1 bg-white border border-gray-200 text-text-primary text-xs py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            카카오맵
          </button>
          <button
            onClick={() => {
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
