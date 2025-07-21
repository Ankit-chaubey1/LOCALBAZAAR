import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // 🔥 Import CSS

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/signup", form);
    if (res.status === 201) {
      navigate("/login");
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input
        name="name"
        onChange={handleChange}
        value={form.name}
        placeholder="Name"
        required
      />
      <input
        name="email"
        onChange={handleChange}
        value={form.email}
        placeholder="Email"
        required
      />
      <input
        name="phoneNo"
        onChange={handleChange}
        value={form.phoneNo}
        placeholder="Phone Number"
        required
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        value={form.password}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Signup;
