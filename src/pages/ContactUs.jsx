import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactUs() {
  return (
    <section className="w-full bg-gray-50 py-16 px-6 pt-36 lg:pt-8">
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

            <form className="space-y-5">

              {/* Full Name */}
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              />

              {/* Phone */}
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              />

              {/* Comment */}
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none"
              ></textarea>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition w-full"
              >
                Send Message
              </button>
            </form>

          </div>

          {/* ---------------- RIGHT: CONTACT INFO ---------------- */}
          <div className="w-full md:w-1/2 bg-white shadow-xl rounded-2xl p-8 border border-gray-200 flex flex-col gap-6">

            {/* Titles */}
            <div>
              <h3 className="text-3xl font-semibold text-gray-900">
                Let’s Get in Touch
              </h3>
              <p className="text-lg text-gray-700 mt-1">
                How can we help you?
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-200 text-gray-700 text-xl">
                <FaPhoneAlt />
              </div>
              <p className="text-gray-800 text-lg">+91 98765 43210</p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-200 text-gray-700 text-xl">
                <FaEnvelope />
              </div>
              <p className="text-gray-800 text-lg">info@example.com</p>
            </div>

            {/* Address Text */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gray-200 text-gray-700 text-xl">
                <FaMapMarkerAlt />
              </div>
              <p className="text-gray-800 text-lg leading-relaxed">
                123 Example Street,  
                Near Sample Landmark,  
                City, State, Country 123456
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-300">
              <iframe
                title="location-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450929!2d144.95373531531555!3d-37.81627974202119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAwLjYiUyAxNDTCsDU3JzE0LjMiRQ!5e0!3m2!1sen!2sus!4v1611782306915!5m2!1sen!2sus"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}