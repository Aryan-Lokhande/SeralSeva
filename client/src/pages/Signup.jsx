import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import img from "../assets/register-sms.png";
import { ArrowLeft, UserPlus } from "lucide-react";

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
              alt="Signup Illustration"
              className="w-full max-w-sm object-contain"
            />

            <div className="mt-10 text-center">
              <h2 className="text-3xl font-bold text-[var(--txt)] mb-3">
                Join YojnaSaathi
              </h2>
              <p className="text-[var(--txt-dim)] text-sm leading-relaxed max-w-sm">
                Create your account to apply for schemes, track your
                applications, and manage grievances seamlessly.
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-8 sm:p-10">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="
                flex items-center gap-2
                text-[var(--txt-dim)]
                hover:text-[var(--txt)]
                transition-colors duration-200
                mb-6
              "
            >
              <ArrowLeft size={18} />
              <span className="font-medium text-sm">Back</span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[var(--btn)]/15 flex items-center justify-center">
                  <UserPlus size={24} className="text-[var(--btn)]" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[var(--txt)]">
                    Create Account
                  </h2>
                  <p className="text-[var(--txt-dim)] text-sm mt-1">
                    Sign up to get started with YojnaSaathi
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-[var(--txt)] font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
                  placeholder="Enter your full name"
                  required
                />
              </div>

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

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-[var(--txt)] font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
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
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
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
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[var(--txt)] font-medium mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-[var(--bg-ter)] focus:ring-[var(--btn)]"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-[var(--txt-dim)] text-sm"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
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
                Create Account
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-[var(--bg-ter)]"></div>
              <span className="px-4 text-[var(--txt-dim)] text-sm">OR</span>
              <div className="flex-1 border-t border-[var(--bg-ter)]"></div>
            </div>

            {/* Login Link */}
            <p className="text-center text-[var(--txt-dim)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium transition-colors duration-200"
              >
                Login
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

export default Signup;
