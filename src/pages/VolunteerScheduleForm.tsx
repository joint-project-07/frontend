import React, { useState } from "react";
import styles from "../style/VolunteerScheduleForm.module.scss";

const VolunteerScheduleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    startTimeHour: "",
    startTimeMinute: "",
    endTimeHour: "",
    endTimeMinute: "",
    activities: "",
    materials: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 데이터 전송이나 처리 로직은 추후 추가 예정
    console.log(formData); // 디버깅용 로그
  };

  return (
    <div className={styles.volunteerScheduleForm}>
      <h1>봉사 일정 등록</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="location">보호소 위치:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="date">봉사 날짜:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="startTimeHour">봉사 시작 시간:</label>
          <input
            type="number"
            id="startTimeHour"
            name="startTimeHour"
            value={formData.startTimeHour}
            onChange={handleChange}
            placeholder="시간"
            required
          />
          <input
            type="number"
            id="startTimeMinute"
            name="startTimeMinute"
            value={formData.startTimeMinute}
            onChange={handleChange}
            placeholder="분"
            required
          />
        </div>

        <div>
          <label htmlFor="endTimeHour">봉사 종료 시간:</label>
          <input
            type="number"
            id="endTimeHour"
            name="endTimeHour"
            value={formData.endTimeHour}
            onChange={handleChange}
            placeholder="시간"
            required
          />
          <input
            type="number"
            id="endTimeMinute"
            name="endTimeMinute"
            value={formData.endTimeMinute}
            onChange={handleChange}
            placeholder="분"
            required
          />
        </div>

        <div>
          <label htmlFor="activities">봉사 활동 내용:</label>
          <textarea
            id="activities"
            name="activities"
            value={formData.activities}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="materials">준비물:</label>
          <textarea
            id="materials"
            name="materials"
            value={formData.materials}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">등록하기</button>
      </form>
    </div>
  );
};

export default VolunteerScheduleForm;