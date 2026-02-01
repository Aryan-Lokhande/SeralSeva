import { motion } from "framer-motion";
import { latestUpdates } from "../data/mockData";

const Marquee = () => {
  // Duplicate updates for seamless loop
  const updates = [...latestUpdates, ...latestUpdates];

  return (
    <div
      className="
      bg-[rgba(var(--shadow-rgb),0.08)]
      border-y-2 border-[var(--btn)] overflow-hidden"
    >
      <div className="flex items-center space-x-4">
        {/* Label */}
        <div
          className="
          bg-[var(--btn)]
          text-white
          px-6 py-2
          rounded-[var(--radius)]
          font-bold
          flex-shrink-0
          shadow-[0_4px_14px_rgba(var(--shadow-rgb),0.35)]
        "
        >
          LATEST UPDATES
        </div>

        {/* Scrolling Content */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex space-x-12"
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {updates.map((update, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 whitespace-nowrap"
              >
                {/* Bullet */}
                <span className="text-[var(--btn)] text-xl">●</span>

                {/* Text */}
                <span className="text-[var(--txt)] font-medium">{update}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
