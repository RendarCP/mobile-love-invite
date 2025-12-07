import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Google Sheets 인증 설정
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

/**
 * 업로드된 사진의 메타데이터를 Google Sheets에 저장
 */
export async function POST(request: NextRequest) {
  try {
    const { name, message, imageUrl, fileName } = await request.json();

    if (!imageUrl || !fileName) {
      return NextResponse.json(
        { success: false, message: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // Google Sheets에 메타데이터 저장
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEETS_SHEET_ID!,
      serviceAccountAuth
    );
    await doc.loadInfo();

    // 두 번째 시트 가져오기 (사진 업로드용)
    const sheet =
      doc.sheetsByIndex[1] || (await doc.addSheet({ title: "사진 업로드" }));

    // 메타데이터 추가
    await sheet.addRow({
      이름: name || "게스트",
      메시지: message || "",
      사진URL: imageUrl,
      파일명: fileName,
      업로드일시: new Date().toLocaleString("ko-KR"),
    });

    return NextResponse.json({
      success: true,
      message: "메타데이터가 저장되었습니다.",
    });
  } catch (error) {
    console.error("메타데이터 저장 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "메타데이터 저장에 실패했습니다.",
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

