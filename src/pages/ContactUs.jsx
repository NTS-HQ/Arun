import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperclip } from "react-icons/fa";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useSocket("new_contact", (data) => {
    setToast({ type: "info", message: `New contact received: ${data.name}` });
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: null });
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
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
      if (attachment) fd.append("attachment", attachment);

      const data = await api.upload("/contact", fd);

      if (data.success) {
        setToast({ type: "success", message: "Your message has been sent successfully!" });
        setFormData({ name: "", email: "", phone: "", message: "" });
        setAttachment(null);
        setAttachmentName("");
        setAgreed(false);
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

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-full border focus:ring-2 focus:outline-none transition ${fieldErrors[field] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-gray-700"
    }`;

  return (
    <section className="w-full bg-gray-50 py-16 px-6 pt-36 lg:pt-8">
      <Toast data={toast} onClose={() => setToast(null)} />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-gray-900 text-center mb-12">Contact Us</h2>
        <div className="flex flex-col md:flex-row gap-10">

          {/* FORM */}
          <div className="w-full md:w-1/2 bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Please fill this form</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>

              <div>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Full Name" className={inputCls("name")} />
                {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="Email" className={inputCls("email")} />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="Phone Number" className={inputCls("phone")} />
                {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
              </div>

              <div>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="Your Message" rows="4"
                  className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:outline-none transition ${fieldErrors.message ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-gray-700"
                    }`} />
                {fieldErrors.message && <p className="text-red-500 text-xs mt-1">{fieldErrors.message}</p>}
              </div>

              {/* Optional attachment */}
              <div>
                <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 transition">
                  <FaPaperclip className="text-gray-500" />
                  <span className="text-gray-700 text-sm font-medium">Attach File (optional)</span>
                  <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFile} />
                  {attachmentName && <span className="text-xs text-gray-500 truncate max-w-[140px]">{attachmentName}</span>}
                </label>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" checked={agreed} onChange={() => setAgreed(!agreed)} className="mt-1" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the <strong>Terms &amp; Conditions</strong> and <strong>Privacy Policy</strong>.
                </label>
              </div>
              {fieldErrors.terms_accepted && <p className="text-red-500 text-xs">{fieldErrors.terms_accepted}</p>}

              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition w-full disabled:opacity-60">
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div className="w-full md:w-1/2 bg-white shadow-xl rounded-2xl p-8 border border-gray-200 flex flex-col gap-6">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900">Let's Get in Touch</h3>
              <p className="text-lg text-gray-700 mt-1">How can we help you?</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-200 text-gray-700 text-xl"><FaPhoneAlt /></div>
              <p className="text-gray-800 text-lg">+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-200 text-gray-700 text-xl"><FaEnvelope /></div>
              <p className="text-gray-800 text-lg">info@example.com</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gray-200 text-gray-700 text-xl"><FaMapMarkerAlt /></div>
              <p className="text-gray-800 text-lg leading-relaxed">
                123 Example Street, Near Sample Landmark, City, State, Country 123456
              </p>
            </div>
            <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-300">
              <iframe title="location-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450929!2d144.95373531531555!3d-37.81627974202119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAwLjYiUyAxNDTCsDU3JzE0LjMiRQ!5e0!3m2!1sen!2sus!4v1611782306915!5m2!1sen!2sus"
                width="100%" height="100%" allowFullScreen="" loading="lazy" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}