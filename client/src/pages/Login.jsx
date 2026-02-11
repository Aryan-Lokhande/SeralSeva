import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import img from "../assets/register-sms.png";

import { LogIn } from "lucide-react";

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
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[var(--radius)] border border-[var(--bg-ter)] bg-[var(--bg-sec)]"
          style={{
            boxShadow: "0 14px 45px rgba(var(--shadow-rgb), 0.18)",
          }}
        >
          {/* Left Image Section */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-[var(--bg-ter)] p-10">
            <img
              src={img}
              alt="Login Illustration"
              className="w-full max-w-sm object-contain"
            />

            <div className="mt-10 text-center">
              <h2 className="text-3xl font-bold text-[var(--txt)] mb-3">
                Welcome Back
              </h2>
              <p className="text-[var(--txt-dim)] text-sm leading-relaxed max-w-sm">
                Login to continue your journey with SaralSeva and track your
                applications and grievances easily.
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[var(--btn)]/15 flex items-center justify-center">
                  <LogIn size={24} className="text-[var(--btn)]" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[var(--txt)]">
                    Login
                  </h2>
                  <p className="text-[var(--txt-dim)] text-sm mt-1">
                    Login to access your account
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[var(--txt)] font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    bg-[var(--bg-ter)]
                    text-[var(--txt)]
                    rounded-[var(--radius)]
                    border border-[var(--bg-ter)]
                    focus:border-[var(--btn)]
                    focus:outline-none
                    transition-colors duration-200
                  "
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[var(--txt)] font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3
                    bg-[var(--bg-ter)]
                    text-[var(--txt)]
                    rounded-[var(--radius)]
                    border border-[var(--bg-ter)]
                    focus:border-[var(--btn)]
                    focus:outline-none
                    transition-colors duration-200
                  "
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-[var(--btn)] hover:text-[var(--btn-hover)] text-sm font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  w-full py-3
                  bg-[var(--btn)]
                  hover:bg-[var(--btn-hover)]
                  text-white font-semibold
                  rounded-[var(--radius)]
                  transition-colors duration-200
                "
              >
                Login
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-[var(--bg-ter)]"></div>
              <span className="px-4 text-[var(--txt-dim)] text-sm">OR</span>
              <div className="flex-1 border-t border-[var(--bg-ter)]"></div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-[var(--txt-dim)]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </p>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link
                to="/"
                className="text-[var(--txt-dim)] hover:text-[var(--txt)] transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
