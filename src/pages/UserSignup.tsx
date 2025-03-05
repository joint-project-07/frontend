import { useState } from "react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
}

const UserSignupForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault;

    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("회원가입 완료!")
    console.log("회원정보:", form)
  };

  return <div>SignupPage</div>;
};

export default UserSignupForm;
