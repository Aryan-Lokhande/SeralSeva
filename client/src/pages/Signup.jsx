import React, { useState } from "react";
import sms from "../assets/register-sms.png";
// import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/* Indian States (Static) */
const STATES = [
  { code: "MH", name: "Maharashtra" },
  { code: "DL", name: "Delhi" },
  { code: "KA", name: "Karnataka" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "RJ", name: "Rajasthan" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "GJ", name: "Gujarat" },
  { code: "WB", name: "West Bengal" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "PB", name: "Punjab" },
];

const Signup = () => {
  // const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    gender: "",
    state: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/registerUser`,
        formData
      );
      alert("Account created successfully");
      // navigate("/userlogin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 p-8 bg-white rounded-xl shadow-lg">

        {/* Left Section */}
        <div className="text-center">
          <img src={sms} alt="Signup" className="mx-auto w-64" />
          <h2 className="text-3xl font-bold mt-6 text-orange-800">
            Create SeralSeva Account
          </h2>
          <p className="mt-2 text-gray-600">
            Already registered?{" "}
            {/* <Link to="/userlogin" className="text-orange-600 font-semibold"> */}
            <button  className="text-orange-600 font-semibold">
              Login
            </button>
          </p>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600">{error}</p>}

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className={inputClasses}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputClasses}
            required
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className={inputClasses}
            required
          />

          {/* State Selection */}
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select State</option>
            {STATES.map((state) => (
              <option key={state.code} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
