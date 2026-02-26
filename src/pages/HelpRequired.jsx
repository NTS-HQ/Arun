import { useState } from "react";
import { FaPhone, FaHome } from "react-icons/fa";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

export default function HelpRequired() {
  // ─── Form State ────────────────────────────────────────────
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "", dob: "", gender: "", phone: "", email: "",
    emergency: "", help_types: [], zip_code: "", address: "",
    state: "", district: "",
  });

  // ─── Socket: listen for real-time confirmation ─────────────
  useSocket("new_help_request", (data) => {
    setToast({ type: "info", message: `Help request received for ${data.full_name}` });
  });

  // ─── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRadio = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckbox = (value) => {
    setFormData((prev) => {
      const types = prev.help_types.includes(value)
        ? prev.help_types.filter((t) => t !== value)
        : [...prev.help_types, value];
      return { ...prev, help_types: types };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, help_types: formData.help_types.join(", ") };
      const data = await api.post("/help", payload);

      if (data.success) {
        setToast({ type: "success", message: "Your help request has been submitted!" });
        setFormData({
          full_name: "", dob: "", gender: "", phone: "", email: "",
          emergency: "", help_types: [], zip_code: "", address: "",
          state: "", district: "",
        });
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
    <section className="w-full bg-gray-100 py-10 px-4 pt-24 flex justify-center">
      <Toast data={toast} onClose={() => setToast(null)} />

      <form className="max-w-3xl w-full bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/40 space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Help Request Form</h2>

        {/* FULLNAME + DOB */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name *</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Date of Birth *</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
          </div>
        </div>

        {/* GENDER */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Gender *</label>
          <div className="flex items-center gap-6">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleRadio} /> {g}
              </label>
            ))}
          </div>
        </div>

        {/* PHONE + EMAIL */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone Number *</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required className="w-full pl-10 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
          </div>
        </div>

        {/* EMERGENCY */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Is there any emergency? *</label>
          <div className="flex items-center gap-6">
            {["Yes", "No", "Decline to answer"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="emergency" value={opt} checked={formData.emergency === opt} onChange={handleRadio} /> {opt}
              </label>
            ))}
          </div>
        </div>

        {/* HELP TYPE */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">What kind of help do you need?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3">
            {["Social", "Medical", "Educational", "Livelihood", "Legal", "Decline to answer"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="checkbox" checked={formData.help_types.includes(opt)} onChange={() => handleCheckbox(opt)} /> {opt}
              </label>
            ))}
          </div>
        </div>

        {/* ZIP + ADDRESS */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Zip Code *</label>
            <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder="Enter zip code" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Address *</label>
            <div className="relative">
              <FaHome className="absolute left-3 top-3 text-gray-400" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" className="w-full pl-10 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
            </div>
          </div>
        </div>

        {/* STATE + DISTRICT */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">State *</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">District *</label>
            <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Enter district" className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-500" />
          </div>
        </div>

        {/* RULES & REGS */}
        <div className="flex items-start gap-3 mt-4">
          <input type="checkbox" id="rules" checked={agreed} onChange={() => setAgreed(!agreed)} className="mt-1" />
          <label htmlFor="rules" className="text-gray-700 text-sm">
            I agree to the <strong>Terms & Conditions</strong> and <strong>Rules & Regulations</strong>.
          </label>
        </div>

        <button type="submit" disabled={!agreed || loading}
          className={`w-full py-3 rounded-xl text-lg font-semibold transition ${agreed && !loading ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
          {loading ? "Submitting…" : "SUBMIT"}
        </button>
      </form>
    </section>
  );
}