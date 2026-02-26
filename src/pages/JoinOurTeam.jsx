import { useState, useCallback, useRef } from "react";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

// ─── Field component defined OUTSIDE the parent component ───
// CRITICAL: defining this inside JoinOurTeam() causes React to
// recreate a new component type on every render, which unmounts
// and remounts the input, losing focus and cursor position.
function Field({ label, name, type = "text", placeholder, value, onChange, error }) {
  const inputCls = `w-full px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none transition ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
    }`;
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputCls}
        autoComplete="off"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const INITIAL_FORM = {
  full_name: "", phone: "", email: "", family_members: "",
  state: "", district: "", block: "", city: "", pincode: "", referred_by: "",
};

export default function JoinOurTeam() {
  const [photoName, setPhotoName] = useState("No file chosen");
  const [photoFile, setPhotoFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM);

  useSocket("new_applicant", useCallback((data) => {
    setToast({ type: "info", message: `New application from ${data.full_name}` });
  }, []));

  // ─── Single onChange handler — stable reference ─────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
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
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("terms_accepted", "true");
      if (photoFile) fd.append("photo", photoFile);

      const data = await api.upload("/join", fd);

      if (data.success) {
        setToast({ type: "success", message: "Your registration has been submitted!" });
        setFormData(INITIAL_FORM);
        setPhotoFile(null);
        setPhotoName("No file chosen");
        setAgreed(false);
      } else {
        if (data.errors) {
          const errs = {};
          data.errors.forEach((err) => { errs[err.field] = err.message; });
          setFieldErrors(errs);
        }
        setToast({ type: "error", message: data.message || "Something went wrong." });
      }
    } catch {
      setToast({ type: "error", message: "Server unreachable. Please try again later." });
    } finally {
      setLoading(false);
    }
  }, [agreed, formData, photoFile]);

  return (
    <section className="w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-24">
      <Toast data={toast} onClose={() => setToast(null)} />

      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/40">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Registration Form</h2>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Field label="Full Name *" name="full_name" placeholder="Enter full name"
            value={formData.full_name} onChange={handleChange} error={fieldErrors.full_name} />
          <Field label="Phone Number *" name="phone" type="tel" placeholder="Enter phone number"
            value={formData.phone} onChange={handleChange} error={fieldErrors.phone} />
          <Field label="Email *" name="email" type="email" placeholder="Enter email"
            value={formData.email} onChange={handleChange} error={fieldErrors.email} />
          <Field label="No. of Members in Family" name="family_members" type="number" placeholder="Enter number"
            value={formData.family_members} onChange={handleChange} error={fieldErrors.family_members} />
          <Field label="State" name="state" placeholder="State"
            value={formData.state} onChange={handleChange} error={fieldErrors.state} />
          <Field label="District" name="district" placeholder="District"
            value={formData.district} onChange={handleChange} error={fieldErrors.district} />
          <Field label="Block" name="block" placeholder="Block"
            value={formData.block} onChange={handleChange} error={fieldErrors.block} />
          <Field label="City / Village Name" name="city" placeholder="Enter city or village"
            value={formData.city} onChange={handleChange} error={fieldErrors.city} />
          <Field label="Pincode" name="pincode" type="number" placeholder="Enter pincode"
            value={formData.pincode} onChange={handleChange} error={fieldErrors.pincode} />
          <Field label="Referred By (optional)" name="referred_by" placeholder="Referral name (optional)"
            value={formData.referred_by} onChange={handleChange} error={fieldErrors.referred_by} />

          {/* PHOTO UPLOAD */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Upload Photo</label>
            <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition">
              <span className="font-medium text-gray-700">Choose File</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setPhotoName(e.target.files[0].name);
                    setPhotoFile(e.target.files[0]);
                  }
                }}
              />
              <span className="text-gray-600 text-sm truncate max-w-[160px]">{photoName}</span>
            </label>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-3 mt-4">
            <input
              type="checkbox"
              id="agree"
              className="mt-1"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree" className="text-gray-700 text-sm cursor-pointer">
              I agree to the <strong>Terms &amp; Conditions</strong> and <strong>Rules &amp; Regulations</strong>.
            </label>
          </div>
          {fieldErrors.terms_accepted && (
            <p className="text-red-500 text-xs">{fieldErrors.terms_accepted}</p>
          )}

          <button
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition ${agreed && !loading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {loading ? "Submitting…" : "Submit Registration"}
          </button>
        </form>
      </div>
    </section>
  );
}