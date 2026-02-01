import { motion } from "framer-motion";
import ImageSlider from "../components/ImageSlider.jsx";
import Marquee from "../components/Marquee.jsx";
import InfoCard from "../components/InfoCard.jsx";
import StepCard from "../components/StepCard.jsx";

const Home = () => {
  const infoCards = [
    {
      icon: "📋",
      title: "Scheme Information",
      description:
        "Explore detailed information about all government schemes and their benefits",
      link: "/schemes",
    },
    {
      icon: "✅",
      title: "Eligibility Criteria",
      description:
        "Check if you qualify for various government schemes and programs",
      link: "/schemes",
    },
    {
      icon: "👥",
      title: "Beneficiaries",
      description: "Learn about who can benefit from different welfare schemes",
      link: "/schemes",
    },
    {
      icon: "📝",
      title: "Application Process",
      description: "Step-by-step guide to apply for government schemes online",
      link: "/schemes",
    },
  ];

  const steps = [
    {
      step: 1,
      icon: "📝",
      title: "Enter Details",
      description:
        "Fill in your basic information and documents required for the scheme application",
    },
    {
      step: 2,
      icon: "🔍",
      title: "Find Scheme",
      description:
        "Browse through available schemes and find the ones you are eligible for",
    },
    {
      step: 3,
      icon: "✨",
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
      <section className="mb-12">
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
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--txt)] mb-4">
            Explore Government Schemes
          </h2>
          <p className="text-[var(--txt-dim)] text-lg">
            Everything you need to know about available schemes and benefits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {infoCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="
        h-full
        flex
        bg-[var(--bg-sec)]
        border border-[var(--bg-ter)]
        rounded-[var(--radius)]
      "
            >
              <InfoCard {...card} className="flex-1" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[var(--bg-sec)] py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--txt)] mb-4">
              HOW IT WORKS
            </h2>
            <p className="text-[var(--txt-dim)] text-xl">
              Government Schemes, Simplified in 3 Steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} delay={index * 0.2} />
            ))}
          </div>
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
        bg-gradient-to-r 
        from-[var(--btn)] 
        to-[var(--btn-hover)]
        p-12 
        rounded-[var(--radius)] 
        text-center
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
            onClick={() => (window.location.href = "/schemes")}
            className="
          bg-[var(--bg-primary)]
          text-[var(--btn)]
          px-8 py-3
          rounded-[var(--radius)]
          font-bold text-lg
          hover:shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.35)]
          transition-all duration-200
        "
          >
            Browse Schemes
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
