import { useState } from "react";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

export default function JoinOurTeam() {
  const [photoName, setPhotoName] = useState("No file chosen");
  const [photoFile, setPhotoFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "", phone: "", email: "", family_members: "",
    state: "", district: "", block: "", city: "", pincode: "", referred_by: "",
  });

  useSocket("new_applicant", (data) => {
    setToast({ type: "info", message: `New application from ${data.full_name}` });
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: null });
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
      if (photoFile) fd.append("photo", photoFile);

      const data = await api.upload("/join", fd);

      if (data.success) {
        setToast({ type: "success", message: "Your registration has been submitted!" });
        setFormData({ full_name: "", phone: "", email: "", family_members: "", state: "", district: "", block: "", city: "", pincode: "", referred_by: "" });
        setPhotoFile(null); setPhotoName("No file chosen"); setAgreed(false);
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

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} className={inp(name)} />
      {fieldErrors[name] && <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <section className="w-full flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-24">
      <Toast data={toast} onClose={() => setToast(null)} />

      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/40">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Registration Form</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Full Name *" name="full_name" placeholder="Enter full name" />
          <Field label="Phone Number *" name="phone" type="tel" placeholder="Enter phone number" />
          <Field label="Email *" name="email" type="email" placeholder="Enter email" />
          <Field label="No. of Members in Family" name="family_members" type="number" placeholder="Enter number" />
          <Field label="State" name="state" placeholder="State" />
          <Field label="District" name="district" placeholder="District" />
          <Field label="Block" name="block" placeholder="Block" />
          <Field label="City / Village Name" name="city" placeholder="Enter city or village" />
          <Field label="Pincode" name="pincode" type="number" placeholder="Enter pincode" />
          <Field label="Referred By (optional)" name="referred_by" placeholder="Referral name (optional)" />

          {/* PHOTO UPLOAD */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Upload Photo</label>
            <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition">
              <span className="font-medium text-gray-700">Choose File</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                if (e.target.files.length > 0) { setPhotoName(e.target.files[0].name); setPhotoFile(e.target.files[0]); }
              }} />
              <span className="text-gray-600 text-sm truncate max-w-[160px]">{photoName}</span>
            </label>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" id="agree" className="mt-1" checked={agreed} onChange={() => setAgreed(!agreed)} />
            <label htmlFor="agree" className="text-gray-700 text-sm">
              I agree to the <strong>Terms &amp; Conditions</strong> and <strong>Rules &amp; Regulations</strong>.
            </label>
          </div>
          {fieldErrors.terms_accepted && <p className="text-red-500 text-xs">{fieldErrors.terms_accepted}</p>}

          <button type="submit" disabled={!agreed || loading}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition ${agreed && !loading ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}>
            {loading ? "Submitting…" : "Submit Registration"}
          </button>
        </form>
      </div>
    </section>
  );
}