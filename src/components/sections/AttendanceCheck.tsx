import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, CheckCircle } from "lucide-react";

// Next.js API 라우트 사용
const submitToAPI = async (data: IAttendanceFormData) => {
  const payload = {
    side: data.side,
    name: data.name,
    attendeeCount: data.attendeeCount,
    mealOption: data.mealOption,
    message: "", // 추가 메시지 필드 (필요시)
  };

  try {
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log("API에 데이터 전송 완료:", payload);
      return true;
    } else {
      console.error("API 응답 오류:", result.message);
      return false;
    }
  } catch (error) {
    console.error("API 전송 실패:", error);
    return false;
  }
};

/**
 * 참석의사 전송 데이터 인터페이스
 */
interface IAttendanceFormData {
  /** 신랑측/신부측 구분 */
  side: "groom" | "bride";
  /** 참석자 성함 */
  name: string;
  /** 참석 인원 수 */
  attendeeCount: number;
  /** 식사 여부 */
  mealOption: "yes" | "no" | "undecided";
}

/**
 * AttendanceCheck 컴포넌트의 props 인터페이스
 */
interface IAttendanceCheckProps {
  /** 컴포넌트 클래스명 */
  className?: string;
}

/**
 * 참석의사 확인 컴포넌트
 * 구글시트와 연결하여 참석 정보를 수집합니다.
 *
 * @param props - AttendanceCheck 컴포넌트 props
 * @returns React 컴포넌트
 */

const AttendanceCheck: React.FC<IAttendanceCheckProps> = ({
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [formData, setFormData] = useState<IAttendanceFormData>({
    side: "groom",
    name: "",
    attendeeCount: 1,
    mealOption: "yes",
  });

  // 폼 데이터 변경 핸들러
  const handleFormChange = (
    field: keyof IAttendanceFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.name.trim()) {
      alert("성함을 입력해주세요.");
      return;
    }

    if (formData.attendeeCount < 1) {
      alert("참석 인원을 올바르게 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(0);

    try {
      // 진행률 시뮬레이션
      setSubmitProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 200));

      setSubmitProgress(40);
      await new Promise((resolve) => setTimeout(resolve, 200));

      setSubmitProgress(60);
      // Next.js API 라우트 사용
      const success = await submitToAPI(formData);

      setSubmitProgress(80);
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (success) {
        setSubmitProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsSubmitted(true);
        // 2초 후 모달 닫기
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          setSubmitProgress(0);
          // 폼 초기화
          setFormData({
            side: "groom",
            name: "",
            attendeeCount: 1,
            mealOption: "yes",
          });
        }, 2000);
      } else {
        alert("참석의사 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("제출 중 오류:", error);
      alert("참석의사 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setIsSubmitted(false);
    }
  };

  return (
    <div className={`text-center ${className}`}>
      {/* R.S.V.P. 섹션 */}
      <div className="mb-6">
        <p className="text-xs text-text-secondary/60 tracking-widest mb-2">
          R.S.V.P.
        </p>
        <h3 className="text-lg font-medium text-text-primary mb-4">
          참석 의사 전달
        </h3>
      </div>

      {/* 안내 메시지 */}
      <div className="text-text-secondary leading-relaxed space-y-2 text-sm mb-6">
        <p>
          신랑, 신부에게 참석의사를
          <br />
          미리 전달할 수 있어요.
        </p>
      </div>

      {/* 참석의사 전달하기 버튼 */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-wedding-primary hover:bg-wedding-primary/90 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
        size="sm"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        참석의사 전달하기
      </Button>

      {/* 참석의사 전달 모달 */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-sm mx-auto p-0 bg-white rounded-lg overflow-hidden">
          <DialogTitle className="sr-only">참석의사 전달</DialogTitle>
          {/* 성공 화면 */}
          {isSubmitted ? (
            <div className="p-8 text-center">
              <div className="mb-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                전달 완료!
              </h3>
              <p className="text-text-secondary text-sm">
                참석의사가 성공적으로 전달되었습니다.
              </p>
            </div>
          ) : (
            <>
              {/* 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-text-primary">
                  참석의사 전달
                </h3>
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* 폼 */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* 구분 (신랑측/신부측) */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    구분
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleFormChange("side", "groom")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        formData.side === "groom"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      신랑측
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormChange("side", "bride")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        formData.side === "bride"
                          ? "bg-rose-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      신부측
                    </button>
                  </div>
                </div>

                {/* 성함 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    성함
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="참석 대표자의 성함을 입력해주세요"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-primary/20 focus:border-rose-primary"
                    required
                  />
                </div>

                {/* 참석인원 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    참석인원
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleFormChange(
                          "attendeeCount",
                          Math.max(1, formData.attendeeCount - 1)
                        )
                      }
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium text-text-primary min-w-[2rem] text-center">
                      {formData.attendeeCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleFormChange(
                          "attendeeCount",
                          formData.attendeeCount + 1
                        )
                      }
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 식사여부 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    식사여부
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "yes", label: "예정" },
                      { value: "no", label: "안함" },
                      { value: "undecided", label: "미정" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="mealOption"
                          value={option.value}
                          checked={formData.mealOption === option.value}
                          onChange={(e) =>
                            handleFormChange("mealOption", e.target.value)
                          }
                          className="w-4 h-4 text-rose-primary border-gray-300 focus:ring-rose-primary/20"
                        />
                        <span className="text-sm text-text-secondary">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="md"
                    disabled={isSubmitting}
                    className="w-full bg-wedding-primary hover:bg-wedding-primary/90 text-white py-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          전송 중... ({submitProgress}%)
                        </div>
                        {/* 진행률 바 */}
                        <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                          <div
                            className="h-full bg-white/60 transition-all duration-500 ease-out"
                            style={{ width: `${submitProgress}%` }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      "참석 의사 전달하기"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceCheck;
