import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const TrackGrievance = () => {
  const location = useLocation();
  const [trackingId, setTrackingId] = useState(
    location.state?.trackingId || "",
  );
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const grievances = JSON.parse(localStorage.getItem("grievances") || "[]");
      const found = grievances.find((g) => g.id === trackingId);

      if (found) {
        // Mock timeline data
        const timeline = [
          {
            status: "Submitted",
            date: found.submittedDate,
            description:
              "Your grievance has been successfully submitted and registered in our system.",
            completed: true,
          },
          {
            status: "Under Review",
            date: new Date(Date.now() + 86400000).toISOString(),
            description:
              "Your grievance is being reviewed by the concerned department.",
            completed: true,
          },
          {
            status: "In Progress",
            date: new Date(Date.now() + 172800000).toISOString(),
            description: "Action is being taken to resolve your grievance.",
            completed: false,
          },
          {
            status: "Resolved",
            date: null,
            description:
              "Your grievance will be marked as resolved once the issue is addressed.",
            completed: false,
          },
        ];

        setGrievance({ ...found, timeline });
        toast.success("Grievance found!");
      } else {
        setGrievance(null);
        toast.error("No grievance found with this tracking ID");
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-500";
      case "Under Review":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-purple-500";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-custom shadow-custom-lg mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Track Your Grievance
          </h1>
          <p className="text-gray-100">
            Enter your tracking ID to check the status of your grievance
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-bg-sec rounded-custom shadow-custom-lg p-8 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-txt font-medium mb-2">
                Tracking ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-bg-ter text-txt rounded-custom border border-bg-ter focus:border-btn focus:outline-none transition-colors duration-200"
                placeholder="Enter your tracking ID (e.g., GRV12345678)"
                required
              />
              <p className="text-txt-dim text-sm mt-2">
                The tracking ID was sent to your email when you submitted the
                grievance
              </p>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 rounded-custom font-semibold transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track Grievance"}
            </motion.button>
          </form>
        </motion.div>

        {/* Grievance Details */}
        {grievance && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-bg-sec rounded-custom shadow-custom-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-txt">
                    Grievance Details
                  </h2>
                  <p className="text-txt-dim">ID: {grievance.id}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(grievance.status)}`}
                >
                  {grievance.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-txt-dim text-sm">Category</p>
                  <p className="text-txt font-medium">{grievance.category}</p>
                </div>
                <div>
                  <p className="text-txt-dim text-sm">Type</p>
                  <p className="text-txt font-medium">
                    {grievance.grievanceType}
                  </p>
                </div>
                <div>
                  <p className="text-txt-dim text-sm">Submitted On</p>
                  <p className="text-txt font-medium">
                    {new Date(grievance.submittedDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-txt-dim text-sm">Last Updated</p>
                  <p className="text-txt font-medium">
                    {new Date(grievance.lastUpdate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-txt-dim text-sm mb-2">Subject</p>
                  <p className="text-txt font-medium">{grievance.subject}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-txt-dim text-sm mb-2">Description</p>
                  <p className="text-txt">{grievance.description}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-bg-sec rounded-custom shadow-custom-lg p-6">
              <h3 className="text-xl font-bold text-txt mb-6">
                Status Timeline
              </h3>

              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-bg-ter"></div>

                {/* Timeline Items */}
                <div className="space-y-6">
                  {grievance.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative flex items-start space-x-4"
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                          item.completed
                            ? getStatusColor(item.status)
                            : "bg-bg-ter"
                        }`}
                      >
                        {item.completed ? (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-txt-dim rounded-full"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-bg-ter p-4 rounded-custom">
                          <div className="flex items-center justify-between mb-2">
                            <h4
                              className={`font-semibold ${item.completed ? "text-txt" : "text-txt-dim"}`}
                            >
                              {item.status}
                            </h4>
                            {item.date && (
                              <span className="text-txt-dim text-sm">
                                {new Date(item.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-txt-dim text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-btn/10 border border-btn rounded-custom p-6">
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
                  <h4 className="text-txt font-semibold mb-2">Need Help?</h4>
                  <p className="text-txt-dim text-sm mb-3">
                    If you have any questions or concerns about your grievance,
                    feel free to contact us.
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-txt">
                      <span className="font-medium">Email:</span>{" "}
                      grievance@saralseva.gov.in
                    </p>
                    <p className="text-txt">
                      <span className="font-medium">Helpline:</span>{" "}
                      1800-XXX-XXXX (Toll Free)
                    </p>
                    <p className="text-txt">
                      <span className="font-medium">Timings:</span> 9 AM - 6 PM
                      (Mon-Fri)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Section (shown when no grievance) */}
        {!grievance && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-bg-sec rounded-custom shadow-custom-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-txt mb-2">
              Haven't submitted a grievance yet?
            </h3>
            <p className="text-txt-dim mb-6">
              You can lodge a new grievance and receive a tracking ID instantly
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/lodge-grievance")}
              className="bg-btn hover:bg-btn-hover text-white px-8 py-3 rounded-custom font-semibold transition-colors duration-200"
            >
              Lodge New Grievance
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackGrievance;
