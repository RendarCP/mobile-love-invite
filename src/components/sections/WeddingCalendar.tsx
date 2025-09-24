import { useState, useEffect } from "react";

interface WeddingCalendarProps {
  weddingDate: Date;
}

export default function WeddingCalendar({ weddingDate }: WeddingCalendarProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 시간 업데이트
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2025년 12월로 고정
  const year = 2025;
  const month = 11; // 12월 (0-based)
  const weddingDay = 27;

  // 해당 월의 첫 번째 날과 마지막 날
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // 달력에 표시할 날짜들 생성
  const calendarDays = [];

  // 12월 1일의 요일 계산 (0=일요일, 1=월요일, ...)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // 빈 공간을 위한 더미 데이터 (이전 달 날짜 대신)
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({
      day: null,
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }

  // 12월 날짜들만 표시
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day: day,
      isCurrentMonth: true,
      isPrevMonth: false,
    });
  }

  // D-day 계산 (클라이언트에서만)
  const timeDiff = currentTime
    ? weddingDate.getTime() - currentTime.getTime()
    : 0;
  const daysUntil = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursUntil = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsUntil = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm mx-auto">
      {/* 날짜 헤더 */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-text-primary mb-2">
          2025.12.27
        </h2>
        <p className="text-text-secondary text-sm">토요일 오후 1시 30분</p>
      </div>

      {/* 달력 그리드 */}
      <div className="mb-6">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => {
            const isWeekend = index === 0 || index === 6; // 일요일(0) 또는 토요일(6)
            return (
              <div
                key={day}
                className={`text-center text-sm font-medium py-2 ${
                  isWeekend ? "text-gray-400 opacity-60" : "text-text-primary"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dateObj, index) => {
            const isWeddingDay =
              dateObj.isCurrentMonth && dateObj.day === weddingDay;
            const dayOfWeek = index % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <div
                key={index}
                className={`
                  h-8 w-8 flex items-center justify-center text-sm rounded-full mx-auto
                  ${
                    isWeddingDay
                      ? "bg-wedding-primary text-white font-bold shadow-lg"
                      : dateObj.isCurrentMonth
                      ? `text-text-primary hover:bg-gray-100 ${
                          isWeekend ? "text-gray-400 opacity-60" : ""
                        }`
                      : "text-transparent"
                  }
                `}
              >
                {dateObj.day}
              </div>
            );
          })}
        </div>
      </div>

      {/* D-day 카운터 */}
      <div className="text-center">
        {isClient ? (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-wedding-primary">
                  {Math.abs(daysUntil)}
                </div>
                <div className="text-xs text-text-secondary">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wedding-primary">
                  {Math.abs(hoursUntil)}
                </div>
                <div className="text-xs text-text-secondary">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wedding-primary">
                  {Math.abs(minutesUntil)}
                </div>
                <div className="text-xs text-text-secondary">MIN</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-wedding-primary">
                  {Math.abs(secondsUntil)}
                </div>
                <div className="text-xs text-text-secondary">SEC</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-text-secondary text-sm">
                성욱 ♥ 회진의 결혼식이{" "}
                <span className="text-wedding-primary font-bold">
                  {Math.abs(daysUntil)}일
                </span>{" "}
                남았습니다.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              성욱 ♥ 회진의 결혼식까지 카운트다운을 불러오는 중...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
