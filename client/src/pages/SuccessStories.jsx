import { motion } from "framer-motion";
import { useState } from "react";

const SuccessStories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Housing",
    "Healthcare",
    "Education",
    "Agriculture",
    "Employment",
  ];

  const stories = [
    {
      id: 1,
      name: "Rajesh Kumar",
      age: 45,
      location: "Uttar Pradesh",
      category: "Housing",
      scheme: "Pradhan Mantri Awas Yojana",
      image: "🏠",
      story:
        "After living in a kutcha house for 20 years, I finally have my own pucca home. The PMAY scheme changed my family's life. My children now have a safe place to study.",
      impact: "Received ₹2.5 lakh subsidy, built a 2-room house",
      year: "2024",
    },
    {
      id: 2,
      name: "Anita Devi",
      age: 38,
      location: "Bihar",
      category: "Healthcare",
      scheme: "Ayushman Bharat",
      image: "🏥",
      story:
        "My husband needed urgent heart surgery which cost ₹4 lakhs. Thanks to Ayushman Bharat card, we didn't have to sell our land. The entire treatment was covered.",
      impact: "Saved ₹4 lakh in medical expenses",
      year: "2023",
    },
    {
      id: 3,
      name: "Ramesh Patel",
      age: 52,
      location: "Gujarat",
      category: "Agriculture",
      scheme: "PM-KISAN",
      image: "🌾",
      story:
        "The ₹6000 per year from PM-KISAN helps me buy seeds and fertilizers. It's a big support for small farmers like us. I can now afford better quality inputs.",
      impact: "Increased crop yield by 25%",
      year: "2024",
    },
    {
      id: 4,
      name: "Priya Sharma",
      age: 24,
      location: "Maharashtra",
      category: "Education",
      scheme: "PM Scholarship Scheme",
      image: "📚",
      story:
        "Being from an army family, the PM Scholarship helped me pursue my engineering degree. I graduated debt-free and now work at a top IT company.",
      impact: "Completed B.Tech with ₹3000/month scholarship",
      year: "2023",
    },
    {
      id: 5,
      name: "Suresh Yadav",
      age: 35,
      location: "Madhya Pradesh",
      category: "Employment",
      scheme: "NREGA",
      image: "⚒️",
      story:
        "During drought season when there was no farm work, NREGA gave me 100 days of employment. I earned enough to support my family through difficult times.",
      impact: "Earned ₹18,000 in one season",
      year: "2024",
    },
    {
      id: 6,
      name: "Meena Devi",
      age: 42,
      location: "Rajasthan",
      category: "Employment",
      scheme: "PM Mudra Yojana",
      image: "💼",
      story:
        "Started my tailoring business with a ₹50,000 Mudra loan. Today, I employ 5 women from my village. We make school uniforms for nearby schools.",
      impact: "Created 5 jobs, earning ₹30,000/month",
      year: "2023",
    },
    {
      id: 7,
      name: "Lakshmi Narayanan",
      age: 48,
      location: "Tamil Nadu",
      category: "Housing",
      scheme: "Pradhan Mantri Awas Yojana",
      image: "🏡",
      story:
        "My dream of owning a house in the city seemed impossible. PMAY's interest subsidy made it affordable. My family now lives in a proper apartment.",
      impact: "Saved ₹2.67 lakh on home loan interest",
      year: "2024",
    },
    {
      id: 8,
      name: "Santosh Kumar",
      age: 55,
      location: "West Bengal",
      category: "Agriculture",
      scheme: "Kisan Credit Card",
      image: "💳",
      story:
        "The KCC scheme gave me quick access to credit for farming. No more dependency on moneylenders. I can now plan my crops better with timely fund availability.",
      impact: "Accessed ₹1 lakh credit at 4% interest",
      year: "2023",
    },
  ];

  const filteredStories =
    selectedCategory === "All"
      ? stories
      : stories.filter((story) => story.category === selectedCategory);

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
            Success Stories
          </h1>
          <p className="text-txt-dim text-lg max-w-3xl mx-auto">
            Real stories from real people whose lives have been transformed by
            government schemes. These inspiring journeys showcase the impact of
            welfare programs across India.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Beneficiaries", value: "50 Cr+", icon: "👥" },
            { label: "Success Stories", value: "1000+", icon: "⭐" },
            { label: "States Covered", value: "28", icon: "🗺️" },
            { label: "Lives Changed", value: "100 Cr+", icon: "❤️" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-bg-sec p-6 rounded-custom shadow-custom text-center"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-btn mb-1">
                {stat.value}
              </div>
              <div className="text-txt-dim text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-custom font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-btn text-white shadow-custom"
                    : "bg-bg-sec text-txt hover:bg-bg-ter"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-bg-sec rounded-custom shadow-custom-lg overflow-hidden hover:shadow-custom transition-all duration-300"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-btn to-btn-hover p-6 text-center">
                <div className="text-6xl mb-3">{story.image}</div>
                <h3 className="text-xl font-bold text-white">{story.name}</h3>
                <p className="text-gray-200 text-sm">
                  {story.age} years • {story.location}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-btn/20 text-btn">
                    {story.category}
                  </span>
                  <span className="ml-2 text-txt-dim text-xs">
                    {story.year}
                  </span>
                </div>

                <h4 className="text-txt font-semibold mb-2">{story.scheme}</h4>

                <p className="text-txt-dim text-sm mb-4 leading-relaxed">
                  "{story.story}"
                </p>

                <div className="bg-btn/10 border border-btn rounded-custom p-3">
                  <p className="text-xs text-txt-dim mb-1">Impact</p>
                  <p className="text-sm text-txt font-medium">{story.impact}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Share Your Story CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-btn to-btn-hover p-12 rounded-custom text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Have a Success Story to Share?
          </h2>
          <p className="text-gray-100 text-lg mb-8 max-w-2xl mx-auto">
            Your story can inspire millions. If a government scheme has made a
            positive impact on your life, we'd love to hear from you.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/contact")}
            className="bg-white text-btn px-8 py-3 rounded-custom font-bold text-lg hover:shadow-custom-lg transition-all duration-200"
          >
            Submit Your Story
          </motion.button>
        </motion.div>

        {/* Video Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-txt mb-8 text-center">
            Video Testimonials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((video) => (
              <div
                key={video}
                className="bg-bg-sec rounded-custom shadow-custom overflow-hidden"
              >
                {/* Video Placeholder */}
                <div className="bg-gradient-to-br from-btn to-btn-hover h-48 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg
                      className="w-16 h-16 mx-auto mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    <p className="text-sm">Video Testimonial {video}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-txt font-semibold mb-1">
                    Beneficiary Interview
                  </h4>
                  <p className="text-txt-dim text-sm">
                    Watch how schemes transformed lives
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessStories;
