import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Eye, EyeOff, Save } from "lucide-react";
import { updateAdminSettings } from "../../utils/api";
import toast from "react-hot-toast";

const Settings = () => {
  const [showBadges, setShowBadges] = useState(() => {
    const saved = localStorage.getItem("showSidebarBadges");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [saving, setSaving] = useState(false);

  const handleToggleBadges = async () => {
    const newValue = !showBadges;
    setShowBadges(newValue);
    localStorage.setItem("showSidebarBadges", JSON.stringify(newValue));
    window.dispatchEvent(new Event("badgeToggleChange"));
    
    try {
      setSaving(true);
      const res = await updateAdminSettings({ showSidebarBadges: newValue });
      if (res.success) {
        toast.success("Settings updated successfully");
        // Force sidebar re-render by triggering storage event
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      toast.error("Failed to save settings");
      // Revert on error
      setShowBadges(!newValue);
      localStorage.setItem("showSidebarBadges", JSON.stringify(!newValue));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--btn)] to-[var(--btn-hover)] rounded-[var(--radius)] flex items-center justify-center shadow-[0_6px_18px_rgba(var(--shadow-rgb),0.4)]">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--txt)] tracking-wide">
              Admin Settings
            </h1>
            <p className="text-[var(--txt-dim)] text-sm font-medium mt-0.5">
              Customize your admin panel preferences
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Card */}
      <div className="max-w-2xl">
        <div className="bg-[var(--bg-sec)] border border-[var(--txt-dim)] rounded-[var(--radius)] p-6 shadow-[0_8px_24px_rgba(var(--shadow-rgb),0.2)]">
          <h3 className="text-lg font-bold text-[var(--txt)] mb-4 tracking-wide">
            Sidebar Settings
          </h3>

          {/* Badge Toggle */}
          <div className="flex items-center justify-between p-4 bg-[var(--bg-ter)] rounded-[var(--radius)] border border-[var(--txt-dim)]/30">
            <div className="flex items-center gap-3">
              {showBadges ? (
                <Eye className="w-5 h-5 text-[var(--btn)]" />
              ) : (
                <EyeOff className="w-5 h-5 text-[var(--txt-dim)]" />
              )}
              <div>
                <p className="text-sm font-medium text-[var(--txt)]">
                  Show Badge Counts
                </p>
                <p className="text-xs text-[var(--txt-dim)] mt-0.5">
                  Display pending counts on sidebar menu items
                </p>
              </div>
            </div>

            <div
              onClick={handleToggleBadges}
              className={`
                relative w-12 h-6 rounded-full transition-colors cursor-pointer
                ${showBadges ? "bg-[var(--btn)]" : "bg-[var(--bg-ter)] border border-[var(--txt-dim)]"}
              `}
            >
              <div
                className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full shadow
                  transition-transform
                  ${showBadges ? "translate-x-7" : "translate-x-1"}
                `}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-[var(--radius)]">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Badge counts show unresolved items (pending
              applications, open grievances, unanswered queries). Use the
              "Refresh Badges" button in the sidebar to manually update counts.
            </p>
          </div>

          {/* Save Indicator */}
          {saving && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--txt-dim)]">
              <Save className="w-4 h-4 animate-pulse" />
              <span>Saving settings...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
