import { useState, useRef } from "react";
import { Camera, Upload, X, Heart, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PreviewPhoto {
  id: string;
  file: File;
  preview: string;
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  uploadedAt: Date;
}

/**
 * 스냅사진 업로드 컴포넌트 (모달 형식)
 * 결혼식 사진을 업로드하고 메시지를 남길 수 있는 공간
 */
export default function PhotoUpload() {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [previewPhotos, setPreviewPhotos] = useState<PreviewPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 처리 (미리보기용)
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // 이미지 파일만 허용
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하로 제한됩니다.");
        return;
      }

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
      alert("업로드할 사진을 선택해주세요.");
      return;
    }

    setIsUploading(true);

    try {
      // 실제 업로드 로직 (현재는 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 미리보기 사진들을 업로드된 사진으로 이동
      const newUploadedPhotos: UploadedPhoto[] = previewPhotos.map((photo) => ({
        ...photo,
        uploadedAt: new Date(),
      }));

      setUploadedPhotos((prev) => [...prev, ...newUploadedPhotos]);
      setPreviewPhotos([]);
      setIsModalOpen(false);

      alert(`${newUploadedPhotos.length}장의 사진이 업로드되었습니다!`);
    } catch (error) {
      alert("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // 업로드된 사진 삭제
  const removeUploadedPhoto = (id: string) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== id));
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
    setIsModalOpen(true);
    setPreviewPhotos([]);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewPhotos([]);
  };

  return (
    <section className="px-6 py-8 bg-cream-primary/20">
      <div className="max-w-md mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Camera className="w-8 h-8 text-rose-primary/70" />
          </div>
          <h2 className="text-xl font-medium text-text-primary mb-2">
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
            <DialogTrigger asChild>
              <Button
                onClick={openModal}
                className="bg-rose-primary hover:bg-rose-primary/90 text-white px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                사진 업로드하기
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-medium text-text-primary">
                  📸 스냅사진 업로드
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* 파일 선택 영역 */}
                <Card className="border-2 border-dashed border-rose-primary/30 bg-white hover:border-rose-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-rose-primary/10 rounded-full flex items-center justify-center mb-3">
                          <Image className="w-8 h-8 text-rose-primary/70" />
                        </div>

                        <Button
                          onClick={handleFileSelectClick}
                          className="bg-rose-primary hover:bg-rose-secondary text-white"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          사진 선택하기
                        </Button>
                      </div>

                      <p className="text-xs text-text-secondary">
                        JPG, PNG 파일 (최대 5MB)
                        <br />
                        여러 장 동시 선택 가능
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 선택된 사진 미리보기 */}
                {previewPhotos.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="w-4 h-4 text-rose-primary" />
                      <span className="text-sm text-text-secondary">
                        선택된 사진 {previewPhotos.length}장
                      </span>
                      <Heart className="w-4 h-4 text-rose-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
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
                            <img
                              src={photo.preview}
                              alt={`선택된 사진 ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* 삭제 버튼 */}
                            <button
                              onClick={() => removePreviewPhoto(photo.id)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-110"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 업로드 버튼 */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={closeModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                    disabled={isUploading}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={previewPhotos.length === 0 || isUploading}
                    className="flex-1 bg-rose-primary hover:bg-rose-primary/90 text-white"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        업로드 중...
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

        {/* 업로드된 사진 갤러리 */}
        {uploadedPhotos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-4 h-4 text-rose-primary" />
              <span className="text-sm text-text-secondary">
                업로드된 사진 {uploadedPhotos.length}장
              </span>
              <Heart className="w-4 h-4 text-rose-primary" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {uploadedPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative group animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <img
                      src={photo.preview}
                      alt={`업로드된 사진 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => removeUploadedPhoto(photo.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                      <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                        클릭하여 삭제
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-text-secondary/70">
            💡 사진 업로드 후 2026.10.24 12:30부터
            <br />
            업로드 가능합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
