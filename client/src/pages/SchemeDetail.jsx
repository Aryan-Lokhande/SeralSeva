import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { schemesData } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const scheme = schemesData.find((s) => s.id === parseInt(id));

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-txt mb-4">Scheme Not Found</h1>
          <button
            onClick={() => navigate("/schemes")}
            className="text-btn hover:text-btn-hover"
          >
            ← Back to Schemes
          </button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this scheme");
      navigate("/login");
      return;
    }
    navigate("/apply-scheme", { state: { scheme } });
  };

  const handleDownloadBrochure = () => {
    toast.success(`Downloading brochure for ${scheme.title}`);
  };

  const features = [
    {
      icon: "💰",
      title: "Financial Assistance",
      description: scheme.benefits,
    },
    {
      icon: "📋",
      title: "Easy Application",
      description:
        "Simple online application process with minimal documentation",
    },
    {
      icon: "⚡",
      title: "Quick Processing",
      description: "Applications processed within 30 days of submission",
    },
    {
      icon: "🔒",
      title: "Secure & Transparent",
      description: "End-to-end secure process with complete transparency",
    },
  ];

  const faqs = [
    {
      question: "Who is eligible for this scheme?",
      answer: scheme.eligibility,
    },
    {
      question: "What documents are required?",
      answer:
        "Aadhar Card, PAN Card, Income Certificate, Bank Account Details, Address Proof, and Passport Size Photographs",
    },
    {
      question: "How long does it take to process?",
      answer:
        "The application is typically processed within 30 working days from the date of submission with complete documents",
    },
    {
      question: "How will I receive the benefits?",
      answer:
        "Benefits are directly transferred to your bank account via DBT (Direct Benefit Transfer) within 7 days of approval",
    },
    {
      question: "Can I apply offline?",
      answer:
        "Yes, you can apply offline at designated government offices. However, online application is recommended for faster processing",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-btn to-btn-hover py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <button
                onClick={() => navigate("/schemes")}
                className="text-white hover:text-gray-200 flex items-center mr-4"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-white/20 text-white">
                {scheme.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {scheme.title}
            </h1>
            <p className="text-xl text-gray-100 mb-6">{scheme.description}</p>
            <p className="text-gray-200 text-sm">Scheme Code: {scheme.code}</p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApply}
                className="bg-white text-btn px-8 py-3 rounded-custom font-bold text-lg hover:shadow-custom-lg transition-all duration-200"
              >
                Apply Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadBrochure}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-custom font-bold text-lg hover:bg-white/10 transition-all duration-200"
              >
                Download Brochure
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-bg-sec p-6 rounded-custom shadow-custom">
            <h3 className="text-lg font-semibold text-txt mb-3">Eligibility</h3>
            <p className="text-txt-dim">{scheme.eligibility}</p>
          </div>
          <div className="bg-bg-sec p-6 rounded-custom shadow-custom">
            <h3 className="text-lg font-semibold text-txt mb-3">Benefits</h3>
            <p className="text-txt-dim">{scheme.benefits}</p>
          </div>
          <div className="bg-bg-sec p-6 rounded-custom shadow-custom">
            <h3 className="text-lg font-semibold text-txt mb-3">Category</h3>
            <p className="text-txt-dim">{scheme.category}</p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-txt mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-bg-sec p-6 rounded-custom shadow-custom hover:shadow-custom-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-txt mb-2">
                  {feature.title}
                </h3>
                <p className="text-txt-dim text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How to Apply Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-bg-sec rounded-custom shadow-custom-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-txt mb-6">How to Apply</h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Create Account",
                description:
                  "Sign up on SaralSeva portal with your basic details and verify your email/phone",
              },
              {
                step: 2,
                title: "Complete Application",
                description:
                  "Fill the online application form with accurate information and upload required documents",
              },
              {
                step: 3,
                title: "Submit & Track",
                description:
                  "Submit your application and receive a tracking ID to monitor the status",
              },
              {
                step: 4,
                title: "Receive Benefits",
                description:
                  "Once approved, benefits will be directly transferred to your bank account",
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-btn rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-txt mb-1">
                    {step.title}
                  </h3>
                  <p className="text-txt-dim">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-bg-ter">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              className="w-full md:w-auto bg-btn hover:bg-btn-hover text-white px-8 py-3 rounded-custom font-semibold transition-colors duration-200"
            >
              Start Application
            </motion.button>
          </div>
        </motion.div>

        {/* FAQs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-bg-sec rounded-custom shadow-custom-lg p-8"
        >
          <h2 className="text-3xl font-bold text-txt mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-bg-ter rounded-custom overflow-hidden"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold text-txt hover:bg-bg-ter/80 transition-colors duration-200">
                  {faq.question}
                </summary>
                <div className="px-6 py-4 text-txt-dim border-t border-bg-primary">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Contact Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 bg-btn/10 border border-btn rounded-custom p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-txt mb-4">
            Need Help with Application?
          </h3>
          <p className="text-txt-dim mb-6">
            Our support team is ready to assist you with any questions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:support@saralseva.gov.in"
              className="text-btn hover:text-btn-hover font-medium"
            >
              📧 support@saralseva.gov.in
            </a>
            <span className="hidden sm:inline text-txt-dim">|</span>
            <a
              href="tel:1800-xxx-xxxx"
              className="text-btn hover:text-btn-hover font-medium"
            >
              📞 1800-XXX-XXXX
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default SchemeDetail;
