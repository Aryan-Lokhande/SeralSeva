import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileEdit,
  ClipboardCheck,
  CheckCircle,
  Megaphone,
  Search,
  Phone,
  Mail,
} from "lucide-react";

const Grievances = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      icon: FileEdit,
      title: "Register Complaint",
      description:
        "Fill out the grievance form with all necessary details about your issue.",
    },
    {
      step: 2,
      icon: ClipboardCheck,
      title: "Get Tracking ID",
      description:
        "Receive a unique tracking ID to monitor the status of your grievance.",
    },
    {
      step: 3,
      icon: CheckCircle,
      title: "Track & Resolve",
      description:
        "Monitor progress and receive updates until your grievance is resolved.",
    },
  ];

  const actionCards = [
    {
      icon: Megaphone,
      title: "Lodge a Grievance",
      description:
        "Submit a new complaint or grievance regarding any government scheme or service.",
      buttonText: "File Complaint",
      action: () => navigate("/lodge-grievance"),
    },
    {
      icon: Search,
      title: "Check Status",
      description:
        "Track the status of your existing grievance using your tracking ID.",
      buttonText: "Track Status",
      action: () => navigate("/track-grievance"),
    },
    {
      icon: Phone,
      title: "Contact Support",
      description: "Need help? Reach out to our support team for assistance.",
      buttonText: "Get Help",
      action: () => navigate("/contact"),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[var(--btn)] to-[var(--btn-hover)]/50 py-20">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mt-4"
          >
            Your voice matters. Register and track grievances with ease.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--txt)] mb-4">
            How It Works
          </h2>
          <p className="text-[var(--txt-dim)] text-lg">
            Resolve your grievance in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="
                  relative
                  bg-[var(--bg-sec)]
                  border border-[var(--bg-ter)]
                  rounded-[var(--radius)]
                  p-8
                  shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.25)]
                "
              >
                {/* Step Badge */}
                <div
                  className="
                    absolute -top-6 -left-6
                    w-14 h-14
                    rounded-full
                    bg-[var(--btn)]
                    flex items-center justify-center
                    text-white font-bold text-xl
                    shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.45)]
                  "
                >
                  {step.step}
                </div>

                <div className="flex justify-center mt-6 mb-6">
                  <div
                    className="
                      w-20 h-20
                      rounded-full
                      bg-[rgba(var(--shadow-rgb),0.15)]
                      flex items-center justify-center
                    "
                  >
                    <Icon size={36} className="text-[var(--btn)]" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[var(--txt)] text-center mb-3">
                  {step.title}
                </h3>
                <p className="text-center text-[var(--txt-dim)]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Actions */}
      <section className="bg-[var(--bg-sec)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-[var(--txt)] mb-4">
              What Would You Like To Do?
            </h2>
            <p className="text-[var(--txt-dim)] text-lg">
              Choose an option below to get started
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {actionCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="
                    bg-gradient-to-br
                    from-[var(--btn)]
                    to-[var(--btn-hover)]
                    p-8
                    rounded-[var(--radius)]
                    shadow-[0_14px_40px_rgba(var(--shadow-rgb),0.45)]
                    text-center
                  "
                >
                  <div className="flex justify-center mb-6">
                    <div
                      className="
                        w-16 h-16
                        rounded-full
                        bg-white/20
                        flex items-center justify-center
                      "
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/90 mb-6">{card.description}</p>

                  <button
                    onClick={card.action}
                    className="
                      bg-white
                      text-[var(--btn)]
                      px-8 py-3
                      rounded-[var(--radius)]
                      font-semibold
                      hover:shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.4)]
                      transition-all
                    "
                  >
                    {card.buttonText}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            bg-[rgba(var(--shadow-rgb),0.12)]
            border border-[var(--btn)]
            rounded-[var(--radius)]
            p-8 text-center
          "
        >
          <h3 className="text-2xl font-bold text-[var(--txt)] mb-4">
            Need Assistance?
          </h3>
          <p className="text-[var(--txt-dim)] mb-6">
            Our support team is here to help you
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 text-[var(--txt)]">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-[var(--btn)]" />
              grievance@saralseva.gov.in
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-[var(--btn)]" />
              1800-XXX-XXXX (Toll Free)
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Grievances;
