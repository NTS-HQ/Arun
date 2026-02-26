import "../styles/index.css";
import { FiExternalLink } from "react-icons/fi";

export default function OurWorks({ works = [] }) {
  // Sample data (only used if no data comes from props)
  const sampleWorks = [
    {
      image: "/works/work1.jpg",
      title: "Urban Aesthetic Shoot",
      subtitle: "Capturing geometry and light",
      link: "https://example.com/work1"
    },
    {
      image: "/works/work2.jpg",
      title: "Wedding Story Film",
      subtitle: "Documenting heartfelt moments",
      link: "https://example.com/work2"
    },
    {
      image: "/works/work3.jpg",
      title: "Travel Documentary",
      subtitle: "Exploring cultures and emotions",
      link: "https://example.com/work3"
    },
    {
      image: "/works/work4.jpg",
      title: "Product Cinematic Reel",
      subtitle: "Visual storytelling in detail",
      link: "https://example.com/work4"
    },
    {
      image: "/works/work5.jpg",
      title: "Nature Wildlife Shoot",
      subtitle: "Raw beauty in the wild",
      link: "https://example.com/work5"
    },
    {
      image: "/works/work6.jpg",
      title: "Fashion Editorial",
      subtitle: "Bold compositions and style",
      link: "https://example.com/work6"
    },
  ];

  // Use sample data if no works passed
  const renderData = works.length > 0 ? works : sampleWorks;

  return (
    <section className="w-full bg-white pt-36 md:py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl text-center font-semibold text-gray-900 mb-14">
          Our Works
        </h2>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {renderData.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer block"
            >
              {/* Background Image */}
              <div
                className="w-full h-80 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                  {item.title}
                </h3>

                <p className="text-gray-200 text-sm mt-2">
                  {item.subtitle}
                </p>

                <div className="mt-4 text-white text-xl">
                  <FiExternalLink />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}