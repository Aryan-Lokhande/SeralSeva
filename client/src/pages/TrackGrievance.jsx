import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
  HelpCircle,
  Search,
} from "lucide-react";

const TrackGrievance = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [trackingId, setTrackingId] = useState(
    location.state?.trackingId || "",
  );
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const grievances = JSON.parse(localStorage.getItem("grievances") || "[]");
      const found = grievances.find((g) => g.id === trackingId);

      if (found) {
        const timeline = [
          {
            status: "Submitted",
            date: found.submittedDate,
            description:
              "Your grievance has been successfully submitted and registered.",
            completed: true,
          },
          {
            status: "Under Review",
            date: new Date(Date.now() + 86400000).toISOString(),
            description:
              "Your grievance is currently being reviewed by the department.",
            completed: true,
          },
          {
            status: "In Progress",
            date: new Date(Date.now() + 172800000).toISOString(),
            description: "Corrective action is in progress.",
            completed: false,
          },
          {
            status: "Resolved",
            date: null,
            description:
              "Your grievance will be closed once the issue is resolved.",
            completed: false,
          },
        ];

        setGrievance({ ...found, timeline });
        toast.success("Grievance found");
      } else {
        setGrievance(null);
        toast.error("No grievance found with this Tracking ID");
      }
      setLoading(false);
    }, 1000);
  };

  const statusStyle = (completed) =>
    completed
      ? "bg-[var(--btn)] text-white"
      : "bg-[var(--bg-ter)] text-[var(--txt-dim)]";

  return (
    <div className="min-h-screen pt-8 py-10 bg-[var(--bg-primary)]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="
          mb-6 ml-4 inline-flex items-center gap-2 text-[var(--btn)]
          hover:text-[var(--btn-hover)] font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            bg-gradient-to-r from-[var(--btn)] mb-8
            to-[var(--btn-hover)] p-8 rounded-[var(--radius)]
            shadow-[0_12px_40px_rgba(var(--shadow-rgb),0.45)]"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Track Your Grievance
          </h1>
          <p className="text-white/90">
            Enter your tracking ID to view grievance status
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            bg-[var(--bg-sec)] border border-[var(--bg-ter)] 
            p-8 mb-8 rounded-[var(--radius)]
            shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.25)]"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-[var(--txt)] font-medium">
              Tracking ID
            </label>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              className="
                w-full px-4 py-3 bg-[var(--bg-ter)]
                text-[var(--txt)] rounded-[var(--radius)]
                border border-[var(--bg-ter)] focus:border-[var(--btn)]
                focus:outline-none"
              placeholder="GRVXXXXXXXX"
              required
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2 
                bg-[var(--btn)] hover:bg-[var(--btn-hover)]
                text-white py-3 rounded-[var(--radius)]
                font-semibold transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Searching
                </>
              ) : (
                <>
                  <Search size={18} />
                  Track Grievance
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Result */}
        {grievance && (
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-[var(--bg-sec)] rounded-[var(--radius)] p-6 border border-[var(--bg-ter)]">
              <h2 className="text-2xl font-bold text-[var(--txt)] mb-4">
                Grievance Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--txt-dim)]">ID</p>
                  <p className="text-[var(--txt)] font-medium">
                    {grievance.id}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--txt-dim)]">Category</p>
                  <p className="text-[var(--txt)] font-medium">
                    {grievance.category}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[var(--txt-dim)]">Subject</p>
                  <p className="text-[var(--txt)]">{grievance.subject}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[var(--bg-sec)] rounded-[var(--radius)] p-6 border border-[var(--bg-ter)]">
              <h3 className="text-xl font-bold text-[var(--txt)] mb-6">
                Status Timeline
              </h3>

              <div className="space-y-5">
                {grievance.timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`
                        w-8 h-8 rounded-full
                        flex items-center justify-center
                        ${statusStyle(step.completed)}
                      `}
                    >
                      {step.completed ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4
                        className={`font-semibold ${
                          step.completed
                            ? "text-[var(--txt)]"
                            : "text-[var(--txt-dim)]"
                        }`}
                      >
                        {step.status}
                      </h4>
                      <p className="text-sm text-[var(--txt-dim)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!grievance && !loading && (
          <div className="bg-[var(--bg-sec)] rounded-[var(--radius)] p-8 text-center border border-[var(--bg-ter)]">
            <HelpCircle size={48} className="mx-auto mb-4 text-[var(--btn)]" />
            <h3 className="text-xl font-bold text-[var(--txt)] mb-2">
              No grievance to track
            </h3>
            <p className="text-[var(--txt-dim)] mb-6">
              Lodge a grievance to receive a tracking ID
            </p>
            <button
              onClick={() => navigate("/lodge-grievance")}
              className="
                bg-[var(--btn)]
                hover:bg-[var(--btn-hover)]
                text-white px-8 py-3
                rounded-[var(--radius)]
                font-semibold transition-colors
              "
            >
              Lodge New Grievance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackGrievance;
