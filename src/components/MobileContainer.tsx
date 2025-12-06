import React from "react";

/**
 * MobileContainer의 props 인터페이스
 */
interface IMobileContainerProps {
  /** 자식 컴포넌트 */
  children: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 모바일 뷰 컨테이너 컴포넌트
 * 최대 너비를 md(768px)로 제한하고 중앙 정렬하며, 그림자와 최소 높이를 설정합니다.
 *
 * @param props - 컴포넌트 props
 * @returns React 컴포넌트
 */
const MobileContainer: React.FC<IMobileContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`max-w-md mx-auto bg-white shadow-lg min-h-screen-mobile ${className}`}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
};

export default MobileContainer;
