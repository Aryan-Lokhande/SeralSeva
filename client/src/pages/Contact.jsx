import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      title: "Email",
      details: ["support@saralseva.gov.in", "grievance@saralseva.gov.in"],
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      title: "Phone",
      details: ["1800-XXX-XXXX (Toll Free)", "+91-XXX-XXX-XXXX"],
      color: "from-green-600 to-green-800",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Office Address",
      details: ["SaralSeva Bhavan, Shivane", "Pune - 411023", "India"],
      color: "from-purple-600 to-purple-800",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Working Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 1:00 PM",
      ],
      color: "from-orange-600 to-orange-800",
    },
  ];

  const departments = [
    {
      name: "Technical Support",
      email: "tech@saralseva.gov.in",
      phone: "1800-111-XXXX",
    },
    {
      name: "Grievance Redressal",
      email: "grievance@saralseva.gov.in",
      phone: "1800-222-XXXX",
    },
    {
      name: "Scheme Information",
      email: "schemes@saralseva.gov.in",
      phone: "1800-333-XXXX",
    },
    {
      name: "Media & Press",
      email: "media@saralseva.gov.in",
      phone: "1800-444-XXXX",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-txt mb-4">
            Get In Touch
          </h1>
          <p className="text-txt-dim text-lg">
            We're here to help. Reach out to us through any of the following
            channels.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${info.color} p-6 rounded-custom shadow-custom-lg text-white`}
            >
              <div className="mb-4">{info.icon}</div>
              <h3 className="text-xl font-bold mb-3">{info.title}</h3>
              <div className="space-y-1 text-sm">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-100">
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-bg-sec rounded-custom shadow-custom-lg p-8"
          >
            <h2 className="text-2xl font-bold text-txt mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-txt font-medium mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-txt font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-txt font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                />
              </div>

              <div>
                <label className="block text-txt font-medium mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div>
                <label className="block text-txt font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-btn hover:bg-btn-hover text-white py-3 rounded-custom font-semibold transition-colors duration-200"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Department Contacts & Map */}
          <div className="space-y-6">
            {/* Department Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-bg-sec rounded-custom shadow-custom-lg p-8"
            >
              <h2 className="text-2xl font-bold text-txt mb-6">
                Department Contacts
              </h2>

              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="bg-bg-ter p-4 rounded-custom hover:bg-bg-ter/80 transition-colors duration-200"
                  >
                    <h3 className="text-txt font-semibold mb-2">{dept.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-txt-dim">
                        <span className="text-btn">✉</span> {dept.email}
                      </p>
                      <p className="text-txt-dim">
                        <span className="text-btn">📞</span> {dept.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-bg-sec rounded-custom shadow-custom-lg p-8"
            >
              <h2 className="text-2xl font-bold text-txt mb-6">
                Visit Our Office
              </h2>

              {/* Map placeholder - replace with actual map */}
              <div className="bg-gradient-to-br from-btn to-btn-hover rounded-custom h-64 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-lg font-semibold">Interactive Map</p>
                  <p className="text-sm text-gray-200 mt-2">
                    SaralSeva Bhavan, New Delhi
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-btn/10 border border-btn rounded-custom p-4">
                <p className="text-txt text-sm">
                  <strong>Directions:</strong> Our office is located in the
                  heart of New Delhi, easily accessible via metro (nearest
                  station: Central Secretariat) or public transport.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 bg-bg-sec rounded-custom shadow-custom-lg p-8"
        >
          <h2 className="text-2xl font-bold text-txt mb-6">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-txt font-semibold mb-2">
                What are your response times?
              </h3>
              <p className="text-txt-dim text-sm">
                We typically respond to emails within 24-48 hours during
                business days. Phone queries are answered immediately during
                working hours.
              </p>
            </div>
            <div>
              <h3 className="text-txt font-semibold mb-2">
                Can I visit the office without appointment?
              </h3>
              <p className="text-txt-dim text-sm">
                Yes, you can visit during working hours. However, we recommend
                scheduling an appointment for faster service.
              </p>
            </div>
            <div>
              <h3 className="text-txt font-semibold mb-2">
                How do I track my query?
              </h3>
              <p className="text-txt-dim text-sm">
                You'll receive a reference number via email when you submit a
                query. Use this to track your query status online.
              </p>
            </div>
            <div>
              <h3 className="text-txt font-semibold mb-2">
                Do you provide regional language support?
              </h3>
              <p className="text-txt-dim text-sm">
                Yes, we have multilingual support available. Please mention your
                preferred language when contacting us.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
