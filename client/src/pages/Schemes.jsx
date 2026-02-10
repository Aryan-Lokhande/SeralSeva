import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getSchemes } from "../utils/api";
import toast from "react-hot-toast";

const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await getSchemes({ isActive: true });
      if (response.success) {
        setSchemes(response.data);
      }
    } catch (error) {
      toast.error("Failed to load schemes");
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (scheme) => {
    navigate("/apply-scheme", { state: { scheme } });
  };

  const handleDownloadBrochure = (scheme) => {
    // Mock download - in real app, this would download actual PDF
    toast.success(`Downloading brochure for ${scheme.title}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-txt text-xl">Loading schemes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-btn to-btn-hover py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            Government Schemes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-100 mt-4"
          >
            Explore and apply for various government welfare programmes
          </motion.p>
        </div>
      </section>

      {/* Schemes Table Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-txt mb-2">
            Available Schemes & Programmes
          </h2>
          <p className="text-txt-dim">
            Browse through all available government schemes and apply online
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-bg-sec rounded-custom shadow-custom-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-btn text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Sr. No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Scheme Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Brochure
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-ter">
                {schemes.map((scheme, index) => (
                  <motion.tr
                    key={scheme._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-bg-ter transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-txt">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div
                          className="text-txt font-medium hover:text-btn cursor-pointer"
                          onClick={() => navigate(`/scheme/${scheme._id}`)}
                        >
                          {scheme.title}
                        </div>
                        <div className="text-txt-dim text-sm mt-1">
                          {scheme.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-btn/20 text-btn">
                        {scheme.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownloadBrochure(scheme)}
                        className="text-btn hover:text-btn-hover font-medium flex items-center space-x-1 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Download</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(scheme)}
                        className="bg-btn hover:bg-btn-hover text-white px-6 py-2 rounded-custom font-medium transition-colors duration-200"
                      >
                        Apply Now
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-btn/10 border border-btn rounded-custom p-6"
        >
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-btn flex-shrink-0 mt-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-txt font-semibold mb-1">
                Important Information
              </h3>
              <p className="text-txt-dim text-sm">
                Please read the scheme brochure carefully before applying.
                Ensure you meet all eligibility criteria and have all required
                documents ready.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Schemes;
