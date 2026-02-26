import { useState } from "react";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

export default function Donate() {
  // ─── Form State ────────────────────────────────────────────
  const [formData, setFormData] = useState({
    full_name: "", mobile: "", email: "", amount: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const quickAmounts = [500, 1000, 2000];

  // ─── Socket: listen for real-time confirmation ─────────────
  useSocket("new_donation", (data) => {
    setToast({ type: "info", message: `Donation of ₹${data.amount} received!` });
  });

  // ─── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post("/donate", formData);

      if (data.success) {
        setToast({ type: "success", message: "Thank you for your donation!" });
        setFormData({ full_name: "", mobile: "", email: "", amount: "" });
        setAgreed(false);
      } else {
        setToast({ type: "error", message: data.message || "Something went wrong." });
      }
    } catch {
      setToast({ type: "error", message: "Server unreachable. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12 pt-36 md:py-36">
      <Toast data={toast} onClose={() => setToast(null)} />

      <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/40">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Donation</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Your full name" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Mobile Number</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Your mobile number" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email ID</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Your email address" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Donation Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Enter amount" />
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
          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" id="agree" className="mt-1" checked={agreed} onChange={() => setAgreed(!agreed)} />
            <label htmlFor="agree" className="text-gray-700 text-sm">I confirm that the above details are correct and I agree to proceed with the donation.</label>
          </div>
          <button type="submit" disabled={!agreed || loading}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition ${agreed && !loading ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
            {loading ? "Processing…" : "Donate"}
          </button>
        </form>
      </div>
    </section>
  );
}