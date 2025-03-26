// VolunteerScheduleRegistration.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/auth/useauthStore';
import Searchdate from '../components/feature/Searchdate';
import SearchRange from '../components/feature/SearchRange';
import styles from '../style/VolunteerScheduleRegistration.module.scss';
import dayjs from 'dayjs';
import { createRecruitment, uploadRecruitmentImages, CreateRecruitmentParams } from '../api/recruitmentApi';

// 봉사활동 선택 옵션
const activityOptions = [
  '시설 청소',
  '동물 산책',
  '동물 목욕',
  '사료 급여',
  '놀이 활동'
];

// 준비물 선택 옵션
const suppliesOptions = [
  '마스크',
  '장갑',
  '편한 복장',
  '마실 물',
  '수건'
];

// 시간대 인터페이스
interface TimeSlot {
  startTime: string;
  endTime: string;
  id: number;
}

// 이미지 파일 인터페이스
interface ImageFile {
  id: number;
  file: File;
  preview: string;
}

const VolunteerScheduleRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 로그인 확인
  if (!user) {
    useEffect(() => {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }, []);
    return <div>로그인이 필요합니다.</div>;
  }

  // 상태 관리
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ startTime: '09:00', endTime: '12:00', id: 1 }]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);
  const [showTimeRangePicker, setShowTimeRangePicker] = useState<number | null>(null);
  
  const [images, setImages] = useState<ImageFile[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // 시간대 추가
  const addTimeSlot = () => {
    if (timeSlots.length < 5) { 
      const newSlot = { startTime: '09:00', endTime: '12:00', id: Date.now() };
      setTimeSlots([...timeSlots, newSlot]);
      setShowTimeRangePicker(newSlot.id);
    }
  };

  // 시간대 삭제
  const removeTimeSlot = (id: number) => {
    if (timeSlots.length > 1) { 
      setTimeSlots(timeSlots.filter(slot => slot.id !== id));
      if (showTimeRangePicker === id) {
        setShowTimeRangePicker(null);
      }
    }
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (range: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }) => {
    setSelectedDate(range);
    setShowDatePicker(false);
  };

  // 시간 범위 선택 핸들러
  const handleTimeRangeSelect = (id: number, range: { startTime: string; endTime: string }) => {
    setTimeSlots(
      timeSlots.map(slot => 
        slot.id === id ? { ...slot, startTime: range.startTime, endTime: range.endTime } : slot
      )
    );
    setShowTimeRangePicker(null);
  };

  // 활동 선택 토글
  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(item => item !== activity)
        : [...prev, activity]
    );
  };

  // 준비물 선택 토글
  const toggleSupply = (supply: string) => {
    setSelectedSupplies(prev => 
      prev.includes(supply)
        ? prev.filter(item => item !== supply)
        : [...prev, supply]
    );
  };

  // 시간 중복 체크
  const checkTimeOverlap = () => {
    for (let i = 0; i < timeSlots.length; i++) {
      const slot1 = timeSlots[i];
      
      for (let j = i + 1; j < timeSlots.length; j++) {
        const slot2 = timeSlots[j];
        
        if (
          (slot1.startTime <= slot2.startTime && slot2.startTime < slot1.endTime) ||
          (slot2.startTime <= slot1.startTime && slot1.startTime < slot2.endTime)
        ) {
          return true; // 중복 있음
        }
      }
    }
    return false; // 중복 없음
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImageError(null);
    
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > 10) {
      setImageError('이미지는 최대 10장까지 업로드할 수 있습니다.');
      return;
    }
    
    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      if (!file.type.match('image.*')) {
        setImageError('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      newImages.push({
        id: Date.now() + Math.random(),
        file: file,
        preview: URL.createObjectURL(file)
      });
    });
    
    setImages(prev => [...prev, ...newImages]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 이미지 삭제 핸들러
  const removeImage = (id: number) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    setImages(images.filter(image => image.id !== id));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // 유효성 검사
    if (!selectedDate) {
      setSubmitError('봉사 날짜를 선택해주세요.');
      return;
    }

    const hasOverlap = checkTimeOverlap();
    if (hasOverlap) {
      setSubmitError('시간대가 중복됩니다. 다시 확인해주세요.');
      return;
    }

    if (selectedActivities.length === 0) {
      setSubmitError('봉사활동 내용을 최소 하나 이상 선택해주세요.');
      return;
    }
    
    if (images.length < 3) {
      setImageError('이미지를 최소 3장 이상 업로드해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      // API 문서에 맞게 데이터 구성
      const recruitmentData: CreateRecruitmentParams = {
        shelter: user.id,
        date: selectedDate.startDate.format('YYYY-MM-DD'),
        start_time: timeSlots[0].startTime,
        end_time: timeSlots[0].endTime,
        type: selectedActivities.join(', '),
        supplies: selectedSupplies.join(', '),
        status: 'open',
        
        // 선택적 필드 - null 체크 추가
        end_date: selectedDate.endDate.format('YYYY-MM-DD'),
        timeSlots: timeSlots.map(slot => ({
          start_time: slot.startTime,
          end_time: slot.endTime
        })),
        activities: selectedActivities,
        maxParticipants: 5,
        description: ''
      };

      // 봉사활동 생성 API 호출
      const response = await createRecruitment(recruitmentData);
      
      // 생성된 봉사활동 ID 확인
      if (!response || !response.id) {
        throw new Error('봉사활동 ID를 찾을 수 없습니다.');
      }
      
      // 이미지 업로드 API 호출
      await uploadRecruitmentImages(response.id, images.map(img => img.file));
      
      // 성공 처리
      setSubmitSuccess(true);
      
      // 성공 메시지 표시 후 리디렉션
      setTimeout(() => {
        navigate('/shelter/dashboard'); // 메인 페이지 경로로 수정
      }, 1500);
      
    } catch (error) {
      console.error('봉사 일정 등록 오류:', error);
      
      let errorMessage = '봉사 일정 등록 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 메모리 정리
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, []);

  return (
    <div className={styles.scheduleRegistration}>
      <h1>봉사 일정 등록</h1>
      
      {/* 알림 메시지 */}
      {submitError && (
        <div className={styles.errorNotification}>
          <p>{submitError}</p>
        </div>
      )}
      
      {submitSuccess && (
        <div className={styles.successNotification}>
          <p>봉사 일정이 성공적으로 등록되었습니다. 곧 메인 페이지로 이동합니다.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* 날짜 선택 섹션 */}
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
        
        {/* 시간 선택 섹션 */}
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
        
        {/* 이미지 업로드 섹션 */}
        <section className={styles.section}>
          <h2>보호소 이미지</h2>
          <div className={styles.imageUploadSection}>
            <div className={styles.imageUploadInfo}>
              <p>보호소 환경 및 활동 이미지를 업로드해주세요. (최소 3장, 최대 10장)</p>
              <p>현재 {images.length}개의 이미지가 업로드되었습니다.</p>
              {imageError && <p className={styles.errorMessage}>{imageError}</p>}
            </div>
            
            <div className={styles.imageUploadControls}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                className={styles.fileInput}
                id="image-upload"
              />
              <label htmlFor="image-upload" className={styles.uploadButton} tabIndex={0}>
                이미지 선택
              </label>
            </div>
            
            <div className={styles.imagePreviewContainer}>
              {images.map(image => (
                <div key={image.id} className={styles.imagePreviewItem}>
                  <img src={image.preview} alt="미리보기" className={styles.imagePreview} />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className={styles.removeImageButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 봉사활동 내용 섹션 */}
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
        
        {/* 준비물 섹션 */}
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
        
        {/* 제출 버튼 */}
        <div className={styles.submitContainer}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? '등록 중...' : '봉사 일정 등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerScheduleRegistration;