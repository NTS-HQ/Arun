import { useState, useCallback } from "react";
import { FaPhone, FaHome, FaPaperclip } from "react-icons/fa";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

const INITIAL_FORM = {
  full_name: "", dob: "", gender: "", phone: "", email: "",
  emergency: "", help_types: [], zip_code: "", address: "",
  state: "", district: "",
};

export default function HelpRequired() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");

  useSocket("new_help_request", useCallback((data) => {
    setToast({ type: "info", message: `Help request received for ${data.full_name}` });
  }, []));

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  // Radio inputs use handleChange directly since they're the same pattern

  const handleCheckbox = useCallback((value) => {
    setFormData((prev) => {
      const types = prev.help_types.includes(value)
        ? prev.help_types.filter((t) => t !== value)
        : [...prev.help_types, value];
      return { ...prev, help_types: types };
    });
  }, []);

  const handleFile = useCallback((e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
      setAttachmentName(e.target.files[0].name);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!agreed) {
      setToast({ type: "error", message: "Please accept the Terms & Conditions." });
      return;
    }
    setLoading(true);
    setFieldErrors({});

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        fd.append(k, k === "help_types" ? v.join(", ") : v);
      });
      fd.append("terms_accepted", "true");
      if (attachment) fd.append("attachment", attachment);

      const res = await api.upload("/forms/help", fd);

      if (res.success) {
        setToast({ type: "success", message: "Your help request has been submitted!" });
        setFormData(INITIAL_FORM);
        setAgreed(false);
        setAttachment(null);
        setAttachmentName("");
      } else {
        if (res.errors) {
          const errs = {};
          res.errors.forEach((err) => { errs[err.field] = err.message; });
          setFieldErrors(errs);
        }
        setToast({ type: "error", message: res.message || "Something went wrong." });
      }
    } catch (err) {
      setToast({ type: "error", message: "Server unreachable. Please try again later." });
    } finally {
      setLoading(false);
    }
  }, [agreed, attachment, formData]);

  const inp = (field) =>
    `w-full px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none transition ${fieldErrors[field] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-yellow-500"
    }`;

  return (
    <section className="w-full bg-gray-100 py-10 px-4 pt-24 flex justify-center">
      <Toast data={toast} onClose={() => setToast(null)} />

      <form
        className="max-w-3xl w-full bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/40 space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Help Request Form</h2>

        {/* NAME + DOB */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name *</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
              placeholder="Enter your full name" className={inp("full_name")} autoComplete="name" />
            {fieldErrors.full_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.full_name}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inp("dob")} />
          </div>
        </div>

        {/* GENDER */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Gender</label>
          <div className="flex items-center gap-6">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value={g}
                  checked={formData.gender === g} onChange={handleChange} />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* PHONE + EMAIL */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone Number *</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Enter your phone number"
                className={`${inp("phone")} pl-10`} autoComplete="tel" />
            </div>
            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Enter your email address" className={inp("email")} autoComplete="email" />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
        </div>

        {/* EMERGENCY */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Is there any emergency?</label>
          <div className="flex items-center gap-6">
            {["Yes", "No", "Decline to answer"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="emergency" value={opt}
                  checked={formData.emergency === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* HELP TYPE */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">What kind of help do you need?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3">
            {["Social", "Medical", "Educational", "Livelihood", "Legal", "Decline to answer"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={formData.help_types.includes(opt)}
                  onChange={() => handleCheckbox(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* ZIP + ADDRESS */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Zip Code</label>
            <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange}
              placeholder="Enter zip code" className={inp("zip_code")} />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Address</label>
            <div className="relative">
              <FaHome className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input type="text" name="address" value={formData.address} onChange={handleChange}
                placeholder="Enter your address" className={`${inp("address")} pl-10`} />
            </div>
          </div>
        </div>

        {/* STATE + DISTRICT */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange}
              placeholder="Enter state" className={inp("state")} />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">District</label>
            <input type="text" name="district" value={formData.district} onChange={handleChange}
              placeholder="Enter district" className={inp("district")} />
          </div>
        </div>

        {/* ATTACHMENT */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Supporting Document (optional)</label>
          <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition">
            <FaPaperclip className="text-gray-500" />
            <span className="text-gray-700 text-sm font-medium">Attach File</span>
            <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFile} />
            {attachmentName && (
              <span className="text-xs text-gray-500 truncate max-w-[140px]">{attachmentName}</span>
            )}
          </label>
        </div>

        {/* TERMS */}
        <div className="flex items-start gap-3 mt-4">
          <input type="checkbox" id="rules" checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
          <label htmlFor="rules" className="text-gray-700 text-sm cursor-pointer">
            I agree to the <strong>Terms &amp; Conditions</strong> and <strong>Rules &amp; Regulations</strong>.
          </label>
        </div>
        {fieldErrors.terms_accepted && (
          <p className="text-red-500 text-xs">{fieldErrors.terms_accepted}</p>
        )}

        <button
          type="submit" disabled={!agreed || loading}
          className={`w-full py-3 rounded-xl text-lg font-semibold transition ${agreed && !loading
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {loading ? "Submitting…" : "SUBMIT"}
        </button>
      </form>
    </section>
  );
}