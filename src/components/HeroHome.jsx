import "../styles/index.css"
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaVideo } from "react-icons/fa";
import { useContent } from "../hooks/useContent";
import { useState } from "react";

export function HeroHome() {
    const { content, loading, refreshContent } = useContent('home');
    const heroContent = content.hero || {};

    return (
        <section className="w-full px-2 md:px-6 lg:px-4 py-4 pt-28 lg:pt-4">
            {/* Refresh Button */}
            <button 
                onClick={refreshContent}
                className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 text-sm"
                title="Click to refresh content"
            >
                ↻ Refresh
            </button>

            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

                {/* LEFT SECTION */}
                <div className="w-full lg:w-1/2 space-y-2 lg:space-y-8 p-4 lg:py-4 text-center lg:text-left">
                    {/* small text */}
                    <p className="text-gray-500 font-medium text-sm tracking-wide mt-24">
                        {loading ? 'Loading...' : '10,000+ Members to Help you'}
                    </p>

                    {/* Big slogan */}
                    <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold text-gray-900 leading-snug md:leading-16">
                        {heroContent.title?.value || 'Empowering communities with unified help'}
                    </h1>

                    {/* description */}
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed ">
                        {heroContent.subtitle?.value || 'Together we bring support, kindness, and resources to uplift the lives of people who need us the most.'}
                    </p>

                    {/* button */}
                    <Link
                        to={heroContent.cta_link?.value || "/help-required"}
                        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition"
                    >
                        {heroContent.cta_text?.value || 'Need Help?'}
                    </Link>
                </div>

                {/* RIGHT SECTION */}
                <div className="w-full lg:w-1/2 space-y-8 bg-[url('https://framerusercontent.com/images/iVXBNlfNlwOrYh8NPdvIwT1BY.png?width=1400&height=1824')] bg-cover bg-center rounded-3xl p-8  lg:p-6 py-12 lg:py-16 shadow-sm">

                    <div className="flex flex-col h-80 mt-20 items-center gap-48">
                        <div className="flex flex-nowrap"> 
                            <h2 className="bg-white/70 text-gray-800 text-2xl rounded-full py-3 px-6 font-medium border">Watch the Latest</h2>
                            <a href="" target="_blank" className="bg-white/80 p-4 text-2xl ml-4 border rounded-full"><FaVideo/></a>
                        </div>
                        
                        <div className="flex items-center justify-evenly gap-8 text-2xl text-black px-6 py-4 rounded-full bg-white/50 backdrop-blur-md border border-black/40 shadow-lg">
                            <a href="#" className="hover:text-gray-600 transition cursor-pointer"><FaInstagram /></a>
                            <a href="#" className="hover:text-gray-600 transition cursor-pointer"><FaFacebookF /></a>
                            <a href="#" className="hover:text-gray-600 transition cursor-pointer"><FaTwitter /></a>
                            <a href="#" className="hover:text-gray-600 transition cursor-pointer"><FaYoutube /></a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default HeroHome
