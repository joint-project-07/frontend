import { useState } from "react";

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">보호소 회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>보호소 이름</label>
        <input
          type="text"
          name="name"
          placeholder="보호소 이름"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <label>보호소 유형</label>
        <input
          type="text"
          name="shelter_type"
          placeholder="보호소 유형"
          value={form.shelter_type}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <label>사업자 등록번호</label>
        <input
          type="text"
          name="business_registration_number"
          placeholder="사업자 등록번호"
          value={form.business_registration_number}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <label>사업자등록 메일</label>
        <input
          type="email"
          name="business_registration_email"
          placeholder="사업자등록 메일"
          value={form.business_registration_email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <label>보호소 주소</label>
        <input
          type="text"
          name="address"
          placeholder="보호소 주소"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <label>대표자 명</label>
        <input
          type="text"
          name="owner_name"
          placeholder="대표자 명"
          value={form.owner_name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <label>보호소 연락처</label>
        <input
          type="tel"
          name="contact_number"
          placeholder="보호소 연락처"
          value={form.contact_number}
          onChange={handleChange}
          className="w-full p-2 mb-5 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default ShelterSignupForm;
