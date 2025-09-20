# Google Sheets API 설정 가이드

## 1. Google Cloud Console 설정

### 1-1. 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1-2. Google Sheets API 활성화

1. 왼쪽 메뉴에서 "API 및 서비스" → "라이브러리" 클릭
2. "Google Sheets API" 검색
3. "사용 설정" 클릭

### 1-3. 서비스 계정 생성

1. 왼쪽 메뉴에서 "API 및 서비스" → "사용자 인증 정보" 클릭
2. "사용자 인증 정보 만들기" → "서비스 계정" 클릭
3. 서비스 계정 정보 입력:
   - 서비스 계정 이름: `wedding-attendance`
   - 서비스 계정 ID: `wedding-attendance`
   - 설명: `청첩장 참석의사 수집용`
4. "만들고 계속하기" 클릭
5. "완료" 클릭

### 1-4. 서비스 계정 키 생성

1. 생성된 서비스 계정 클릭
2. "키" 탭 클릭
3. "키 추가" → "새 키 만들기" 클릭
4. "JSON" 선택 후 "만들기" 클릭
5. JSON 파일이 다운로드됨

## 2. Google Sheets 설정

### 2-1. 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com/) 접속
2. 새 스프레드시트 생성
3. 첫 번째 행에 헤더 추가 (선택사항):
   ```
   A1: 타임스탬프
   B1: 구분
   C1: 성함
   D1: 참석인원
   E1: 식사여부
   ```

### 2-2. 서비스 계정에 권한 부여

1. 스프레드시트에서 "공유" 버튼 클릭
2. 다운로드된 JSON 파일에서 `client_email` 값 복사
3. 해당 이메일을 편집자로 추가
4. 스프레드시트 URL에서 ID 부분 복사:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## 3. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 후 다음 내용 추가:

```env
# Google Sheets API 설정
VITE_GOOGLE_SPREADSHEET_ID=YOUR_SPREADSHEET_ID
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=YOUR_SERVICE_ACCOUNT_EMAIL
VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# 기타 설정
VITE_KAKAO_APP_KEY=your_kakao_app_key
VITE_NAVER_MAP_KEY=your_naver_map_key
```

### 환경변수 값 설정 방법:

1. **SPREADSHEET_ID**: 스프레드시트 URL에서 추출
2. **SERVICE_ACCOUNT_EMAIL**: JSON 파일의 `client_email` 값
3. **PRIVATE_KEY**: JSON 파일의 `private_key` 값 (개행문자 포함)

### JSON 파일 예시:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "wedding-attendance@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

## 4. 테스트

1. 개발 서버 실행: `yarn dev`
2. 참석의사 전달 기능 테스트
3. 구글 시트에 데이터가 추가되는지 확인

## 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- 서비스 계정 키는 안전하게 보관하세요
- 프로덕션 환경에서는 환경변수를 안전하게 관리하세요

## 문제 해결

### 403 오류 (권한 없음)

- 서비스 계정이 스프레드시트에 편집자로 추가되었는지 확인
- Google Sheets API가 활성화되었는지 확인

### 404 오류 (스프레드시트 없음)

- 스프레드시트 ID가 올바른지 확인
- 스프레드시트가 삭제되지 않았는지 확인

### 401 오류 (인증 실패)

- 서비스 계정 이메일과 개인키가 올바른지 확인
- 개인키의 개행문자(`\n`)가 제대로 설정되었는지 확인
