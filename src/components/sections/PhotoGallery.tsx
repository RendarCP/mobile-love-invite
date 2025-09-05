import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

// 샘플 웨딩 사진 데이터 (플레이스홀더 이미지 사용)
const photos: Photo[] = [
  {
    id: 1,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 1",
    caption: "함께 걸어가는 우리의 첫 걸음",
  },
  {
    id: 2,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 2",
    caption: "행복한 순간",
  },
  {
    id: 3,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 3",
    caption: "서로를 바라보는 시간",
  },
  {
    id: 4,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 4",
    caption: "아름다운 신부",
  },
  {
    id: 5,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 5",
    caption: "자연스러운 미소",
  },
  {
    id: 6,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 6",
    caption: "멋진 신랑",
  },
  {
    id: 7,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 7",
    caption: "달콤한 순간",
  },
  {
    id: 8,
    src: "/images/KSC03250_s-1.jpg",
    alt: "웨딩 사진 8",
    caption: "함께하는 시간",
  },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const displayedPhotos = showAll ? photos : photos.slice(0, 6);

  const openModal = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  return (
    <div>
      {/* 갤러리 헤더 */}
      <div className="text-center mb-6">
        <p className="text-text-secondary text-sm tracking-widest mb-2">
          GALLERY
        </p>
        <h2 className="text-xl font-medium text-text-primary">갤러리</h2>
      </div>

      {/* 사진 그리드 - 마사지 스타일 레이아웃 */}
      <div className="space-y-2 mb-6">
        {/* 첫 번째 줄 - 큰 사진 1개 + 작은 사진 2개 */}
        <div className="grid grid-cols-2 gap-2 aspect-[3/2]">
          {/* 왼쪽 큰 사진 */}
          {displayedPhotos[0] && (
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
              onClick={() => openModal(displayedPhotos[0], 0)}
            >
              <img
                src={displayedPhotos[0].src}
                alt={displayedPhotos[0].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            </div>
          )}

          {/* 오른쪽 작은 사진 2개 */}
          <div className="grid grid-rows-2 gap-2">
            {displayedPhotos.slice(1, 3).map((photo, index) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
                onClick={() => openModal(photo, index + 1)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* 두 번째 줄 - 작은 사진 2개 + 큰 사진 1개 */}
        <div className="grid grid-cols-2 gap-2 aspect-[3/2]">
          {/* 왼쪽 작은 사진 2개 */}
          <div className="grid grid-rows-2 gap-2">
            {displayedPhotos.slice(3, 5).map((photo, index) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
                onClick={() => openModal(photo, index + 3)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* 오른쪽 큰 사진 */}
          {displayedPhotos[5] && (
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
              onClick={() => openModal(displayedPhotos[5], 5)}
            >
              <img
                src={displayedPhotos[5].src}
                alt={displayedPhotos[5].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            </div>
          )}
        </div>

        {/* 세 번째 줄 - 남은 사진들을 3열로 */}
        {showAll && displayedPhotos.length > 6 && (
          <div className="grid grid-cols-3 gap-2 aspect-[4/1]">
            {displayedPhotos.slice(6).map((photo, index) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
                onClick={() => openModal(photo, index + 6)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 더보기 버튼 */}
      {!showAll && photos.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="rounded-full px-8 py-2 border-gray-300 text-text-secondary hover:bg-gray-50"
          >
            사진 더 보기
          </Button>
        </div>
      )}

      {/* 사진 모달 */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => closeModal()}>
          <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0 bg-black">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* 닫기 버튼 */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* 이전 버튼 */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              {/* 다음 버튼 */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* 이미지 */}
              <div className="w-full h-full flex items-center justify-center p-8">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* 캡션 */}
              {selectedPhoto.caption && (
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    {selectedPhoto.caption}
                  </p>
                </div>
              )}

              {/* 사진 인덱스 */}
              <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
