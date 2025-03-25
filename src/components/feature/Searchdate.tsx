import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import styles from '../../style/Searchdate.module.scss';

// dayjs 한국어 설정
dayjs.locale('ko');

// 요일 한글 약자
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 타입 정의 추가
interface SearchdateProps {
  onSelectRange?: (range: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }) => void;
  onClose?: () => void;
}

interface DayInfo {
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
  day: number;
}

const Searchdate: React.FC<SearchdateProps> = ({ onSelectRange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // 날짜 선택 처리
  const handleDateClick = (day: DayInfo) => {
    const clickedDate = day.date;
    
    // 과거 날짜는 선택 불가
    if (clickedDate.isBefore(dayjs().startOf('day'))) {
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // 시작일 선택 또는 새로운 선택 시작
      setStartDate(clickedDate);
      setEndDate(null);
    } else {
      // 시작일이 이미 선택된 상태에서의 클릭
      if (clickedDate.isBefore(startDate)) {
        // 선택한 날짜가 시작일보다 이전이면, 새로운 시작일로 설정
        setStartDate(clickedDate);
      } else if (clickedDate.isSame(startDate, 'day')) {
        // 시작일 다시 클릭 시 선택 해제
        setStartDate(null);
      } else {
        // 시작일 이후 날짜 클릭 시 종료일로 설정
        setEndDate(clickedDate);
      }
    }
  };

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  // 날짜가 선택된 범위 안에 있는지 확인
  const isInRange = (day: DayInfo) => {
    if (!startDate || !endDate) return false;
    return day.date.isAfter(startDate) && day.date.isBefore(endDate);
  };

  // 날짜 선택 상태 확인
  const getDateStatus = (day: DayInfo): string => {
    const date = day.date;
    const today = dayjs().startOf('day');
    
    // 비활성화 상태 (과거 날짜)
    if (date.isBefore(today)) {
      return 'disabled';
    }
    
    // 시작일
    if (startDate && date.isSame(startDate, 'day')) {
      return 'start';
    }
    
    // 종료일
    if (endDate && date.isSame(endDate, 'day')) {
      return 'end';
    }
    
    // 범위 내 날짜
    if (isInRange(day)) {
      return 'inRange';
    }
    
    // 일반 날짜
    return 'normal';
  };

  // 달력 월 생성 함수
  const createMonthDays = (month: dayjs.Dayjs): DayInfo[] => {
    const firstDayOfMonth = month.startOf('month');
    const lastDayOfMonth = month.endOf('month');
    const startDay = firstDayOfMonth.day(); // 0: 일요일, 1: 월요일, ...
    const daysInMonth = lastDayOfMonth.date();
    
    // 이전 달의 날짜들
    const prevMonthDays: DayInfo[] = [];
    for (let i = 0; i < startDay; i++) {
      const date = firstDayOfMonth.subtract(startDay - i, 'day');
      prevMonthDays.push({
        date,
        isCurrentMonth: false,
        day: date.date()
      });
    }
    
    // 현재 달의 날짜들
    const currentMonthDays: DayInfo[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = month.date(i);
      currentMonthDays.push({
        date,
        isCurrentMonth: true,
        day: i
      });
    }
    
    // 다음 달의 날짜들
    const nextMonthDays: DayInfo[] = [];
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingDays; i++) {
      const date = lastDayOfMonth.add(i, 'day');
      nextMonthDays.push({
        date,
        isCurrentMonth: false,
        day: date.date()
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // 선택 초기화
  const resetSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  // 선택 완료
  const confirmSelection = () => {
    if (onSelectRange && startDate) {
      onSelectRange({
        startDate,
        endDate: endDate || startDate // 종료일이 없으면 시작일과 동일하게
      });
    }
    
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  // 현재 달과 다음 달의 데이터 생성
  const currentMonthDays = createMonthDays(currentMonth);
  const nextMonthDays = createMonthDays(currentMonth.add(1, 'month'));

  // 주 단위로 날짜 분할
  const chunkedCurrentMonth: DayInfo[][] = [];
  const chunkedNextMonth: DayInfo[][] = [];
  
  for (let i = 0; i < currentMonthDays.length; i += 7) {
    chunkedCurrentMonth.push(currentMonthDays.slice(i, i + 7));
  }
  
  for (let i = 0; i < nextMonthDays.length; i += 7) {
    chunkedNextMonth.push(nextMonthDays.slice(i, i + 7));
  }

  if (!isOpen) return null;

  return (
    <div className={styles.dateRangePicker}>
      <div className={styles.calendarsContainer}>
        {/* 현재 달 캘린더 */}
        <div className={styles.calendar}>
          <div className={styles.calendarNav}>
            <span className={styles.monthTitle}>{currentMonth.format('YYYY년 M월')}</span>
          </div>
          
          <div className={styles.weekdays}>
            {WEEKDAYS.map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>
          
          <div className={styles.days}>
            {chunkedCurrentMonth.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className={styles.week}>
                {week.map((day, dayIndex) => {
                  const status = getDateStatus(day);
                  return (
                    <div
                      key={`day-${dayIndex}`}
                      className={`${styles.day} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${styles[status]}`}
                      onClick={() => day.isCurrentMonth && handleDateClick(day)}
                    >
                      {day.day}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* 다음 달 캘린더 */}
        <div className={styles.calendar}>
          <div className={styles.calendarNav}>
            <span className={styles.monthTitle}>{currentMonth.add(1, 'month').format('YYYY년 M월')}</span>
          </div>
          
          <div className={styles.weekdays}>
            {WEEKDAYS.map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>
          
          <div className={styles.days}>
            {chunkedNextMonth.map((week, weekIndex) => (
              <div key={`next-week-${weekIndex}`} className={styles.week}>
                {week.map((day, dayIndex) => {
                  const status = getDateStatus(day);
                  return (
                    <div
                      key={`next-day-${dayIndex}`}
                      className={`${styles.day} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${styles[status]}`}
                      onClick={() => day.isCurrentMonth && handleDateClick(day)}
                    >
                      {day.day}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.calendarNavigation}>
        <button className={`${styles.navButton} ${styles.prev}`} onClick={prevMonth}>&lt;</button>
        <button className={`${styles.navButton} ${styles.next}`} onClick={nextMonth}>&gt;</button>
      </div>
      
      <div className={styles.actionButtons}>
        <button className={styles.resetButton} onClick={resetSelection}>취소</button>
        <button className={styles.confirmButton} onClick={confirmSelection}>적용하기</button>
      </div>
    </div>
  );
};

export default Searchdate;