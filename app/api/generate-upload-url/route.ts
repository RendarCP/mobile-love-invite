import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

// Google Cloud Storage 설정
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

/**
 * Signed URL 생성 API
 * 클라이언트가 직접 GCS에 업로드할 수 있는 임시 URL을 생성
 */
export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { success: false, message: "파일명과 타입이 필요합니다." },
        { status: 400 }
      );
    }

    // 타임스탬프를 포함한 고유 파일명 생성
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Cloud Storage 버킷 참조
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);
    const file = bucket.file(`wedding-photos/${uniqueFileName}`);

    // 업로드용 Signed URL 생성 (15분 유효)
    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15분
      contentType,
    });

    // 읽기용 Signed URL 생성 (1년 유효)
    const [readUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1년
    });

    return NextResponse.json({
      success: true,
      uploadUrl,
      readUrl,
      fileName: uniqueFileName,
    });
  } catch (error) {
    console.error("Signed URL 생성 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "URL 생성에 실패했습니다.",
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
