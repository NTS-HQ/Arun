export default function ImpactSectionPhoto() {
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
        Help us bring hope and support.
      </p>

      {/* Cards Container */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* CARD 1 */}
        <div className="bg-[#ff7f2a] bg-[url()] rounded-3xl p-8 flex flex-col justify-between relative">
          <div>
            <h3 className="text-5xl font-semibold text-white">200k</h3>
            <p className="mt-2 font-medium text-white">Meals Distributed</p>

            <p className="mt-6  bg-white/80 backdrop-blur-md text-gray-800 p-2 rounded-md text-sm font-medium w-fit z-50">
              Ensuring food security for vulnerable families and individuals.
            </p>
          </div>

          <div className="flex justify-end items-end mt-10">
            {/* <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black text-xl">
              →
            </button> */}

            <img
              src="https://framerusercontent.com/images/GufycZUAYfZyHkpnv1M0kXT5c.png?width=339&height=480"
              alt="child"
              className="w-32 z-1 h-auto object-cover rounded-xl "
            />
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-black rounded-3xl p-8 flex flex-col justify-between text-white relative">
          <div>
            <h3 className="text-5xl font-semibold">10000+</h3>
            <p className="mt-2 font-medium text-gray-300">Individuals Supported</p>

            <p className="mt-6 bg-white/20 backdrop-blur-xl text-white p-2 rounded-md text-sm font-medium w-fit">
              Providing resources and aid to those in need. Addressing education and health.
            </p>
          </div>

          <div className="flex justify-end mt-10">
            <img
              src="https://framerusercontent.com/images/rrF0ZMgf5WdsgiDgfNDyKcM.png?width=808&height=538"
              alt="group"
              className="w-52 h-auto object-cover rounded-xl"
            />
          </div>
        </div>

        {/* CARD 3 */}
        <div className="bg-[#F7E287] rounded-3xl p-8 flex flex-col justify-between relative">
          <div>
            <h3 className="text-5xl font-semibold text-black">300+</h3>
            <p className="mt-2 font-medium text-gray-800">Homes rebuilt successfully</p>

            <p className="mt-6 bg-white/80 backdrop-blur-md text-gray-800 p-2 rounded-md text-sm font-medium w-fit">
              Giving communities access to safe homes and future. Helping families restore lives.
            </p>
          </div>

          <div className="flex justify-end mt-10">
            <img
              src="https://framerusercontent.com/images/3CMcl0tiDC4MBT0srxF6tYiGyI.png?scale-down-to=512&width=718&height=574"
              alt="house"
              className="w-52 h-auto object-cover rounded-xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}