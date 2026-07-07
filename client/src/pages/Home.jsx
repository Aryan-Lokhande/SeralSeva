import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ImageSlider from "../components/ImageSlider.jsx";
import Marquee from "../components/Marquee.jsx";
import InfoCard from "../components/InfoCard.jsx";

import {
  ClipboardList,
  BadgeCheck,
  Users,
  FileText,
  PenLine,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const infoCards = [
    {
      icon: <ClipboardList size={28} className="text-[var(--btn)]" />,
      title: "Scheme Information",
      description:
        "Explore detailed information about all government schemes and their benefits",
      link: "/schemes",
    },
    {
      icon: <BadgeCheck size={28} className="text-[var(--btn)]" />,
      title: "Eligibility Criteria",
      description:
        "Check if you qualify for various government schemes and programs",
      link: "/schemes",
    },
    {
      icon: <Users size={28} className="text-[var(--btn)]" />,
      title: "Beneficiaries",
      description: "Learn about who can benefit from different welfare schemes",
      link: "/schemes",
    },
    {
      icon: <FileText size={28} className="text-[var(--btn)]" />,
      title: "Application Process",
      description: "Step-by-step guide to apply for government schemes online",
      link: "/schemes",
    },
  ];

  const steps = [
    {
      step: 1,
      icon: <PenLine size={60} className="text-[var(--btn)]" />,
      title: "Enter Details",
      description:
        "Fill in your basic information and documents required for the scheme application",
    },
    {
      step: 2,
      icon: <Search size={60} className="text-[var(--btn)]" />,
      title: "Find Scheme",
      description:
        "Browse through available schemes and find the ones you are eligible for",
    },
    {
      step: 3,
      icon: <Sparkles size={60} className="text-[var(--btn)]" />,
      title: "Select & Apply",
      description:
        "Choose your scheme and submit your application with all necessary documents",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--txt)]">
      {/* Hero Section with Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ImageSlider />
      </section>

      {/* Marquee Section */}
      <section className="mb-4">
        <Marquee />
      </section>

      {/* Info Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl  font-extrabold text-[var(--txt)] mb-4">
            Explore Government Schemes
          </h2>
          <p className="text-[var(--txt-dim)] text-lg">
            Everything you need to know about available schemes and benefits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} index={index} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white relative overflow-hidden transition-colors duration-500">
        <div className="relative z-10 text-center">
          <p className="text-4xl font-bold text-amber-600 md:text-5xl lg:text-6xl tracking-widest">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 text-4xl font-extrabold  text-[var(--txt)] jost md:text-5xl">
            Government Schemes, Simplified in 3 Steps
          </h2>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-16 px-4 max-w-7xl relative">
          {[
            {
              icon: PenLine,
              title: "Enter Details",
              description: "Start by providing your basic details.",
              border: "border-t-amber-500",
            },
            {
              icon: Search,
              title: "Find Your Schemes",
              description: "Shows the most relevant schemes.",
              border: "border-t-orange-600",
            },
            {
              icon: Sparkles,
              title: "Select & Apply",
              description: "Apply directly through our simplified portal.",
              border: "border-t-red-800",
            },
          ].map((step, index) => (
            <div
              key={index}
              className={`relative flex flex-col items-center p-8 text-center bg-white border border-orange-100/80 border-t-4 ${step.border} rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(169,116,95,0.08)] transition-all duration-300 group hover:-translate-y-1`}
            >
              {/* Step Connection Arrow (only on desktop and between items) */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 z-10 text-orange-200">
                  <ArrowRight className="w-8 h-8 animate-pulse" />
                </div>
              )}

              {/* Step Number Badge */}
              <div className="absolute top-4 right-6 text-5xl font-extrabold text-orange-100/40 select-none group-hover:text-orange-200/50 transition-colors duration-300">
                0{index + 1}
              </div>

              {/* Icon */}
              <div className="p-4 rounded-2xl bg-[var(--accent)] text-[var(--btn)] group-hover:scale-110 transition-transform duration-300 shadow-sm border border-orange-50/50">
                <step.icon className="w-10 h-10" />
              </div>

              <h3
                className="mt-6 text-xl font-bold text-[var(--txt)] tracking-tight cursor-pointer"
                data-tooltip-id={`step-title-${index}`}
                data-tooltip-content={`Step ${index + 1}:\n${step.description}`}
              >
                {step.title}
              </h3>

              <p className="mt-3 text-sm text-[var(--txt-dim)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
            bg-gradient-to-r from-[var(--btn)] 
            to-[var(--btn-hover)] p-12 
            rounded-[var(--radius)] text-center
            shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.35)]
          "
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>

          <p className="text-white/90 text-lg mb-8">
            Apply for government schemes and track your applications easily
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/schemes")}
            className="
              bg-[var(--bg-primary)] text-[var(--btn)] mx-3
              px-8 py-3 rounded-[var(--radius)] font-bold text-lg
              hover:shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.35)]
              transition-all duration-200 cursor-pointer"
          >
            Browse Schemes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/suggest")}
            className="
              bg-[var(--bg-primary)] text-[var(--btn)] mx-3 mt-2
              px-8 py-3 rounded-[var(--radius)] font-bold text-lg
              hover:shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.35)]
              transition-all duration-200 cursor-pointer"
          >
            Suggest Scheme
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
