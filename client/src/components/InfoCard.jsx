import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const InfoCard = ({ icon, title, description, link }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(link)}
      className="
    bg-[var(--accent)] hover:bg-[var(--bg-ter)]
    p-8 rounded-[var(--radius)] cursor-pointer
    transition-all duration-300 border border-[var(--bg-ter)]
    hover:border-[var(--btn)]
    shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.18)]
    hover:shadow-[0_16px_45px_rgba(var(--shadow-rgb),0.35)]"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div
          className="
        w-20 h-20 rounded-full 
        flex items-center justify-center"
        >
          <span className="text-5xl text-[var(--btn)]">{icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-[var(--txt)]">{title}</h3>

        {/* Description */}
        <p className="text-[var(--txt-dim)] leading-relaxed text-sm">{description}</p>

        {/* Arrow Icon */}
        <motion.div
          className="text-[var(--btn)] mt-4"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
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
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InfoCard;
