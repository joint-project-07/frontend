import React, { useState, useRef, useEffect } from 'react';
import '../../style/SearchRange.css';

interface TimeRangePickerProps {
  onSelectRange?: (range: { startTime: string; endTime: string }) => void;
  onClose?: () => void;
}

// 시간 생성 함수 (24시간 형식)
const generateTimeOptions = (startHour: number, endHour: number) => {
  const times: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    times.push(`${formattedHour}:00`);
    times.push(`${formattedHour}:30`);
  }
  return times;
};

const SearchRange: React.FC<TimeRangePickerProps> = ({ onSelectRange, onClose }) => {
  // 시작 시간은 09:00부터 17:00까지
  const startTimeOptions = generateTimeOptions(9, 17);
  
  // 종료 시간은 10:00부터 18:00까지
  const endTimeOptions = generateTimeOptions(10, 18);
  
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectingEndTime, setSelectingEndTime] = useState<boolean>(false);
  
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  // 시작 시간이 선택되면 종료 시간 선택으로 전환
  useEffect(() => {
    if (startTime && !selectingEndTime) {
      setSelectingEndTime(true);
    }
  }, [startTime]);

  // 시간 선택 처리
  const handleTimeSelect = (time: string, isStartTime: boolean) => {
    if (isStartTime) {
      setStartTime(time);
      
      // 선택한 시작 시간보다 이전 종료 시간이 선택되어 있다면 초기화
      if (endTime && parseInt(time.replace(':', '')) >= parseInt(endTime.replace(':', ''))) {
        setEndTime('');
      }
    } else {
      // 종료 시간은 시작 시간보다 커야 함
      if (startTime && parseInt(time.replace(':', '')) > parseInt(startTime.replace(':', ''))) {
        setEndTime(time);
      }
    }
  };

  // 선택 확인
  const handleConfirm = () => {
    if (startTime && endTime && onSelectRange) {
      onSelectRange({ startTime, endTime });
    }
    
    if (onClose) {
      onClose();
    }
  };

  // 선택 취소
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="time-range-picker">
      <div className="time-selection-container">
        <div className="time-column">
          <div className="time-column-label">시작 시간</div>
          <div className="time-options-wrapper">
            <div className="time-options" ref={startTimeRef}>
              {startTimeOptions.map((time) => (
                <div
                  key={`start-${time}`}
                  className={`time-option ${startTime === time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(time, true)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="time-column">
          <div className="time-column-label">종료 시간</div>
          <div className="time-options-wrapper">
            <div className="time-options" ref={endTimeRef}>
              {endTimeOptions.map((time) => {
                // 시작 시간보다 이전이거나 같은 시간은 비활성화
                const isDisabled = startTime && parseInt(time.replace(':', '')) <= parseInt(startTime.replace(':', ''));
                
                return (
                  <div
                    key={`end-${time}`}
                    className={`time-option ${endTime === time ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => !isDisabled && handleTimeSelect(time, false)}
                  >
                    {time}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="selected-time-display">
        <div className="selected-time-item">
          <span className="time-label">시작:</span>
          <span className="time-value">{startTime || '선택 안됨'}</span>
        </div>
        <div className="selected-time-item">
          <span className="time-label">종료:</span>
          <span className="time-value">{endTime || '선택 안됨'}</span>
        </div>
      </div>
      
      <div className="time-action-buttons">
        <button className="reset-button" onClick={handleCancel}>취소</button>
        <button 
          className="confirm-button" 
          onClick={handleConfirm}
          disabled={!startTime || !endTime}
        >
          적용하기
        </button>
      </div>
    </div>
  );
};

export default SearchRange;