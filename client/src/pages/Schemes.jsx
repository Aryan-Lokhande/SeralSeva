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
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white"
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
      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="
          bg-[var(--bg-sec)]
          rounded-[var(--radius)]
          border border-[var(--bg-ter)]
          shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.25)]
          overflow-hidden
        "
      >
        {/* Scroll only here */}
        <div className="w-full overflow-x-auto ">
          <table className="min-w-[950px] w-full table-auto ">
            {/* Header */}
            <thead className="sticky top-0 bg-[var(--btn)] text-white z-10">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold w-[70px]">
                  Sr
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold w-[30%]">
                  Scheme
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold w-[140px]">
                  Category
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold w-[160px]">
                  Deadline
                </th>

                <th className="px-4 py-4 text-left text-sm font-semibold w-[150px]">
                  Brochure
                </th>

                <th className="px-4 py-4 text-center text-sm font-semibold w-[160px]">
                  Action
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-[var(--txt-dim)]/80">
              {schemes.map((scheme, index) => (
                <motion.tr
                  key={scheme._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-[var(--bg-ter)] transition-all duration-200"
                >
                  {/* Sr No */}
                  <td className="px-4 py-4 text-[var(--txt)]">{index + 1}</td>

                  {/* Scheme Title */}
                  <td className="px-6 py-4">
                    <div className="max-w-[300px]">
                      <div
                        className="
                          text-[var(--txt)] font-medium
                          hover:text-[var(--btn)]
                          cursor-pointer
                          transition-colors duration-200"
                        onClick={() => handleApply(scheme)}
                      >
                        {scheme.title}
                      </div>

                      <div className="text-[var(--txt-dim)] text-sm mt-1 line-clamp-2">
                        {scheme.description}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <span
                      className="
                        px-3 py-1
                        text-xs font-semibold
                        rounded-full
                        bg-[rgba(var(--shadow-rgb),0.2)]
                        text-[var(--btn)]
                      "
                    >
                      {scheme.category}
                    </span>
                  </td>

                  {/* Deadline */}
                  <td className="px-4 py-4 text-center text-[var(--txt)]">
                    {scheme.applicationDeadline ? (
                      <span className="font-medium">
                        {new Date(
                          scheme.applicationDeadline,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="text-[var(--txt-dim)] text-sm">
                        No Deadline
                      </span>
                    )}
                  </td>

                  {/* Brochure */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleDownloadBrochure(scheme)}
                      className="
                        text-[var(--btn)] font-medium
                        hover:text-[var(--btn-hover)]
                        flex items-center gap-2
                        transition-colors duration-200"
                    >
                      <Download size={18} />
                      <span>Download</span>
                    </button>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApply(scheme)}
                      className="
                        bg-[var(--btn)] text-white 
                        hover:bg-[var(--btn-hover)]
                        rounded-[var(--radius)]
                        px-7 py-2 font-medium
                        transition-all duration-200
                        shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.4)]"
                    >
                      Apply
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="my-6 mx-4 bg-[var(--btn)]/10 border border-[var(--btn)] rounded-[var(--radius)] p-6"
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
      </motion.div>
    </div>
  );
};

export default Schemes;
