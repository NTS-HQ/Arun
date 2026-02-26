import { useState } from "react";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

export default function JoinOurTeam() {
  // ─── Form State ────────────────────────────────────────────
  const [photoName, setPhotoName] = useState("No file chosen");
  const [photoFile, setPhotoFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "", phone: "", email: "", family_members: "",
    state: "", district: "", block: "", city: "",
    pincode: "", referred_by: "",
  });

  // ─── Socket: listen for real-time confirmation ─────────────
  useSocket("new_applicant", (data) => {
    setToast({ type: "info", message: `New application from ${data.full_name}` });
  });

  // ─── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      if (photoFile) fd.append("photo", photoFile);

      const data = await api.upload("/join", fd);

      if (data.success) {
        setToast({ type: "success", message: "Your registration has been submitted!" });
        setFormData({
          full_name: "", phone: "", email: "", family_members: "",
          state: "", district: "", block: "", city: "",
          pincode: "", referred_by: "",
        });
        setPhotoFile(null);
        setPhotoName("No file chosen");
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
    <section className="w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-24">
      <Toast data={toast} onClose={() => setToast(null)} />

      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/40">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Registration Form</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Enter full name" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Enter email" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">No. of Members in Family</label>
            <input type="number" name="family_members" value={formData.family_members} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Enter number" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="State" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">District</label>
            <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="District" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Block</label>
            <input type="text" name="block" value={formData.block} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Block" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">City / Village Name</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Enter city or village" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Pincode</label>
            <input type="number" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Enter pincode" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Referred By (optional)</label>
            <input type="text" name="referred_by" value={formData.referred_by} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Referral name (optional)" />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Upload Photo</label>
            <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition">
              <span className="font-medium text-gray-700">Choose File</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files.length > 0) { setPhotoName(e.target.files[0].name); setPhotoFile(e.target.files[0]); } }} />
              <span className="text-gray-600 text-sm">{photoName}</span>
            </label>
          </div>
          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" id="agree" className="mt-1" checked={agreed} onChange={() => setAgreed(!agreed)} />
            <label htmlFor="agree" className="text-gray-700 text-sm">I agree to the Terms & Conditions and Rules & Regulations.</label>
          </div>
          <button type="submit" disabled={!agreed || loading}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition ${agreed && !loading ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
            {loading ? "Submitting…" : "Submit Registration"}
          </button>
        </form>
      </div>
    </section>
  );
}