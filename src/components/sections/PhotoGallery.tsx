import { useState, useEffect, useCallback } from "react";
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );

  const displayedPhotos = showAll ? photos : photos.slice(0, 6);

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
    setSlideDirection("right");

    setTimeout(() => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);

      setTimeout(() => {
        setSlideDirection(null);
        setIsTransitioning(false);
      }, 50);
    }, 150);
  }, [isTransitioning, currentIndex]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setSlideDirection("left");

    setTimeout(() => {
      const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);

      setTimeout(() => {
        setSlideDirection(null);
        setIsTransitioning(false);
      }, 50);
    }, 150);
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
            onClick={() => setShowAll(true)}
            className="rounded-full px-8 py-2 bg-rose-primary hover:bg-rose-secondary text-white"
          >
            사진 더 보기
          </Button>
        </div>
      )}

      {/* 사진 모달 */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => closeModal()}>
          <DialogContent className="max-w-full w-full h-full max-h-screen p-0 bg-black border-none">
            <div className="relative w-full h-full flex items-center justify-center z-100">
              {/* 사진 갯수 표시 (왼쪽 위) */}
              <div className="absolute top-6 left-6 z-50 text-white/80 text-sm font-light bg-rose-primary rounded-full px-2 py-1">
                {currentIndex + 1} / {photos.length}
              </div>

              {/* 닫기 버튼 (오른쪽 위) */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-50 text-gray-500 hover:text-gray-300 transition-colors duration-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 이전 버튼 */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 text-white/70 hover:text-white transition-colors duration-200 p-2"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* 다음 버튼 */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 text-white/70 hover:text-white transition-colors duration-200 p-2"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* 이미지 - 슬라이드 효과와 함께 꽉차게 표시 */}
              <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className={`w-full h-full ${
                    slideDirection === "left"
                      ? "slide-exit-left"
                      : slideDirection === "right"
                      ? "slide-exit-right"
                      : isTransitioning
                      ? "opacity-0"
                      : "opacity-100"
                  } transition-opacity duration-200 ease-out`}
                >
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
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
