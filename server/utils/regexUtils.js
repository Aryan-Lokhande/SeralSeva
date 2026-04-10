// Utility function to escape regex special characters to prevent ReDoS
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
