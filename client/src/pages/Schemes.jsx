import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getSchemes } from "../utils/api";
import toast from "react-hot-toast";
import { Download, Info } from "lucide-react";

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
    toast.success(`Downloading brochure for ${scheme.title}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-[var(--txt)] text-xl font-medium">
          Loading schemes...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--txt)]">
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-[var(--btn)]/90 to-[var(--btn-hover)]/50 py-20">
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
            className="text-xl text-white/90 mt-4"
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
          <h2 className="text-3xl font-bold text-[var(--txt)] mb-2">
            Available Schemes & Programmes
          </h2>
          <p className="text-[var(--txt-dim)]">
            Browse through all available government schemes and apply online
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[var(--bg-sec)] rounded-[var(--radius)] shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.25)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--btn)]/90 text-white">
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

              <tbody className="divide-y divide-[var(--bg-ter)]">
                {schemes.map((scheme, index) => (
                  <motion.tr
                    key={scheme._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-[var(--bg-ter)] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--txt)]">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div
                          className="text-[var(--txt)] font-medium hover:text-[var(--btn)] cursor-pointer transition-colors duration-200"
                          onClick={() => navigate(`/scheme/${scheme._id}`)}
                        >
                          {scheme.title}
                        </div>
                        <div className="text-[var(--txt-dim)] text-sm mt-1">
                          {scheme.description}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--btn)]/20 text-[var(--btn)]">
                        {scheme.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownloadBrochure(scheme)}
                        className="text-[var(--btn)] hover:text-[var(--btn-hover)] font-medium flex items-center gap-2 transition-colors duration-200"
                      >
                        <Download size={18} />
                        <span>Download</span>
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(scheme)}
                        className="bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white px-6 py-2 rounded-[var(--radius)] font-medium transition-colors duration-200"
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
          className="mt-8 bg-[var(--btn)]/10 border border-[var(--btn)] rounded-[var(--radius)] p-6"
        >
          <div className="flex items-start gap-3">
            <Info size={22} className="text-[var(--btn)] mt-1" />
            <div>
              <h3 className="text-[var(--txt)] font-semibold mb-1">
                Important Information
              </h3>
              <p className="text-[var(--txt-dim)] text-sm">
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
