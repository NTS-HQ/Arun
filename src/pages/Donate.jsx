import { useState } from "react";
import { FaPaperclip } from "react-icons/fa";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

export default function Donate() {
  const [formData, setFormData] = useState({ full_name: "", mobile: "", email: "", amount: "" });
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const quickAmounts = [500, 1000, 2000];

  useSocket("new_donation", (data) => {
    setToast({ type: "info", message: `Donation of ₹${data.amount} received!` });
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: null });
  };

  const handleFile = (e) => {
    if (e.target.files[0]) { setAttachment(e.target.files[0]); setAttachmentName(e.target.files[0].name); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setToast({ type: "error", message: "Please accept the Terms & Conditions." }); return; }
    setLoading(true);
    setFieldErrors({});

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("terms_accepted", "true");
      if (attachment) fd.append("attachment", attachment);

      const data = await api.upload("/donate", fd);

      if (data.success) {
        setToast({ type: "success", message: "Thank you for your donation!" });
        setFormData({ full_name: "", mobile: "", email: "", amount: "" });
        setAgreed(false); setAttachment(null); setAttachmentName("");
      } else {
        if (data.errors) {
          const errs = {};
          data.errors.forEach((e) => { errs[e.field] = e.message; });
          setFieldErrors(errs);
        }
        setToast({ type: "error", message: data.message || "Something went wrong." });
      }
    } catch {
      setToast({ type: "error", message: "Server unreachable. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) =>
    `w-full px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none transition ${fieldErrors[field] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <section className="w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12 pt-36 md:py-36">
      <Toast data={toast} onClose={() => setToast(null)} />

      <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/40">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Donation</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Your full name" className={inp("full_name")} />
            {fieldErrors.full_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.full_name}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Mobile Number *</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Your mobile number" className={inp("mobile")} />
            {fieldErrors.mobile && <p className="text-red-500 text-xs mt-1">{fieldErrors.mobile}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email ID *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email address" className={inp("email")} />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Donation Amount *</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter amount" className={inp("amount")} />
            {fieldErrors.amount && <p className="text-red-500 text-xs mt-1">{fieldErrors.amount}</p>}
            <div className="flex gap-3 mt-3">
              {quickAmounts.map((amt) => (
                <button type="button" key={amt}
                  onClick={() => setFormData({ ...formData, amount: String(amt) })}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition font-medium">
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* RECEIPT UPLOAD */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Attach Receipt / Screenshot (optional)</label>
            <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition">
              <FaPaperclip className="text-gray-500" />
              <span className="text-gray-700 text-sm font-medium">Choose File</span>
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
              {attachmentName && <span className="text-xs text-gray-500 truncate max-w-[140px]">{attachmentName}</span>}
            </label>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" id="agree" className="mt-1" checked={agreed} onChange={() => setAgreed(!agreed)} />
            <label htmlFor="agree" className="text-gray-700 text-sm">
              I confirm that the above details are correct and I agree to proceed with the donation.
            </label>
          </div>
          {fieldErrors.terms_accepted && <p className="text-red-500 text-xs">{fieldErrors.terms_accepted}</p>}

          <button type="submit" disabled={!agreed || loading}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition ${agreed && !loading ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}>
            {loading ? "Processing…" : "Donate"}
          </button>
        </form>
      </div>
    </section>
  );
}