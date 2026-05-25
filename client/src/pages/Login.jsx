import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

      const data = await loginUser(formData);

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      alert(data.message);

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">

      <div className="bg-gray-800 p-8 rounded-xl w-[400px]">

        <h2 className="text-3xl text-white font-bold mb-6">
          Login
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

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
            className="bg-blue-500 p-3 rounded-lg text-white font-semibold"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;