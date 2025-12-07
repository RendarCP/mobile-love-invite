"use client";
import { useState, useRef, Suspense } from "react";
import { Camera, Upload, X, Plus, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import NextImage from "next/image";
import { useSearchParams } from "next/navigation";

interface PreviewPhoto {
  id: string;
  file: File;
  preview: string;
  isUploading?: boolean;
  uploadProgress?: number;
  isUploaded?: boolean;
}

/**
 * 스냅사진 업로드 컴포넌트 (모달 형식)
 * 결혼식 사진을 업로드하고 메시지를 남길 수 있는 공간
 */
function PhotoUploadContent() {
  const searchParams = useSearchParams();
  const [previewPhotos, setPreviewPhotos] = useState<PreviewPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false); // 파일 처리 중 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 비디오 썸네일 생성
  const createVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.src = URL.createObjectURL(file);
      video.currentTime = 1; // 1초 지점의 프레임

      video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL("image/jpeg", 0.8);
        URL.revokeObjectURL(video.src);
        resolve(thumbnail);
      };

      video.onerror = () => {
        // 비디오 로드 실패 시 기본 이미지 사용
        resolve("");
      };
    });
  };

  // 파일 선택 처리 (미리보기용)
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessingFiles(true); // 파일 처리 시작

    try {
      for (const file of Array.from(files)) {
        // 이미지 및 동영상 파일만 허용
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) {
          toast({
            title: "파일 형식 오류",
            description: "이미지 및 동영상 파일만 업로드 가능합니다.",
            variant: "destructive",
          });
          continue;
        }

        let preview: string;

        if (file.type.startsWith("video/")) {
          // 비디오의 경우 썸네일 생성
          preview = await createVideoThumbnail(file);
        } else {
          // 이미지의 경우 기존 방식
          const reader = new FileReader();
          preview = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        }

        const newPhoto: PreviewPhoto = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview,
        };

        setPreviewPhotos((prev) => [...prev, newPhoto]);
      }
    } finally {
      setIsProcessingFiles(false); // 파일 처리 완료
    }

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 실제 업로드 처리 (클라이언트 직접 GCS 업로드)
  const handleUpload = async () => {
    if (previewPhotos.length === 0) {
      toast({
        title: "파일 선택 필요",
        description: "업로드할 파일을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // 모든 사진을 업로드 중 상태로 설정
    setPreviewPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        isUploading: true,
        uploadProgress: 0,
      }))
    );

    try {
      // 개별 사진 업로드 처리
      const uploadPromises = previewPhotos.map(async (photo) => {
        try {
          // 1단계: Signed URL 생성 요청 (10%)
          setPreviewPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, uploadProgress: 10 } : p
            )
          );

          const urlResponse = await fetch("/api/generate-upload-url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: photo.file.name,
              contentType: photo.file.type,
            }),
          });

          if (!urlResponse.ok) {
            throw new Error("URL 생성 실패");
          }

          const urlData = await urlResponse.json();

          if (!urlData.success) {
            throw new Error(urlData.message || "URL 생성 실패");
          }

          const { uploadUrl, readUrl, fileName } = urlData;

          // 2단계: GCS에 직접 업로드 (30% -> 80%)
          setPreviewPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, uploadProgress: 30 } : p
            )
          );

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": photo.file.type,
            },
            body: photo.file,
          });

          if (!uploadResponse.ok) {
            throw new Error("파일 업로드 실패");
          }

          // 3단계: 메타데이터 저장 (80% -> 100%)
          setPreviewPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, uploadProgress: 80 } : p
            )
          );

          const metadataResponse = await fetch("/api/save-photo-metadata", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "게스트",
              message: "결혼식 축하사진",
              imageUrl: readUrl,
              fileName: fileName,
            }),
          });

          if (!metadataResponse.ok) {
            console.error("메타데이터 저장 실패 (파일은 업로드됨)");
          }

          // 업로드 완료
          setPreviewPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id
                ? { ...p, uploadProgress: 100, isUploaded: true }
                : p
            )
          );

          return {
            ...photo,
            uploadedAt: new Date(),
          };
        } catch (error) {
          console.error(`파일 업로드 실패 (${photo.file.name}):`, error);
          // 해당 파일만 실패 처리
          setPreviewPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id
                ? { ...p, isUploading: false, uploadProgress: 0 }
                : p
            )
          );
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);

      // 성공한 업로드 개수 계산
      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      // 업로드 완료 후 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPreviewPhotos([]);
      setIsModalOpen(false);

      if (failCount === 0) {
        alert(`${successCount}개의 파일이 업로드되었습니다!`);
      } else {
        alert(
          `${successCount}개 업로드 성공, ${failCount}개 실패했습니다. 실패한 파일은 다시 시도해주세요.`
        );
      }
    } catch (error) {
      // 전체 오류 발생 시 업로드 상태 초기화
      setPreviewPhotos((prev) =>
        prev.map((photo) => ({
          ...photo,
          isUploading: false,
          uploadProgress: 0,
        }))
      );
      alert("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // 미리보기 사진 삭제
  const removePreviewPhoto = (id: string) => {
    setPreviewPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  // 파일 선택 버튼 클릭
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  // 모달 열기
  const openModal = () => {
    // 개발 환경에서는 조건 무시
    const isDevelopment = process.env.NODE_ENV === "development";
    if (!isDevelopment && searchParams.get("test") !== "true") {
      // 현재 날짜가 2025년 12월 27일 15시 30분 이전인지 확인
      const currentDate = new Date();
      const weddingDateTime = new Date("2025-12-27T14:30:00");

      if (currentDate < weddingDateTime) {
        const timeLeft = weddingDateTime.getTime() - currentDate.getTime();
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

        let message = `사진 업로드는 결혼식 이후(2025년 12월 27일 14시 30분)부터 가능합니다.`;

        if (daysLeft > 1) {
          message += ` ${daysLeft}일 후에 업로드해 주세요.`;
        } else if (hoursLeft > 1) {
          message += ` ${hoursLeft}시간 후에 업로드해 주세요.`;
        } else {
          message += ` 곧 업로드가 가능합니다.`;
        }

        alert(message);
        return;
      }
    }
    setIsModalOpen(true);
    setPreviewPhotos([]);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewPhotos([]);
  };

  return (
    <section className="px-6 py-8 ">
      <div className="max-w-md mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Camera className="w-8 h-8 text-wedding-primary/70" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            스냅사진 올리기
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            신랑신부의 행복한 순간을 담아주세요.
            <br />
            예쁜 추억을 함께 나누어요!
          </p>
        </div>

        {/* 업로드 모달 트리거 버튼 */}
        <div className="text-center mb-6">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Button
              onClick={openModal}
              size="sm"
              className="bg-wedding-primary hover:bg-wedding-primary/90 text-white  rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              사진 업로드하기
            </Button>

            <DialogContent className="w-full h-full m-0 rounded-none overflow-hidden flex flex-col">
              {/* 파일 처리 중 로딩 오버레이 */}
              {isProcessingFiles && (
                <div className="absolute inset-0 bg-white/95 z-50 flex items-center justify-center">
                  <div className="text-center space-y-4 px-8">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-wedding-primary/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-wedding-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-text-primary">
                        파일을 처리하고 있습니다
                      </h3>
                      <p className="text-sm text-text-secondary">
                        잠시만 기다려주세요...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <DialogHeader className="flex-shrink-0 p-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-medium text-text-primary">
                    사진 업로드
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 감성적인 문구들 */}
                <div className="text-center space-y-2 py-4 flex-shrink-0">
                  <p className="text-wedding-primary text-sm font-medium">
                    저희의 특별한 순간을 담아주셨다면, 함께 공유해주세요.
                  </p>
                  <p className="flex items-center justify-center text-red-500/60 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    파일 첨부 이후에 업로드 버튼 꼭 눌러주세요!!
                  </p>
                </div>

                {/* 파일 입력 */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* 메인 컨텐츠 영역 */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {previewPhotos.length === 0 ? (
                    /* 파일이 선택되지 않았을 때 - 2번 이미지 스타일 */
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full h-full">
                        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200 h-full">
                          <div className="flex flex-col items-center space-y-6">
                            <Upload className="w-10 h-10 text-gray-300" />
                            <div className="space-y-3">
                              <p className="text-gray-600 text-sm font-bold">
                                이미지, 동영상파일
                                <br />
                                여러 파일 동시 선택 가능
                              </p>
                              <Button
                                onClick={handleFileSelectClick}
                                className="bg-wedding-primary hover:bg-wedding-primary/20 text-white font-medium px-8 py-3 rounded-full text-base"
                              >
                                사진 첨부하기
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 파일이 선택되었을 때 - 1번 이미지 스타일의 그리드 */
                    <div className="flex-1 flex flex-col space-y-4 overflow-auto">
                      {/* 파일 그리드 - 스크롤 영역 */}
                      <div className="flex-1 overflow-y-auto max-h-full">
                        <div className="grid grid-cols-3 gap-3 pb-4">
                          {/* 선택된 파일들 */}
                          {previewPhotos.map((photo, index) => (
                            <div
                              key={photo.id}
                              className="relative group animate-fade-in"
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animationFillMode: "both",
                              }}
                            >
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative">
                                {photo.file.type.startsWith("video/") ? (
                                  <>
                                    <NextImage
                                      src={photo.preview}
                                      alt={`비디오 썸네일 ${index + 1}`}
                                      fill
                                      className={`object-cover transition-all duration-300 ${
                                        photo.isUploading ? "opacity-50" : ""
                                      }`}
                                    />
                                    {/* 비디오 재생 아이콘 */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-12 h-12 bg-white/60 text-black/50 font-bold rounded-full flex items-center justify-center">
                                        비디오
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <NextImage
                                    src={photo.preview}
                                    alt={`선택된 파일 ${index + 1}`}
                                    fill
                                    className={`object-cover transition-all duration-300 ${
                                      photo.isUploading ? "opacity-50" : ""
                                    }`}
                                  />
                                )}

                                {/* 업로드 진행률 오버레이 */}
                                {photo.isUploading && !photo.isUploaded && (
                                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                                    <div className="text-white text-xs font-medium">
                                      {photo.uploadProgress}%
                                    </div>
                                  </div>
                                )}

                                {/* 업로드 완료 체크 표시 */}
                                {photo.isUploaded && (
                                  <div className="absolute inset-0 bg-wedding-primary/40 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                      <Check className="w-5 h-5 text-green-500" />
                                    </div>
                                  </div>
                                )}

                                {/* 삭제 버튼 (업로드 중이 아닐 때만 표시) */}
                                {!photo.isUploading && !photo.isUploaded && (
                                  <button
                                    onClick={() => removePreviewPhoto(photo.id)}
                                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}

                          {/* 추가 버튼 - 더 많은 파일을 업로드할 수 있게 */}
                          {previewPhotos.length < 40 && (
                            <button
                              onClick={handleFileSelectClick}
                              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                            >
                              <Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 항상 표시되는 하단 버튼들 */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    onClick={closeModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                    disabled={isUploading || isProcessingFiles}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={
                      previewPhotos.length === 0 ||
                      isUploading ||
                      isProcessingFiles
                    }
                    className={`flex-1 relative overflow-hidden ${
                      previewPhotos.length === 0 || isProcessingFiles
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-wedding-primary hover:bg-wedding-primary/90 text-white"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        업로드 중...
                        {/* 전체 진행률 표시 */}
                        <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                          <div
                            className="h-full bg-white/60 transition-all duration-500 ease-out"
                            style={{
                              width: `${
                                previewPhotos.length > 0
                                  ? previewPhotos.reduce(
                                      (acc, photo) =>
                                        acc + (photo.uploadProgress || 0),
                                      0
                                    ) / previewPhotos.length
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        업로드 ({previewPhotos.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-text-secondary/70">
            💡 사진 업로드는 2025.12.27 14:30부터 업로드 가능합니다.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Suspense로 감싸진 PhotoUpload 컴포넌트
 */
export default function PhotoUpload() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhotoUploadContent />
    </Suspense>
  );
}
