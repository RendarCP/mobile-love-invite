import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// 환경 변수 검증
function validateEnvironmentVariables() {
  const requiredVars = {
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    GOOGLE_SHEETS_SHEET_ID: process.env.GOOGLE_SHEETS_SHEET_ID,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return requiredVars;
}

// Google Sheets 인증 설정
function createServiceAccountAuth() {
  const envVars = validateEnvironmentVariables();

  // 개인 키에서 이스케이프 문자 처리
  const privateKey = envVars.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n");

  return new JWT({
    email: envVars.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { side, name, attendeeCount, mealOption, message } = body;

    // 환경 변수 검증 및 인증 객체 생성
    const serviceAccountAuth = createServiceAccountAuth();
    const envVars = validateEnvironmentVariables();

    // Google Sheets 문서 연결
    const doc = new GoogleSpreadsheet(
      envVars.GOOGLE_SHEETS_SHEET_ID!,
      serviceAccountAuth
    );
    await doc.loadInfo();

    // 첫 번째 시트 가져오기
    const sheet = doc.sheetsByIndex[0];

    // 데이터 추가
    await sheet.addRow({
      구분: side === "groom" ? "신랑측" : "신부측",
      성함: name,
      참석인원: attendeeCount,
      식사여부:
        mealOption === "yes" ? "예정" : mealOption === "no" ? "안함" : "미정",
      메시지: message || "",
      타임스탬프: new Date().toLocaleString("ko-KR"),
    });

    return NextResponse.json({
      success: true,
      message: "참석 정보가 등록되었습니다.",
    });
  } catch (error) {
    console.error("참석 정보 등록 오류:", error);

    // 환경 변수 관련 오류인 경우 더 구체적인 메시지 제공
    if (
      error instanceof Error &&
      error.message.includes("Missing required environment variables")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "서버 설정 오류: Google Sheets API 설정이 필요합니다.",
          error: "환경 변수가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "참석 정보 등록에 실패했습니다.",
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
