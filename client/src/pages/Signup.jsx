import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const { signup } = useAuth();
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
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const result = await signup(userData);

      if (result.success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Signup failed");
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
            <h2 className="text-3xl font-bold text-txt mb-2">Create Account</h2>
            <p className="text-txt-dim">
              Sign up to get started with SaralSeva
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-txt font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

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

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-txt font-medium mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
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
                placeholder="Create a strong password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-txt font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                placeholder="Re-enter your password"
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-bg-ter focus:ring-btn"
                required
              />
              <label htmlFor="terms" className="ml-2 text-txt-dim text-sm">
                I agree to the{" "}
                <a href="#" className="text-btn hover:text-btn-hover">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-btn hover:text-btn-hover">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-btn hover:bg-btn-hover text-white py-3 rounded-custom font-semibold transition-colors duration-200"
            >
              Create Account
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-bg-ter"></div>
            <span className="px-4 text-txt-dim text-sm">OR</span>
            <div className="flex-1 border-t border-bg-ter"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-txt-dim">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-btn hover:text-btn-hover font-medium transition-colors duration-200"
            >
              Login
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

export default Signup;
