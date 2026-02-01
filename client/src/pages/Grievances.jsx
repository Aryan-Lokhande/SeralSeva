import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Grievances = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      icon: "📝",
      title: "Register Complaint",
      description:
        "Fill out the grievance form with all necessary details about your issue",
    },
    {
      step: 2,
      icon: "📋",
      title: "Get Tracking ID",
      description:
        "Receive a unique tracking ID to monitor the status of your grievance",
    },
    {
      step: 3,
      icon: "✅",
      title: "Track & Resolve",
      description:
        "Monitor progress and receive updates until your grievance is resolved",
    },
  ];

  const actionCards = [
    {
      icon: "📢",
      title: "Lodge a Grievance",
      description:
        "Submit a new complaint or grievance regarding any government scheme or service",
      buttonText: "File Complaint",
      buttonAction: () => navigate("/lodge-grievance"),
      gradient: "from-purple-600 to-purple-800",
    },
    {
      icon: "🔍",
      title: "Check Status",
      description:
        "Track the status of your existing grievance using your tracking ID",
      buttonText: "Track Status",
      buttonAction: () => navigate("/track-grievance"),
      gradient: "from-blue-600 to-blue-800",
    },
    {
      icon: "📞",
      title: "Contact Us",
      description: "Need help? Reach out to our support team for assistance",
      buttonText: "Get Help",
      buttonAction: () => navigate("/contact"),
      gradient: "from-green-600 to-green-800",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-btn to-btn-hover py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            Public Grievances
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-100 mt-4"
          >
            Your voice matters. Register and track your grievances easily
          </motion.p>
        </div>
      </section>

      {/* How to Apply - Steps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-txt mb-4">
            How to Apply
          </h2>
          <p className="text-txt-dim text-xl">Simplified in 3 Easy Steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-bg-sec p-8 rounded-custom shadow-custom relative"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-btn rounded-full flex items-center justify-center shadow-custom-lg">
                <span className="text-3xl font-bold text-white">
                  {step.step}
                </span>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6 mt-4">
                <div className="w-24 h-24 bg-btn/10 rounded-full flex items-center justify-center">
                  <span className="text-6xl">{step.icon}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-txt text-center mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-txt-dim text-center leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="bg-bg-sec py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-txt mb-4">
              What Would You Like To Do?
            </h2>
            <p className="text-txt-dim text-lg">
              Choose an option below to get started
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {actionCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`bg-gradient-to-br ${card.gradient} p-8 rounded-custom shadow-custom-lg`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-6xl">{card.icon}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white text-center mb-4">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-gray-100 text-center mb-6 leading-relaxed">
                  {card.description}
                </p>

                {/* Button */}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={card.buttonAction}
                    className="bg-white text-gray-900 px-8 py-3 rounded-custom font-bold hover:shadow-custom-lg transition-all duration-200"
                  >
                    {card.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-btn/10 border border-btn rounded-custom p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-txt mb-4">Need Assistance?</h3>
          <p className="text-txt-dim mb-6">
            Our dedicated support team is here to help you with any questions or
            concerns
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-txt">
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-btn"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>grievance@saralseva.gov.in</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-btn"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>1800-XXX-XXXX (Toll Free)</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Grievances;
