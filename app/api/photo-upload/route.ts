import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Google Cloud Storage 설정
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

// Google Sheets 인증 설정 (메타데이터 저장용)
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const photo = formData.get("photo") as File;

    if (!photo) {
      return NextResponse.json(
        { success: false, message: "사진이 필요합니다." },
        { status: 400 }
      );
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${timestamp}-${photo.name}`;

    // Cloud Storage 버킷 참조
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);
    const file = bucket.file(`wedding-photos/${fileName}`);

    // 파일을 Cloud Storage에 업로드
    const stream = file.createWriteStream({
      metadata: {
        contentType: photo.type,
        metadata: {
          originalName: photo.name,
          uploadedBy: name,
          message: message || "",
        },
      },
    });

    // 파일 데이터를 스트림으로 전송
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
      stream.end(buffer);
    });

    // 공개 URL 생성 (서명된 URL 사용)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1년 후 만료
    });

    // Google Sheets에 메타데이터 저장
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEETS_SHEET_ID!,
      serviceAccountAuth
    );
    await doc.loadInfo();

    // 두 번째 시트 가져오기 (사진 업로드용)
    const sheet =
      doc.sheetsByIndex[1] || (await doc.addSheet({ title: "사진 업로드" }));

    // 메타데이터 추가 (서명된 URL 사용)
    await sheet.addRow({
      이름: name,
      메시지: message || "",
      사진URL: signedUrl,
      파일명: fileName,
      업로드일시: new Date().toLocaleString("ko-KR"),
    });

    return NextResponse.json({
      success: true,
      message: "사진이 업로드되었습니다.",
      imageUrl: signedUrl,
    });
  } catch (error) {
    console.error("사진 업로드 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "사진 업로드에 실패했습니다.",
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
