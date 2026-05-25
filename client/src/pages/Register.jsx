import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await registerUser(formData);

      alert(data.message);

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">

      <div className="bg-gray-800 p-8 rounded-xl w-[400px]">

        <h2 className="text-3xl text-white font-bold mb-6">
          Register
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-700 text-white"
          />

          <button
            className="bg-green-500 p-3 rounded-lg text-white font-semibold"
          >
            Register
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;