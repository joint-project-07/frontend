import { useUsersStore } from "../store/UsersStore";

const UsersSignupForm: React.FC = () => {
  const { form, setForm } = useUsersStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("회원가입 완료!");
    console.log("회원정보:", form);
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>이메일</label>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label>비밀번호 확인</label>
        <input
          type="password"
          name="password_confirm"
          placeholder="비밀번호 확인"
          value={form.password_confirm}
          onChange={handleChange}
          required
        />
        <label>이름</label>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label>전화번호</label>
        <input
          type="tel"
          name="phone_number"
          placeholder="전화번호"
          value={form.phone_number}
          onChange={handleChange}
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default UsersSignupForm;
