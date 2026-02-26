import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import api from "../services/api";
import useSocket from "../hooks/useSocket";
import Toast from "../components/Toast";

export default function ContactUs() {
  // ─── Form State ────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ─── Socket: listen for real-time confirmation ─────────────
  useSocket("new_contact", (data) => {
    setToast({ type: "info", message: `New contact received: ${data.name}` });
  });

  // ─── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post("/contact", formData);

      if (data.success) {
        setToast({ type: "success", message: "Your message has been sent successfully!" });
        setFormData({ name: "", email: "", phone: "", message: "" });
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
    <section className="w-full bg-gray-50 py-16 px-6 pt-36 lg:pt-8">
      {/* Toast notification */}
      <Toast data={toast} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto">

        {/* Section Title */}
        <h2 className="text-4xl font-semibold text-gray-900 text-center mb-12">
          Contact Us
        </h2>

        {/* Main Wrapper */}
        <div className="flex flex-col md:flex-row gap-10">

          {/* ---------------- LEFT: FORM ---------------- */}
          <div className="w-full md:w-1/2 bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Please fill this form
            </h3>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="Full Name" required
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              />
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="Email" required
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              />
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="Phone Number" required
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              />
              <textarea
                name="message" value={formData.message}
                onChange={handleChange} placeholder="Your Message" rows="4" required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              ></textarea>
              <button
                type="submit" disabled={loading}
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition w-full disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          {/* ---------------- RIGHT: CONTACT INFO ---------------- */}
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
              <iframe
                title="location-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450929!2d144.95373531531555!3d-37.81627974202119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAwLjYiUyAxNDTCsDU3JzE0LjMiRQ!5e0!3m2!1sen!2sus!4v1611782306915!5m2!1sen!2sus"
                width="100%" height="100%" allowFullScreen="" loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}