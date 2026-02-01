import { motion } from "framer-motion";

const StepCard = ({ step, title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="
      relative
      bg-[var(--bg-ter)]
      p-8
      rounded-[var(--radius)]
      border border-[var(--bg-ter)]
      transition-all duration-300
    "
    >
      {/* Step Number Badge */}

      {/* Icon */}
      <div className="flex justify-center mb-6 mt-4">
        <div
          className="
          w-24 h-24
          rounded-full
          flex items-center justify-center
          bg-[rgba(var(--shadow-rgb),0.18)]
        "
        >
          <span className="text-6xl text-[var(--accent)]">{icon}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-[var(--txt)] text-center mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[var(--txt-dim)] text-center leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
};

export default StepCard;
