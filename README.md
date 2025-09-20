# 모바일 청첩장 📱💕

성욱 ♥ 회진의 결혼식을 위한 모바일 웨딩 초대장 웹앱입니다.

## 🌟 주요 기능

- 📅 **웨딩 캘린더**: 결혼식 날짜가 강조된 달력
- ⏰ **카운트다운 타이머**: 실시간 D-day 카운터
- 📍 **장소 정보**: 지도, 교통편, 주차 안내
- 📸 **포토 갤러리**: 커플 사진 갤러리
- 💝 **마음 전하는곳**: 계좌번호 정보 (아코디언 형태)
- 🍽️ **식당 안내**: 식사 관련 정보
- ✅ **참석 체크**: 참석 의사 및 식사 여부 확인
- 📷 **사진 업로드**: 결혼식 사진 업로드 기능

## 🎨 디자인 컨셉

- **분위기**: 따뜻하고 로맨틱한 웨딩 테마
- **컬러**: 로즈골드/핑크, 크림/베이지, 골드 계열
- **반응형**: 모바일 퍼스트 (최대 480px 기준)
- **UX**: 부드러운 애니메이션과 터치 친화적 인터페이스

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **API**: Next.js API Routes
- **Database**: Google Sheets (참석 체크, 사진 업로드)
- **Package Manager**: Yarn

## 🚀 시작하기

### 1. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

\`\`\`bash

# .env.local 파일

# 카카오 SDK 앱 키

NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_javascript_key_here

# 네이버 맵 API 키

NEXT_PUBLIC_NAVER_MAP_KEY=your_naver_cloud_map_key_here

# Google Sheets API 설정 (참석 체크, 사진 업로드용)

GOOGLE_SHEETS_PRIVATE_KEY=your_google_sheets_private_key
GOOGLE_SHEETS_CLIENT_EMAIL=your_google_sheets_client_email
GOOGLE_SHEETS_SHEET_ID=your_google_sheets_sheet_id
\`\`\`

> 💡 **환경변수는 Next.js에서 자동으로 로드됩니다!**
>
> - `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능
> - 카카오 SDK는 앱 시작 시 자동 초기화
> - 네이버 맵 API는 동적으로 로드
> - Google Sheets API는 서버 사이드에서만 사용

#### 카카오 앱 키 발급 방법:

1. [카카오 디벨로퍼스](https://developers.kakao.com/) 접속
2. 내 애플리케이션 → 애플리케이션 추가하기
3. 앱 설정 → 플랫폼 → Web 플랫폼 추가
4. 앱 키 → JavaScript 키 복사

#### 네이버 맵 API 키 발급 방법:

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/) 접속
2. AI·NAVER API → AI·NAVER API → Maps 선택
3. Application 등록 후 인증 정보의 Client ID 사용

### 2. 설치 및 실행

\`\`\`bash

# 의존성 설치

yarn install

# 개발 서버 실행

yarn dev

# 빌드

yarn build

# 프로덕션 서버 실행

yarn start
\`\`\`

### 3. 배포 설정

#### Vercel 배포 (권장)

1. [Vercel](https://vercel.com/)에 프로젝트 연결
2. Environment Variables에서 다음 변수들을 추가:
   - `NEXT_PUBLIC_KAKAO_APP_KEY`: 카카오 JavaScript 키
   - `NEXT_PUBLIC_NAVER_MAP_KEY`: 네이버 맵 Client ID
   - `GOOGLE_SHEETS_PRIVATE_KEY`: Google Sheets Private Key
   - `GOOGLE_SHEETS_CLIENT_EMAIL`: Google Sheets Client Email
   - `GOOGLE_SHEETS_SHEET_ID`: Google Sheets Sheet ID

#### Netlify 배포

1. Netlify 대시보드 → Site settings → Environment variables
2. 위와 동일한 환경변수들을 추가

### 개발 환경

- Node.js 18+ 권장
- Yarn 4.x 사용

## 📁 프로젝트 구조

\`\`\`
├── app/ # Next.js App Router
│ ├── api/ # API 라우트
│ │ ├── attendance/ # 참석 체크 API
│ │ └── photo-upload/ # 사진 업로드 API
│ ├── globals.css # 글로벌 스타일
│ ├── layout.tsx # 루트 레이아웃
│ └── page.tsx # 메인 페이지
├── src/
│ ├── components/
│ │ ├── ui/ # shadcn/ui 기본 컴포넌트
│ │ └── sections/ # 웨딩 섹션 컴포넌트들
│ ├── types/
│ │ └── wedding.ts # TypeScript 타입 정의
│ ├── data/
│ │ └── wedding-data.ts # 웨딩 정적 데이터
│ ├── lib/
│ │ └── utils.ts # 유틸리티 함수
│ └── hooks/
│ └── useScrollAnimation.ts # 스크롤 애니메이션 훅
├── public/ # 정적 파일
│ ├── images/ # 이미지 파일
│ └── videos/ # 비디오 파일
└── next.config.js # Next.js 설정
\`\`\`

## 🎯 구현 예정 섹션

1. **WeddingCalendar** - 달력 형식으로 결혼식 날짜 표시
2. **CountdownTimer** - D-day 실시간 카운터
3. **LocationInfo** - 지도 및 교통편 정보
4. **PhotoGallery** - 이미지 갤러리
5. **MoneyGift** - 계좌번호 아코디언 (6개 항목)
6. **DiningInfo** - 식당 위치 및 안내
7. **AttendanceCheck** - 참석 의사 모달 폼
8. **PhotoUpload** - 사진 업로드 기능

## 💡 개발 가이드라인

- 모바일 우선 반응형 디자인
- TypeScript 엄격 모드 사용
- Tailwind CSS 유틸리티 클래스 우선 사용
- 컴포넌트별 명확한 책임 분리
- 접근성(a11y) 고려
- 성능 최적화 (이미지 lazy loading 등)

## 🌈 컬러 팔레트

- **Primary Rose**: `#F8BBD9`, `#E879F9`
- **Cream**: `#FEF7ED`, `#F3E8FF`
- **Gold**: `#FCD34D`, `#FBBF24`

## 📱 모바일 최적화

- 최대 가로폭: 480px
- 최소 터치 영역: 44px
- 부드러운 스크롤 및 애니메이션
- 터치 제스처 지원

---

💕 성욱 & 회진의 특별한 날을 축하해 주세요!

# mobile-love-invite
