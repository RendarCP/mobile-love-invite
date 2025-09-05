import { useState, useEffect } from "react";

interface WeddingCalendarProps {
  weddingDate: Date;
}

export default function WeddingCalendar({ weddingDate }: WeddingCalendarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 실시간 업데이트를 위한 useEffect
  useEffect(() => {
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
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay(); // 0 = 일요일
  const daysInMonth = lastDay.getDate();

  // 달력에 표시할 날짜들 생성
  const calendarDays = [];

  // 이전 달의 마지막 날짜들
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = prevMonth.getDate();

  // 이전 달의 날짜들로 빈 칸 채우기
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      isPrevMonth: true,
    });
  }

  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day: day,
      isCurrentMonth: true,
      isPrevMonth: false,
    });
  }

  // 다음 달의 날짜들로 나머지 칸 채우기
  const remainingCells = 42 - calendarDays.length; // 6주 * 7일
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day: day,
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }

  // D-day 계산 (실시간)
  const timeDiff = weddingDate.getTime() - currentTime.getTime();
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
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-medium py-2 ${
                index === 0
                  ? "text-red-500"
                  : index === 6
                  ? "text-blue-500"
                  : "text-text-secondary"
              }`}
            >
              {day}
            </div>
          ))}
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
                      ? "bg-rose-primary text-white font-bold shadow-lg"
                      : dateObj.isCurrentMonth
                      ? `text-text-primary hover:bg-gray-100 ${
                          isWeekend
                            ? dayOfWeek === 0
                              ? "text-red-500"
                              : "text-blue-500"
                            : ""
                        }`
                      : "text-gray-300"
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
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-primary">
              {Math.abs(daysUntil)}
            </div>
            <div className="text-xs text-text-secondary">DAYS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-primary">
              {Math.abs(hoursUntil)}
            </div>
            <div className="text-xs text-text-secondary">HOURS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-primary">
              {Math.abs(minutesUntil)}
            </div>
            <div className="text-xs text-text-secondary">MIN</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-primary">
              {Math.abs(secondsUntil)}
            </div>
            <div className="text-xs text-text-secondary">SEC</div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-text-secondary text-sm">
            성욱 ♥ 회진의 결혼식이{" "}
            <span className="text-rose-primary font-medium">
              {Math.abs(daysUntil)}일
            </span>{" "}
            남았습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
