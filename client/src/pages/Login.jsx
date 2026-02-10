import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-bg-sec rounded-custom shadow-custom-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-txt mb-2">Welcome Back</h2>
            <p className="text-txt-dim">Login to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-txt font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-txt font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-btn hover:text-btn-hover text-sm transition-colors duration-200"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-btn hover:bg-btn-hover text-white py-3 rounded-custom font-semibold transition-colors duration-200"
            >
              Login
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-bg-ter"></div>
            <span className="px-4 text-txt-dim text-sm">OR</span>
            <div className="flex-1 border-t border-bg-ter"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-txt-dim">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-btn hover:text-btn-hover font-medium transition-colors duration-200"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-txt-dim hover:text-txt transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
