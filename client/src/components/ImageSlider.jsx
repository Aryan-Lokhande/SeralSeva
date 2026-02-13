import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sliderImages } from "../data/mockData";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5020); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  };

  // console.log(sliderImages);

  return (
    <div
      className="
      relative w-full h-[400px] md:h-[500px] overflow-hidden
      bg-[var(--bg-sec)] rounded-[var(--radius)]
      shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.18)]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={sliderImages[currentIndex].url}
            alt={sliderImages[currentIndex].alt}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[var(--txt)]/40" />

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {sliderImages[currentIndex].title}
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                {sliderImages[currentIndex].alt}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="
        absolute left-4 top-1/2 -translate-y-1/2
        bg-[var(--bg-ter)]/80 hover:bg-[var(--bg-ter)] text-[var(--txt)]
        p-3 rounded-full transition-all duration-200 backdrop-blur-sm
        shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.25)] "
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="
        absolute right-4 top-1/2 -translate-y-1/2
        bg-[var(--bg-ter)]/80 hover:bg-[var(--bg-ter)]
        text-[var(--txt)]
        p-3 rounded-full
        transition-all duration-200
        backdrop-blur-sm
        shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.25)]
      "
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
            h-3 rounded-full transition-all duration-300
            ${
              index === currentIndex
                ? "bg-[var(--btn)] w-10 shadow-[0_4px_14px_rgba(var(--shadow-rgb),0.35)]"
                : "bg-white/60 hover:bg-white w-3"
            }
          `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
