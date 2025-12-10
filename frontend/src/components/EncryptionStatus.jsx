export default function EncryptionStatus({ status }) {
  if (status === "idle") return null;

  if (status === "encrypting") {
    return (
      <div className="flex items-center gap-2 text-yellow-400 mt-3">
        <div className="animate-spin h-4 w-4 border-2 border-yellow-400 rounded-full border-t-transparent" />
        Encrypting vote…
      </div>
    );
  }

  if (status === "encrypted") {
    return (
      <div className="text-green-400 mt-3">
        ✔ Vote encrypted successfully!
      </div>
    );
  }

  return null;
}
