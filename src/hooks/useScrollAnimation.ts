import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

/**
 * 스크롤 시 요소가 화면에 나타날 때 애니메이션을 실행하는 훅
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -80px 0px",
    delay = 0,
  } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 지연시간 후 애니메이션 실행
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // 한 번 실행되면 observer 해제 (반복 실행 방지)
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, delay]);

  return { elementRef, isVisible };
};

/**
 * 여러 섹션에 순차적으로 애니메이션을 적용하는 훅
 */
export const useSequentialAnimation = (
  sectionCount: number,
  interval: number = 200
) => {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(sectionCount).fill(null)
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // 순차적으로 애니메이션 실행
            setTimeout(() => {
              setVisibleSections((prev) => {
                if (!prev.includes(index)) {
                  return [...prev, index].sort((a, b) => a - b);
                }
                return prev;
              });
            }, index * interval);

            observer.unobserve(section);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [interval]);

  const setSectionRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  };

  const isSectionVisible = (index: number) => visibleSections.includes(index);

  return { setSectionRef, isSectionVisible };
};
