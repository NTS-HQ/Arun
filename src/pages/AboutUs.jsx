import "../styles/index.css"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import heroimg from "../assets/sample_hero_banner.jpg"
import samplefounder from "../assets/sample_founder.jpg"
import ImpactSection from "../components/ImpactSection"
import { useContent } from "../hooks/useContent";


export default function AboutUs() {
  const { content, loading } = useContent('about');
  const founderContent = content.founder || {};
  const bannerContent = content.banner || {};

  return (
    <section className="w-full bg-white text-gray-800">
      {/* Hero Image */}
      <div className="w-full h-[80vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <img
          src={heroimg}
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Founder Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-8 space-y-12">
        <h2 className="text-5xl md:text-5xl text-center font-semibold tracking-wide text-gray-900">
          Founder
        </h2>

        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Section */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h3 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              {founderContent.title?.value || 'Slogan Text from Admin'}
            </h3>

            <p className="text-lg md:text-xl leading-relaxed text-gray-600 max-w-xl">
              {founderContent.bio?.value || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin, nisl eget egestas gravida, lacus leo ornare enim, sed gravida lectus libero eu augue. Vivamus volutpat justo nec ullamcorper tempor.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-between w-[60%] mx-auto md:max-w-48 gap-6 text-2xl text-gray-600">
              <a href="#" className="hover:text-gray-900 transition"><FaFacebook /></a>
              <a href="#" className="hover:text-gray-900 transition"><FaTwitter /></a>
              <a href="#" className="hover:text-gray-900 transition"><FaInstagram /></a>
              <a href="#" className="hover:text-gray-900 transition"><FaLinkedin /></a>
            </div>
          </div>

          {/* Right Section (Image) */}
          <div className="flex-1 w-full flex justify-center">
            <img
              src={samplefounder}
              alt="Founder"
              className="w-80 md:w-[380px] lg:w-[420px] h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
      {/* Banner Box — data will come from admin */}
      <div className="w-full bg-gray-100 py-16 px-6 md:px-12 rounded-3xl max-w-5xl mx-auto mt-20">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {bannerContent.heading?.value || 'Inspiring Vision for the Future'}
        </h3>

        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl">
          {bannerContent.description?.value || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum libero sed sapien dignissim, sit amet laoreet orci egestas. Curabitur faucibus, lorem nec placerat feugiat, justo odio interdum lectus, sit amet accumsan lorem odio ac erat.'}
        </p>
      </div>
      <ImpactSection />
    </section>
  );
}
