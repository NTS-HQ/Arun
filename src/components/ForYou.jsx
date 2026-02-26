import samplevdo from "../assets/samplevideo.mp4"
export default function ForYouFromYou() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20">
      
      {/* Section Title */}
      <h2 className="text-center text-4xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-14">
        For you / From you
      </h2>

      {/* Wrapper */}
      <div className="flex flex-col lg:flex-row gap-12 items-center">

        {/* LEFT — VIDEO */}
        <div className="w-full lg:w-1/2">
          <div className="rounded-2xl overflow-hidden shadow-md">
            <video
              className="w-full h-[70vh] object-cover"
              controls
            >
              <source src={samplevdo} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* RIGHT — CAPSULE LINKS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">

          <a
            href="/about-us"
            className="w-full px-6 py-4 bg-gray-100 rounded-full text-gray-800 font-medium text-center hover:bg-gray-200 transition"
          >
            About Us
          </a>

          <a
            href="/contact-us"
            className="w-full px-6 py-4 bg-gray-100 rounded-full text-gray-800 font-medium text-center hover:bg-gray-200 transition"
          >
            Contact No
          </a>

          <a
            href="/help-required"
            className="w-full px-6 py-4 bg-gray-100 rounded-full text-gray-800 font-medium text-center hover:bg-gray-200 transition"
          >
            Help Required
          </a>

          <a
            href="/join-our-team"
            className="w-full px-6 py-4 bg-gray-100 rounded-full text-gray-800 font-medium text-center hover:bg-gray-200 transition"
          >
            Join Our Team
          </a>

          <a
            href="/donate"
            className="w-full px-6 py-4 bg-black rounded-full text-white font-medium text-center hover:bg-gray-800 transition"
          >
            Donate
          </a>

        </div>

      </div>
    </section>
  );
}