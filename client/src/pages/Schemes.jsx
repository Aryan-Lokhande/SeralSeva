import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { schemesData } from "../data/mockData";
import img from "../assets/images/slider2.jpg";
import { Download, Info } from "lucide-react";

const Schemes = () => {
  const navigate = useNavigate();

  const handleApply = (scheme) => {
    navigate("/apply-scheme", { state: { scheme } });
  };

  const handleDownloadBrochure = (scheme) => {
    alert(`Downloading brochure for ${scheme.title}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <img
          src={img}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[var(--btn)]/30 to-[var(--btn-hover)]/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            Government Schemes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mt-4"
          >
            Explore and apply for various government welfare programmes
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Heading */}
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
            Browse all available government schemes and apply online
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="
            bg-[var(--bg-sec)]
            border border-[var(--bg-ter)]
            rounded-[var(--radius)]
            shadow-[0_12px_35px_rgba(var(--shadow-rgb),0.25)]
            overflow-hidden
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--btn)] text-white">
                <tr>
                  {[
                    "Sr. No",
                    "Scheme Title",
                    "Category",
                    "Brochure",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-sm font-semibold uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--bg-ter)]">
                {schemesData.map((scheme, index) => (
                  <motion.tr
                    key={scheme.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[var(--bg-ter)] transition-colors"
                  >
                    <td className="px-6 py-4 text-[var(--txt)]">
                      {scheme.srNo}
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className="font-medium text-[var(--txt)] hover:text-[var(--btn)] cursor-pointer"
                        onClick={() => navigate(`/scheme/${scheme.id}`)}
                      >
                        {scheme.title}
                      </div>
                      <p className="text-sm text-[var(--txt-dim)] mt-1">
                        {scheme.description}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[rgba(var(--shadow-rgb),0.15)] text-[var(--btn)]">
                        {scheme.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownloadBrochure(scheme)}
                        className="
                          inline-flex items-center gap-1
                          text-[var(--btn)]
                          hover:text-[var(--btn-hover)]
                          font-medium transition-colors
                        "
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(scheme)}
                        className="
                          bg-[var(--btn)]
                          hover:bg-[var(--btn-hover)]
                          text-white px-6 py-2
                          rounded-[var(--radius)]
                          font-medium transition-colors
                        "
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
          className="
            mt-8
            bg-[rgba(var(--shadow-rgb),0.12)]
            border border-[var(--btn)]
            rounded-[var(--radius)]
            p-6
          "
        >
          <div className="flex items-start gap-3">
            <Info size={22} className="text-[var(--btn)] mt-1" />
            <div>
              <h3 className="font-semibold text-[var(--txt)] mb-1">
                Important Information
              </h3>
              <p className="text-sm text-[var(--txt-dim)]">
                Please read the scheme brochure carefully before applying.
                Ensure eligibility criteria are met and documents are ready.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Schemes;
