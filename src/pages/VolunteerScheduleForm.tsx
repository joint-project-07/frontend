import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Searchdate from '../components/feature/Searchdate';
import SearchRange from '../components/feature/SearchRange';
import styles from '../style/VolunteerScheduleRegistration.module.scss';
import dayjs from 'dayjs';

const activityOptions = [
  '봉사활동 1: 시설 청소',
  '봉사활동 2: 동물 산책',
  '봉사활동 3: 동물 목욕',
  '봉사활동 4: 사료 급여',
  '봉사활동 5: 놀이 활동'
];

const suppliesOptions = [
  '준비물 1: 마스크',
  '준비물 2: 장갑',
  '준비물 3: 편한 복장',
  '준비물 4: 마실 물',
  '준비물 5: 수건'
];

interface TimeSlot {
  startTime: string;
  endTime: string;
  id: number;
}

const VolunteerScheduleRegistration: React.FC = () => {
  const { userRole } = useAuth();
  const [shelterInfo] = useState({
    name: '샘플 보호소',
    address: '서울시 강남구 테헤란로 123',
    phoneNumber: '02-123-4567'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ startTime: '09:00', endTime: '12:00', id: 1 }]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);
  const [maxParticipants, setMaxParticipants] = useState<number>(5);
  const [description, setDescription] = useState<string>('');
  const [showTimeRangePicker, setShowTimeRangePicker] = useState<number | null>(null); // 수정된 부분

  useEffect(() => {
    // 로그인한 기관 정보를 가져오는 API 호출을 여기에 추가
    // API 연결 전이므로 샘플 데이터 사용
    if (userRole === 'organization') {
      // API 호출 예시
      // const fetchShelterInfo = async () => {
      //   try {
      //     const response = await fetch('/api/shelter/info');
      //     const data = await response.json();
      //     setShelterInfo(data);
      //   } catch (error) {
      //     console.error('보호소 정보를 불러오는 중 오류 발생:', error);
      //   }
      // };
      // fetchShelterInfo();
    }
  }, [userRole]);

  const handleDateSelect = (range: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }) => {
    setSelectedDate(range);
    setShowDatePicker(false);
  };

  const addTimeSlot = () => {
    if (timeSlots.length < 5) { 
      const newSlot = { startTime: '09:00', endTime: '12:00', id: Date.now() };
      setTimeSlots([...timeSlots, newSlot]);
      setShowTimeRangePicker(newSlot.id);
    }
  };

  const removeTimeSlot = (id: number) => {
    if (timeSlots.length > 1) { 
      setTimeSlots(timeSlots.filter(slot => slot.id !== id));
      if (showTimeRangePicker === id) {
        setShowTimeRangePicker(null);
      }
    }
  };

  const handleTimeRangeSelect = (id: number, range: { startTime: string; endTime: string }) => {
    setTimeSlots(
      timeSlots.map(slot => 
        slot.id === id ? { ...slot, startTime: range.startTime, endTime: range.endTime } : slot
      )
    );
    setShowTimeRangePicker(null);
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(item => item !== activity)
        : [...prev, activity]
    );
  };

  const toggleSupply = (supply: string) => {
    setSelectedSupplies(prev => 
      prev.includes(supply)
        ? prev.filter(item => item !== supply)
        : [...prev, supply]
    );
  };

  const checkTimeOverlap = () => {
    for (let i = 0; i < timeSlots.length; i++) {
      const slot1 = timeSlots[i];
      
      for (let j = i + 1; j < timeSlots.length; j++) {
        const slot2 = timeSlots[j];
        
        if (
          (slot1.startTime <= slot2.startTime && slot2.startTime < slot1.endTime) ||
          (slot2.startTime <= slot1.startTime && slot1.startTime < slot2.endTime)
        ) {
          return true; 
        }
      }
    }
    return false; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasOverlap = checkTimeOverlap();
    if (hasOverlap) {
      alert('시간대가 중복됩니다. 다시 확인해주세요.');
      return;
    }

    if (!selectedDate) {
      alert('봉사 날짜를 선택해주세요.');
      return;
    }

    if (selectedActivities.length === 0) {
      alert('봉사활동 내용을 최소 하나 이상 선택해주세요.');
      return;
    }

    const scheduleData = {
      shelterInfo,
      date: {
        startDate: selectedDate.startDate.format('YYYY-MM-DD'),
        endDate: selectedDate.endDate.format('YYYY-MM-DD')
      },
      timeSlots,
      activities: selectedActivities,
      supplies: selectedSupplies,
      maxParticipants,
      description
    };

    console.log('제출된 일정 데이터:', scheduleData);
    alert('봉사 일정이 등록되었습니다.');
    
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(null);
    setTimeSlots([{ startTime: '09:00', endTime: '12:00', id: 1 }]);
    setSelectedActivities([]);
    setSelectedSupplies([]);
    setMaxParticipants(5);
    setDescription('');
  };

  return (
    <div className={styles.scheduleRegistration}>
      <h1>봉사 일정 등록</h1>
      
      <form onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2>보호소 정보</h2>
          <div className={styles.shelterInfo}>
            <p><strong>보호소명:</strong> {shelterInfo.name}</p>
            <p><strong>주소:</strong> {shelterInfo.address}</p>
            <p><strong>연락처:</strong> {shelterInfo.phoneNumber}</p>
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>봉사 날짜</h2>
          <div className={styles.dateSelection}>
            <button 
              type="button" 
              className={styles.dateButton} 
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {selectedDate 
                ? `${selectedDate.startDate.format('YYYY년 MM월 DD일')}${!selectedDate.endDate.isSame(selectedDate.startDate, 'day') 
                  ? ` ~ ${selectedDate.endDate.format('YYYY년 MM월 DD일')}` 
                  : ''}`
                : '날짜 선택하기'}
            </button>
            
            {showDatePicker && (
              <div className={styles.datePickerContainer}>
                <Searchdate onSelectRange={handleDateSelect} onClose={() => setShowDatePicker(false)} />
              </div>
            )}
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>봉사 시간</h2>
          <div className={styles.timeSlots}>
            {timeSlots.map((slot, index) => (
              <div key={slot.id} className={styles.timeSlot}>
                <div className={styles.timeSlotDisplay}>
                  <div className={styles.timeSlotInfo}>
                    <span className={styles.slotNumber}>{index + 1}. </span>
                    <span className={styles.timeRange}>
                      {slot.startTime} ~ {slot.endTime}
                    </span>
                  </div>
                  <div className={styles.timeSlotActions}>
                    <button 
                      type="button" 
                      onClick={() => setShowTimeRangePicker(slot.id)}
                      className={styles.editButton}
                    >
                      수정
                    </button>
                    <button 
                      type="button" 
                      onClick={() => removeTimeSlot(slot.id)}
                      className={styles.removeButton}
                      disabled={timeSlots.length <= 1}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                {showTimeRangePicker === slot.id && (
                  <div className={styles.timeRangePickerContainer}>
                    <SearchRange 
                      onSelectRange={(range) => handleTimeRangeSelect(slot.id, range)}
                      onClose={() => setShowTimeRangePicker(null)}
                    />
                  </div>
                )}
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={addTimeSlot}
              className={styles.addButton}
              disabled={timeSlots.length >= 5}
            >
              시간대 추가 (최대 5개)
            </button>
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>주요 봉사활동 내용</h2>
          <div className={styles.optionsContainer}>
            {activityOptions.map((activity) => (
              <div key={activity} className={styles.optionItem}>
                <label>
                  <input 
                    type="checkbox"
                    checked={selectedActivities.includes(activity)}
                    onChange={() => toggleActivity(activity)}
                  />
                  {activity}
                </label>
              </div>
            ))}
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>준비물</h2>
          <div className={styles.optionsContainer}>
            {suppliesOptions.map((supply) => (
              <div key={supply} className={styles.optionItem}>
                <label>
                  <input 
                    type="checkbox"
                    checked={selectedSupplies.includes(supply)}
                    onChange={() => toggleSupply(supply)}
                  />
                  {supply}
                </label>
              </div>
            ))}
          </div>
        </section>
        
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>
            봉사 일정 등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerScheduleRegistration;