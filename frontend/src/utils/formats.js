// ---------------------
// Truncate Address
// ---------------------
export const truncate = (addr) => {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
};

// ---------------------
// Convert UNIX timestamp → readable date
// ---------------------
export const formatDate = (ts) => {
  if (!ts) return "Unknown";
  const date = new Date(Number(ts) * 1000);
  return date.toLocaleString();
};

// ---------------------
// Format vote label
// ---------------------
export const formatVote = (value) => {
  if (value === 0) return "Against";
  if (value === 1) return "For";
  if (value === 2) return "Abstain";
  return "Unknown";
};

// ---------------------
// Pretty print ciphertext bytes
// ---------------------
export const formatCiphertext = (bytes) => {
  if (!bytes) return "No ciphertext";
  try {
    return JSON.stringify(bytes);
  } catch {
    return String(bytes);
  }
};
