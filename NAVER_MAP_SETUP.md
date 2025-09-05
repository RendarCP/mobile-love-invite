# 네이버 맵 API 설정 가이드

## 1. 네이버 클라우드 플랫폼 가입

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 접속
2. 회원가입 및 로그인
3. Console에 접속

## 2. Maps API 신청

1. Console > Services > AI·Application Service > Maps
2. 이용 신청하기 클릭
3. Web Dynamic Map API 선택
4. 이용약관 동의 후 신청

## 3. API 인증 정보 생성

1. Console > My Page > 인증키 관리
2. 신규 API 인증키 생성
3. Client ID 복사

## 4. 프로젝트에 API 키 적용

`index.html` 파일에서 `YOUR_CLIENT_ID`를 실제 발급받은 Client ID로 변경:

```html
<script
  type="text/javascript"
  src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_ACTUAL_CLIENT_ID"
></script>
```

## 5. 웨딩홀 좌표 설정

`src/App.tsx` 파일에서 `venueInfo` 객체의 좌표 정보를 실제 웨딩홀 위치로 변경:

```typescript
const venueInfo = {
  name: "실제 웨딩홀 이름",
  address: "실제 웨딩홀 주소",
  phone: "실제 전화번호",
  latitude: 37.1234, // 실제 위도
  longitude: 127.1234, // 실제 경도
};
```

## 6. 좌표 찾는 방법

1. [네이버 지도](https://map.naver.com/)에서 웨딩홀 검색
2. 해당 위치 우클릭 > "여기가 어디인가요?" 클릭
3. 표시되는 좌표 정보 복사

또는

1. [좌표 변환 서비스](https://www.safecoding.co.kr/coord/index.jsp) 이용
2. 주소 입력하여 위도/경도 확인

## 7. 도메인 등록 (배포시)

배포할 때는 네이버 클라우드 플랫폼에서 도메인 등록 필요:

1. Console > My Page > 인증키 관리
2. 해당 API 키 선택
3. 서비스 환경 설정에서 도메인 추가

## 주의사항

- API 키는 public 저장소에 노출되지 않도록 주의
- 개발환경에서는 localhost 도메인이 자동으로 허용됨
- 배포시에는 반드시 실제 도메인을 등록해야 함
- 무료 할당량 초과시 요금이 발생할 수 있음

## 트러블슈팅

### 지도가 로드되지 않는 경우

1. API 키가 올바른지 확인
2. 브라우저 개발자 도구에서 에러 메시지 확인
3. 네트워크 연결 상태 확인

### 마커가 표시되지 않는 경우

1. 좌표 정보가 올바른지 확인
2. 좌표 형식이 숫자인지 확인 (문자열 X)
