import sample_vdo from "../assets/samplevideo.mp4"
export default function ImpactSection() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20">
      
      {/* Top Badge */}
      <div className="flex justify-center">
        <span className="px-4 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Impactful metrics
        </span>
      </div>

      {/* Title */}
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mt-6">
        Programs that change lives
      </h2>

      {/* Subtitle */}
      <p className="text-center text-gray-600 max-w-2xl mx-auto mt-4">
        Together, we can make a real impact in communities around the world.
      </p>

      {/* Cards Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* CARD 1 */}
        <a
          href={"https://instagram.com/your_video_1"}
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded-3xl overflow-hidden group h-80 flex"
        >
          {/* VIDEO */}
          <video
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={sample_vdo} type="video/mp4" />
          </video>

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* TEXT CONTENT */}
          <div className="relative z-10 p-6 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-4xl font-bold">200k</h3>
              <p className="font-medium mt-1">Meals Distributed</p>
            </div>

            <p className="bg-white/30 text-white backdrop-blur-md px-4 py-2 rounded-full text-sm w-fit mt-4">
              Ensuring food security for families.
            </p>
          </div>
        </a>

        {/* CARD 2 */}
        <a
          href="https://instagram.com/your_video_2"
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded-3xl overflow-hidden group h-80 flex"
        >
          <video
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={sample_vdo} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 p-6 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-4xl font-bold">10000+</h3>
              <p className="font-medium">Individuals Supported</p>
            </div>

            <p className="bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-full text-sm w-fit">
              Providing education and health support.
            </p>
          </div>
        </a>

        {/* CARD 3 */}
        <a
          href="https://instagram.com/your_video_3"
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded-3xl overflow-hidden group h-80 flex"
        >
          <video
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={sample_vdo} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 p-6 text-black flex flex-col justify-between">
            <div>
              <h3 className="text-4xl font-bold text-white">300+</h3>
              <p className="font-medium text-gray-100">Homes Rebuilt</p>
            </div>

            <p className="bg-white/70 backdrop-blur-md text-black px-4 py-2 rounded-full text-sm w-fit">
              Helping families restore lives.
            </p>
          </div>
        </a>
      </div>

      {/* CTA BUTTON */}
      <div className="mt-14 flex justify-center">
        <a
          href="/our-works"
          className="px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          View All Works
        </a>
      </div>
    </section>
  );
}