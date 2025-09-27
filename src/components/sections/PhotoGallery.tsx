import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

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
    src: "/images/hanok.webp",
    alt: "웨딩 사진 1",
    caption: "함께 걸어가는 우리의 첫 걸음",
  },
  {
    id: 2,
    src: "/images/cute.webp",
    alt: "웨딩 사진 2",
    caption: "행복한 순간",
  },
  {
    id: 3,
    src: "/images/hoejin.webp",
    alt: "웨딩 사진 3",
    caption: "서로를 바라보는 시간",
  },
  {
    id: 4,
    src: "/images/seongwook.webp",
    alt: "웨딩 사진 4",
    caption: "아름다운 신부",
  },
  {
    id: 5,
    src: "/images/wedding.webp",
    alt: "웨딩 사진 5",
    caption: "자연스러운 미소",
  },
  {
    id: 6,
    src: "/images/bus.webp",
    alt: "웨딩 사진 6",
    caption: "멋진 신랑",
  },
  {
    id: 7,
    src: "/images/sunset.webp",
    alt: "웨딩 사진 7",
    caption: "달콤한 순간",
  },
  {
    id: 8,
    src: "/images/together.webp",
    alt: "웨딩 사진 8",
    caption: "함께하는 시간",
  },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const openModal = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeModal = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
      setIsTransitioning(false);
    }, 200);
  }, [isTransitioning, currentIndex]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
      setIsTransitioning(false);
    }, 200);
  }, [isTransitioning, currentIndex]);

  // 터치/스와이프 지원
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // 키보드 네비게이션 지원
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedPhoto, goToPrevious, goToNext, closeModal]);

  return (
    <div>
      {/* 갤러리 헤더 */}
      <div className="text-center mb-6">
        <p className="text-text-secondary text-sm tracking-widest mb-2">
          GALLERY
        </p>
        <h2 className="text-xl font-bold text-text-primary">갤러리</h2>
      </div>

      {/* 사진 그리드 - 마사지 스타일 레이아웃 */}
      <div className="space-y-2 mb-6">
        {/* 첫 번째 줄 - 큰 사진 1개 + 작은 사진 2개 */}
        <div className="grid grid-cols-2 gap-2 aspect-[3/2]">
          {/* 왼쪽 큰 사진 */}
          {photos[0] && (
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
              onClick={() => openModal(photos[0], 0)}
            >
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                width={300}
                height={200}
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
            {photos.slice(1, 3).map((photo, index) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
                onClick={() => openModal(photo, index + 1)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={150}
                  height={100}
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
            {photos.slice(3, 5).map((photo, index) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
                onClick={() => openModal(photo, index + 3)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={150}
                  height={100}
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
          {photos[5] && (
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
              onClick={() => openModal(photos[5], 5)}
            >
              <Image
                src={photos[5].src}
                alt={photos[5].alt}
                width={300}
                height={200}
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
        {photos.length > 6 && (
          <div className="grid grid-cols-3 gap-2 aspect-[4/1]">
            {photos.slice(6).map((photo, index) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100"
                onClick={() => openModal(photo, index + 6)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={100}
                  height={75}
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

      {/* 사진 모달 - 간단한 슬라이드 */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => closeModal()}>
          <DialogContent className="max-w-full w-full h-full max-h-screen px-0 py-4 bg-black border-none">
            <DialogTitle className="sr-only">사진 갤러리</DialogTitle>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* 닫기 버튼 (오른쪽 위) */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-50 text-black hover:text-gray-300 transition-colors duration-200 p-1 outline-none focus:outline-none focus-visible:outline-none"
              >
                <X className="w-7 h-7" />
              </button>

              {/* 하단 컨트롤 영역 */}
              <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6">
                {/* 이전 버튼 */}
                <button
                  onClick={goToPrevious}
                  className="text-black/70  transition-colors duration-200 p-2 rounded-full outline-none focus:outline-none focus-visible:outline-none"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                {/* 사진 갯수 표시 */}
                <div className="text-black/80 text-md font-light rounded-full px-3 py-1">
                  {currentIndex + 1} / {photos.length}
                </div>

                {/* 다음 버튼 */}
                <button
                  onClick={goToNext}
                  className="text-black/70  transition-colors duration-200 p-2 rounded-full outline-none focus:outline-none focus-visible:outline-none"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>

              {/* 이미지 - 부드러운 페이드 효과 */}
              <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className={`w-full h-full transition-all duration-300 ease-in-out ${
                    isTransitioning
                      ? "opacity-0 scale-95"
                      : "opacity-100 scale-100"
                  }`}
                >
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    width={800}
                    height={600}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                    priority
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
