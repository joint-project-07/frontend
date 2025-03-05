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
  })
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("보호소 회원가입 완료!")
    console.log("회원가입 정보:", form)
}


  return (

  )
}

export default ShelterSignupForm;
