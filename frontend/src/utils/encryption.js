// src/utils/encryption.js
//import { Buffer } from "node:buffer";

// src/utils/encryption.js
export async function encryptVote(voteValue) {
  const text = `vote:${voteValue}`;

  // Convert string to UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);

  // Convert bytes to hex
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return "0x" + hex;
}
