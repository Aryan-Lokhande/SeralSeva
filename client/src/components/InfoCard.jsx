import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const InfoCard = ({ icon, title, description, link, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(link)}
      className="
        group flex flex-col h-full p-6 cursor-pointer
        bg-gradient-to-br from-white to-[var(--accent)]/30
        border border-orange-100/80 rounded-2xl
        hover:border-[var(--btn)] hover:from-white hover:to-[var(--accent)]/60
        transition-all duration-300
        shadow-[0_10px_25px_-5px_rgba(169,116,95,0.06),0_8px_10px_-6px_rgba(169,116,95,0.04)]
        hover:shadow-[0_20px_35px_-5px_rgba(169,116,95,0.15),0_12px_16px_-8px_rgba(169,116,95,0.1)]
      "
    >
      {/* Icon Container */}
      <div className="
        w-14 h-14 rounded-2xl 
        bg-white border border-orange-100/50
        flex items-center justify-center 
        text-[var(--btn)] shadow-sm
        group-hover:scale-110 group-hover:rotate-3 group-hover:border-orange-200/80
        transition-all duration-300
      ">
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow mt-6">
        <h3 className="text-xl font-bold text-[var(--txt)] tracking-tight group-hover:text-[var(--btn)] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[var(--txt-dim)] text-sm leading-relaxed mt-2.5">
          {description}
        </p>
      </div>

      {/* Action Link */}
      <div className="mt-8 pt-4 border-t border-orange-50/60 flex items-center justify-between text-sm font-semibold text-[var(--btn)]">
        <span>Explore details</span>
        <ArrowRight className="w-4.5 h-4.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
      </div>
    </motion.div>
  );
};

export default InfoCard;

