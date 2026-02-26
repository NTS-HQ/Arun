export default function WhatsNext() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20">
      
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-14">
        What's Next
      </h2>

      <div className="flex flex-col lg:flex-row items-stretch gap-12">

        {/* LEFT SIDE — TEXT */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
            A future shaped by compassion  
          </h3>

          <p className="text-gray-600 text-lg leading-relaxed">
            We continue to expand our efforts and reach more communities in need. 
            With your support, we envision a world where no one is left behind.  
            Every small action creates a ripple of change.
          </p>
        </div>

        {/* RIGHT SIDE — CARD */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-900 rounded-3xl p-16 h-full flex flex-col justify-between shadow-sm">
            
            <div>
              <h4 className="text-2xl md:text-3xl font-semibold text-gray-100">
                Your friend needs you
              </h4>

              <p className="text-gray-300 mt-3">
                Watch this short video and see how a small step can make a big impact.
              </p>
            </div>

            {/* LINK PLACEHOLDER */}
            <a
              href="#insta-video-link"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-blue-300 hover:underline text-lg font-medium"
            >
              Watch Instagram Video →
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}