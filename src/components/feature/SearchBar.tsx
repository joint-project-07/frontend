import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; 
import '../../style/SearchBar.css'; 
import DateRangePicker from './Searchdate';
import TimeRangePicker from './SearchRange';

dayjs.locale('ko');

type TabType = 'location' | 'date' | 'time' | null;

interface SearchBarProps {
  onSearch?: (data: { 
    locations: string[]; 
    dateRange: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } | null; 
    timeRange: { startTime: string; endTime: string } | null;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  } | null>(null);
  const [timeRange, setTimeRange] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const locations: string[] = [
    '서울', '인천', '경기', '대전', 
    '세종', '충북', '충남', '강원',
    '대구', '전북', '전남', '광주',
    '경북', '경남', '부산', '울산'
  ];

  const handleLocationSelect = (loc: string): void => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter(item => item !== loc));
    } else {
      if (selectedLocations.length < 3) {
        setSelectedLocations([...selectedLocations, loc]);
      }
    }
  };

  const handleDateRangeSelect = (range: {
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  }): void => {
    setDateRange(range);
    setActiveTab(null);
  };

  const handleTimeRangeSelect = (range: {
    startTime: string;
    endTime: string;
  }): void => {
    setTimeRange(range);
    setActiveTab(null);
  };

  const formatDateRange = (): string => {
    if (!dateRange) return '날짜 추가';
    
    const { startDate, endDate } = dateRange;
    if (startDate.isSame(endDate, 'day')) {
      return startDate.format('YYYY년 MM월 DD일');
    }
    return `${startDate.format('MM월 DD일')} - ${endDate.format('MM월 DD일')}`;
  };

  const formatTimeRange = (): string => {
    if (!timeRange) return '시간 선택';
    
    const { startTime, endTime } = timeRange;
    return `${startTime} - ${endTime}`;
  };

  const handleSearch = (): void => {
    console.log('검색:', { 
      locations: selectedLocations, 
      dateRange, 
      timeRange 
    });
    
    if (onSearch) {
      onSearch({ 
        locations: selectedLocations, 
        dateRange, 
        timeRange 
      });
    }
  };

  const getLocationDisplayText = (): string => {
    if (selectedLocations.length === 0) return '장소 지역 선택';
    return selectedLocations.join(', ');
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div 
          className={`search-section ${activeTab === 'location' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'location' ? null : 'location')}
        >
          <div className="section-label">지역</div>
          <div className="section-value">{getLocationDisplayText()}</div>
        </div>
        
        <div 
          className={`search-section ${activeTab === 'date' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'date' ? null : 'date')}
        >
          <div className="section-label">날짜</div>
          <div className="section-value">{formatDateRange()}</div>
        </div>
        
        <div 
          className={`search-section ${activeTab === 'time' ? 'active' : ''}`}
          onClick={() => setActiveTab(activeTab === 'time' ? null : 'time')}
        >
          <div className="section-label">시간</div>
          <div className="section-value">{formatTimeRange()}</div>
        </div>
        
        <button 
          className="search-button"
          onClick={handleSearch}
          type="button"
          aria-label="검색"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      {activeTab && (
        <div className="dropdown-container">
          {activeTab === 'location' && (
            <div>
              <h3 className="dropdown-title">지역 선택</h3>
              <p className="selection-info">최대 3개까지 선택이 가능합니다.</p>
              
              <div className="location-grid">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    className={`location-pill ${selectedLocations.includes(loc) ? 'selected' : ''}`}
                    onClick={() => handleLocationSelect(loc)}
                    type="button"
                  >
                    {loc}
                  </button>
                ))}
              </div>
              
              <div className="button-container">
                <button
                  className="confirm-button"
                  onClick={() => setActiveTab(null)}
                  type="button"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {activeTab === 'date' && (
            <DateRangePicker 
              onSelectRange={handleDateRangeSelect}
              onClose={() => setActiveTab(null)}
            />
          )}

          {activeTab === 'time' && (
            <TimeRangePicker
              onSelectRange={handleTimeRangeSelect}
              onClose={() => setActiveTab(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;