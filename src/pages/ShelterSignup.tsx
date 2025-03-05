import { useState } from "react";
import "../style/Button.css";
import "../style/Input.css";

interface FormData {
  name: string;
  shelter_type: string;
  business_registration_number: string;
  business_registration_email: string;
  address: string;
  owner_name: string;
  contact_number: string;
}

const ShelterSignupForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    shelter_type: "",
    business_registration_number: "",
    business_registration_email: "",
    address: "",
    owner_name: "",
    contact_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("보호소 회원가입 완료!");
    console.log("회원가입 정보:", form);
  };

  return (
    <div>
      <h2>보호소 회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>보호소 이름</label>
        <input
          type="text"
          name="name"
          placeholder="보호소 이름"
          value={form.name}
          onChange={handleChange}
          className="input"
          required
        />
        <label>보호소 유형</label>
        <input
          type="text"
          name="shelter_type"
          placeholder="보호소 유형"
          value={form.shelter_type}
          onChange={handleChange}
          className="input"
          required
        />
        <label>사업자 등록번호</label>
        <input
          type="text"
          name="business_registration_number"
          placeholder="사업자 등록번호"
          value={form.business_registration_number}
          onChange={handleChange}
          className="input"
          required
        />
        <label>사업자등록 메일</label>
        <input
          type="email"
          name="business_registration_email"
          placeholder="사업자등록 메일"
          value={form.business_registration_email}
          onChange={handleChange}
          className="input"
          required
        />
        <label>보호소 주소</label>
        <input
          type="text"
          name="address"
          placeholder="보호소 주소"
          value={form.address}
          onChange={handleChange}
          className="input"
          required
        />
        <label>대표자 명</label>
        <input
          type="text"
          name="owner_name"
          placeholder="대표자 명"
          value={form.owner_name}
          onChange={handleChange}
          className="input"
          required
        />
        <label>보호소 연락처</label>
        <input
          type="tel"
          name="contact_number"
          placeholder="보호소 연락처"
          value={form.contact_number}
          onChange={handleChange}
          className="input"
          required
        />
        <button type="submit" className="button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default ShelterSignupForm;
