import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Star,
  MapPin,
  HeartHandshake,
  Home,
  GraduationCap,
  Stethoscope,
  Wheat,
  Briefcase,
  PlayCircle,
} from "lucide-react";

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

  const categoryIcons = {
    Housing: Home,
    Healthcare: Stethoscope,
    Education: GraduationCap,
    Agriculture: Wheat,
    Employment: Briefcase,
  };

  const stories = [
    {
      id: 1,
      name: "Rajesh Kumar",
      age: 45,
      location: "Uttar Pradesh",
      category: "Housing",
      scheme: "Pradhan Mantri Awas Yojana",
      story:
        "After living in a kutcha house for 20 years, I finally have my own pucca home. The PMAY scheme changed my family's life.",
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
      story:
        "My husband needed urgent heart surgery. Thanks to Ayushman Bharat, the entire treatment was covered.",
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
      story:
        "The ₹6000 per year from PM-KISAN helps me buy better quality seeds and fertilizers.",
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
      story:
        "The PM Scholarship helped me complete my engineering degree without financial stress.",
      impact: "Completed B.Tech with monthly scholarship",
      year: "2023",
    },
    {
      id: 5,
      name: "Suresh Yadav",
      age: 35,
      location: "Madhya Pradesh",
      category: "Employment",
      scheme: "NREGA",
      story:
        "During drought season, NREGA gave me stable work and income to support my family.",
      impact: "Earned ₹18,000 in one season",
      year: "2024",
    },
  ];

  const filteredStories =
    selectedCategory === "All"
      ? stories
      : stories.filter((s) => s.category === selectedCategory);

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
            Success Stories
          </h1>
          <p className="text-[var(--txt-dim)] text-lg max-w-3xl mx-auto">
            Real stories from citizens whose lives have been transformed by
            government welfare schemes across India.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {[
            { label: "Beneficiaries", value: "50 Cr+", icon: Users },
            { label: "Stories", value: "1000+", icon: Star },
            { label: "States", value: "28", icon: MapPin },
            { label: "Lives Impacted", value: "100 Cr+", icon: HeartHandshake },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-[var(--bg-sec)] border border-[var(--bg-ter)] rounded-[var(--radius)] p-6 text-center shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.2)]"
              >
                <Icon className="mx-auto mb-3 text-[var(--btn)]" size={32} />
                <div className="text-2xl font-bold text-[var(--txt)]">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--txt-dim)]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-2 rounded-[var(--radius)] font-medium transition-all
                ${
                  selectedCategory === category
                    ? "bg-[var(--btn)] text-white shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.4)]"
                    : "bg-[var(--bg-sec)] text-[var(--txt)] hover:bg-[var(--bg-ter)]"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => {
            const Icon = categoryIcons[story.category];
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[var(--bg-sec)] border border-[var(--bg-ter)] rounded-[var(--radius)] shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.25)] overflow-hidden"
              >
                <div className="p-6 border-b border-[var(--bg-ter)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="text-[var(--btn)]" size={24} />
                    <span className="text-sm text-[var(--txt-dim)]">
                      {story.category} • {story.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--txt)]">
                    {story.name}
                  </h3>
                  <p className="text-sm text-[var(--txt-dim)]">
                    {story.age} yrs • {story.location}
                  </p>
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-[var(--txt)] mb-2">
                    {story.scheme}
                  </h4>
                  <p className="text-sm text-[var(--txt-dim)] mb-4 leading-relaxed">
                    “{story.story}”
                  </p>

                  <div className="bg-[rgba(var(--shadow-rgb),0.12)] border border-[var(--btn)] rounded-[var(--radius)] p-3">
                    <p className="text-xs text-[var(--txt-dim)] mb-1">
                      Impact
                    </p>
                    <p className="text-sm font-medium text-[var(--txt)]">
                      {story.impact}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Video Testimonials */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-[var(--txt)] mb-8 text-center">
            Video Testimonials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((v) => (
              <div
                key={v}
                className="bg-[var(--bg-sec)] border border-[var(--bg-ter)] rounded-[var(--radius)] shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.2)] overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)] flex items-center justify-center">
                  <PlayCircle size={48} className="text-white" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-[var(--txt)]">
                    Beneficiary Interview
                  </h4>
                  <p className="text-sm text-[var(--txt-dim)]">
                    Real experiences shared by citizens
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuccessStories;
