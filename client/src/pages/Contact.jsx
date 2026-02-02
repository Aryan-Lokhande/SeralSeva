import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building2,
  HelpCircle,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully. We will contact you shortly.");
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
      icon: Mail,
      title: "Email",
      details: ["support@saralseva.gov.in", "grievance@saralseva.gov.in"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["1800-XXX-XXXX (Toll Free)", "+91-XXX-XXX-XXXX"],
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: ["SaralSeva Bhavan", "Shivane, Pune – 411023", "India"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon–Fri: 9:00 AM – 6:00 PM", "Saturday: 9:00 AM – 1:00 PM"],
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
    <div className="min-h-screen py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--txt)] mb-4">
            Contact Us
          </h1>
          <p className="text-[var(--txt-dim)] text-lg">
            We’re here to assist you. Reach us through any channel below.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {contactInfo.map((info, i) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="
                  bg-[var(--bg-sec)]
                  border border-[var(--bg-ter)]
                  rounded-[var(--radius)]
                  p-6
                  shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.25)]
                "
              >
                <Icon size={28} className="text-[var(--btn)] mb-4" />
                <h3 className="text-lg font-bold text-[var(--txt)] mb-2">
                  {info.title}
                </h3>
                <div className="space-y-1 text-sm text-[var(--txt-dim)]">
                  {info.details.map((d, idx) => (
                    <p key={idx}>{d}</p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="
              bg-[var(--bg-sec)]
              border border-[var(--bg-ter)]
              rounded-[var(--radius)]
              p-8
              shadow-[0_12px_35px_rgba(var(--shadow-rgb),0.25)]
            "
          >
            <h2 className="text-2xl font-bold text-[var(--txt)] mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "Full Name", name: "name", required: true },
                { label: "Email Address", name: "email", type: "email", required: true },
                { label: "Phone Number", name: "phone" },
                { label: "Subject", name: "subject", required: true },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[var(--txt)] font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="
                      w-full px-4 py-3
                      bg-[var(--bg-ter)]
                      text-[var(--txt)]
                      rounded-[var(--radius)]
                      border border-[var(--bg-ter)]
                      focus:border-[var(--btn)]
                      focus:outline-none
                    "
                  />
                </div>
              ))}

              <div>
                <label className="block text-[var(--txt)] font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-3
                    bg-[var(--bg-ter)]
                    text-[var(--txt)]
                    rounded-[var(--radius)]
                    border border-[var(--bg-ter)]
                    focus:border-[var(--btn)]
                    focus:outline-none
                  "
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-[var(--btn)]
                  hover:bg-[var(--btn-hover)]
                  text-white py-3
                  rounded-[var(--radius)]
                  font-semibold transition-all
                "
              >
                <Send size={18} />
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Departments & Map */}
          <div className="space-y-6">

            {/* Departments */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="
                bg-[var(--bg-sec)]
                border border-[var(--bg-ter)]
                rounded-[var(--radius)]
                p-8
                shadow-[0_12px_35px_rgba(var(--shadow-rgb),0.25)]
              "
            >
              <h2 className="text-2xl font-bold text-[var(--txt)] mb-6">
                Department Contacts
              </h2>

              <div className="space-y-4">
                {departments.map((dept, i) => (
                  <div
                    key={i}
                    className="
                      bg-[var(--bg-ter)]
                      rounded-[var(--radius)]
                      p-4
                    "
                  >
                    <h3 className="font-semibold text-[var(--txt)] mb-1">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-[var(--txt-dim)]">
                      Email: {dept.email}
                    </p>
                    <p className="text-sm text-[var(--txt-dim)]">
                      Phone: {dept.phone}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Office Location */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="
                bg-[var(--bg-sec)]
                border border-[var(--bg-ter)]
                rounded-[var(--radius)]
                p-8
                shadow-[0_12px_35px_rgba(var(--shadow-rgb),0.25)]
              "
            >
              <h2 className="text-2xl font-bold text-[var(--txt)] mb-6">
                Visit Our Office
              </h2>

              <div className="h-56 bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)] rounded-[var(--radius)] flex items-center justify-center">
                <Building2 size={48} className="text-white" />
              </div>

              <div className="mt-4 bg-[rgba(var(--shadow-rgb),0.12)] border border-[var(--btn)] rounded-[var(--radius)] p-4">
                <p className="text-sm text-[var(--txt)]">
                  Our office is centrally located and accessible via public
                  transport. Nearest metro station: Central Secretariat.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            mt-14
            bg-[var(--bg-sec)]
            border border-[var(--bg-ter)]
            rounded-[var(--radius)]
            p-8
            shadow-[0_12px_35px_rgba(var(--shadow-rgb),0.25)]
          "
        >
          <h2 className="text-2xl font-bold text-[var(--txt)] mb-6">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "What are your response times?",
                a: "We typically respond within 24–48 hours during business days.",
              },
              {
                q: "Can I visit without an appointment?",
                a: "Yes, walk-ins are allowed during working hours.",
              },
              {
                q: "How do I track my query?",
                a: "A reference number will be emailed after submission.",
              },
              {
                q: "Do you offer regional language support?",
                a: "Yes, multilingual assistance is available.",
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-semibold text-[var(--txt)] mb-1">
                  {item.q}
                </h3>
                <p className="text-sm text-[var(--txt-dim)]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;