# 환경 변수 설정 가이드

## Google Sheets API 설정

### 1. Google Cloud Console에서 서비스 계정 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용 설정된 API"로 이동
4. "Google Sheets API" 활성화
5. "API 및 서비스" > "사용자 인증 정보"로 이동
6. "사용자 인증 정보 만들기" > "서비스 계정" 선택
7. 서비스 계정 이름 입력 후 생성
8. 생성된 서비스 계정 클릭 > "키" 탭 > "키 추가" > "새 키 만들기" > "JSON" 선택
9. JSON 키 파일 다운로드

### 2. Google Sheets 문서 준비

1. [Google Sheets](https://sheets.google.com/)에서 새 스프레드시트 생성
2. 첫 번째 행에 헤더 추가:
   - A1: 구분
   - B1: 성함
   - C1: 참석인원
   - D1: 식사여부
   - E1: 메시지
   - F1: 등록일시
3. 스프레드시트 URL에서 문서 ID 복사
   - 예: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - 문서 ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
4. 다운로드한 JSON 키 파일의 `client_email`을 스프레드시트에 공유
   - 스프레드시트 > 공유 > 이메일 주소 입력 > 편집자 권한 부여

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Google Sheets API 설정
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
NEXT_PUBLIC_GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_GOOGLE_SHEETS_SHEET_ID=your-google-sheets-id-here
```

### 4. 환경 변수 값 찾기

#### NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_EMAIL

- 다운로드한 JSON 키 파일에서 `client_email` 값 사용

#### NEXT_PUBLIC_GOOGLE_SHEETS_PRIVATE_KEY

- 다운로드한 JSON 키 파일에서 `private_key` 값 사용
- 전체 private_key를 따옴표로 감싸고, `\n` 문자를 그대로 유지

#### NEXT_PUBLIC_GOOGLE_SHEETS_SHEET_ID

- Google Sheets URL에서 문서 ID 부분 사용

### 5. 예시

```env
NEXT_PUBLIC_GOOGLE_SHEETS_CLIENT_EMAIL=wedding-invite@my-project-123456.iam.gserviceaccount.com
NEXT_PUBLIC_GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_GOOGLE_SHEETS_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

### 6. 보안 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `.env.local`이 포함되어 있는지 확인하세요
- 서비스 계정 키는 안전하게 보관하세요

### 7. 문제 해결

#### "No key or keyFile set" 오류

- 환경 변수가 올바르게 설정되었는지 확인
- private_key에 따옴표가 올바르게 설정되었는지 확인
- `\n` 문자가 그대로 유지되었는지 확인

#### "Permission denied" 오류

- 서비스 계정 이메일이 Google Sheets에 공유되었는지 확인
- 편집자 권한이 부여되었는지 확인

#### "Sheet not found" 오류

- SHEET_ID가 올바른지 확인
- 스프레드시트가 삭제되지 않았는지 확인
