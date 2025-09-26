import { useState, useRef } from "react";
import { Camera, Upload, X, Heart, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import NextImage from "next/image";

interface PreviewPhoto {
  id: string;
  file: File;
  preview: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

/**
 * 스냅사진 업로드 컴포넌트 (모달 형식)
 * 결혼식 사진을 업로드하고 메시지를 남길 수 있는 공간
 */
export default function PhotoUpload() {
  const [previewPhotos, setPreviewPhotos] = useState<PreviewPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 파일 선택 처리 (미리보기용)
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // 이미지 및 동영상 파일만 허용
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast({
          title: "파일 형식 오류",
          description: "이미지 및 동영상 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }

      // // 파일 크기 제한 (1GB)
      // if (file.size > 10 * 1024 * 1024) {
      //   alert("파일 크기는 10MB 이하로 제한됩니다.");
      //   return;
      // }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: PreviewPhoto = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
        };

        setPreviewPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 실제 업로드 처리
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
        // 업로드 시작 시뮬레이션
        setPreviewPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id ? { ...p, uploadProgress: 10 } : p
          )
        );

        const formData = new FormData();
        formData.append("name", "게스트"); // 기본값, 필요시 입력 필드 추가
        formData.append("message", "결혼식 축하사진"); // 기본값, 필요시 입력 필드 추가
        formData.append("photo", photo.file);

        // 진행률 시뮬레이션
        setPreviewPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id ? { ...p, uploadProgress: 30 } : p
          )
        );

        const response = await fetch("/api/photo-upload", {
          method: "POST",
          body: formData,
        });

        setPreviewPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id ? { ...p, uploadProgress: 70 } : p
          )
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "업로드 실패");
        }

        setPreviewPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id ? { ...p, uploadProgress: 100 } : p
          )
        );

        return {
          ...photo,
          uploadedAt: new Date(),
        };
      });

      const newUploadedPhotos = await Promise.all(uploadPromises);

      // 업로드 완료 후 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPreviewPhotos([]);
      setIsModalOpen(false);

      // toast({
      //   title: "업로드 완료",
      //   description: `${newUploadedPhotos.length}개의 파일이 업로드되었습니다!`,
      // });
      alert(`${newUploadedPhotos.length}개의 파일이 업로드되었습니다!`);
    } catch (error) {
      // 오류 발생 시 업로드 상태 초기화
      setPreviewPhotos((prev) =>
        prev.map((photo) => ({
          ...photo,
          isUploading: false,
          uploadProgress: 0,
        }))
      );
      // toast({
      //   title: "업로드 실패",
      //   description: "업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
      //   variant: "destructive",
      // });
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

    if (!isDevelopment) {
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

            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-medium text-text-primary">
                    사진 업로드
                  </DialogTitle>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </DialogHeader>

              <div>
                {/* 감성적인 문구들 */}
                <div className="text-center space-y-2 py-4">
                  <p className="text-wedding-primary text-sm font-medium">
                    저희의 특별한 순간을 담아주셨다면, 함께 공유해주세요.
                  </p>
                  <p className="text-text-secondary text-xs">
                    예쁜 사진을 올려주시면 큰 추억이 됩니다.
                  </p>
                  <p className="text-text-secondary text-xs">
                    함께한 순간을 사진으로 나눠주세요.
                  </p>
                </div>

                {/* 파일 선택 영역 */}
                <Card className="border-2 border-dashed border-rose-primary/30 bg-white hover:border-rose-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-rose-primary/10 rounded-full flex items-center justify-center mb-3">
                          <Image
                            className="w-8 h-8 text-rose-primary/70"
                            aria-label="파일 업로드 아이콘"
                          />
                        </div>

                        <Button
                          size="sm"
                          onClick={handleFileSelectClick}
                          className="bg-wedding-primary hover:bg-wedding-secondary text-white"
                        >
                          <Image
                            className="w-4 h-4 mr-2"
                            aria-label="파일 선택 아이콘"
                          />
                          사진/동영상 선택하기
                        </Button>
                      </div>

                      <p className="text-xs text-text-secondary">
                        이미지, 동영상 파일
                        <br />
                        여러 파일 동시 선택 가능
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 선택된 사진 미리보기 */}
                {previewPhotos.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="w-4 h-4 text-wedding-primary" />
                      <span className="text-sm text-text-secondary">
                        선택된 파일 {previewPhotos.length}개
                      </span>
                      <Heart className="w-4 h-4 text-wedding-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
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
                              <video
                                src={photo.preview}
                                className={`w-full h-full object-cover transition-all duration-300 ${
                                  photo.isUploading ? "opacity-50" : ""
                                }`}
                                muted
                                loop
                                playsInline
                              />
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
                            {photo.isUploading && (
                              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                                <div className="text-white text-xs font-medium">
                                  {photo.uploadProgress}%
                                </div>
                                <div className="w-16 h-1 bg-white/30 rounded-full mt-2 overflow-hidden">
                                  <div
                                    className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                                    style={{
                                      width: `${photo.uploadProgress}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* 삭제 버튼 (업로드 중이 아닐 때만 표시) */}
                            {!photo.isUploading && (
                              <button
                                onClick={() => removePreviewPhoto(photo.id)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-110"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 업로드 버튼 */}
                <div className="flex space-x-3 mt-4">
                  <Button
                    size="sm"
                    onClick={closeModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                    disabled={isUploading}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={previewPhotos.length === 0 || isUploading}
                    className="flex-1 bg-wedding-primary hover:bg-wedding-primary/90 text-white relative overflow-hidden"
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
            💡 사진 업로드는 2025.12.27 12:30부터 업로드 가능합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
