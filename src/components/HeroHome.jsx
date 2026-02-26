import "../styles/index.css"
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaVideo } from "react-icons/fa";

export function HeroHome() {
    return (
        <section className="w-full px-2 md:px-6 lg:px-4 py-4 pt-28 lg:pt-4">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

                {/* LEFT SECTION */}
                <div className="w-full lg:w-1/2 space-y-2 lg:space-y-8 p-4 lg:py-4 text-center lg:text-left">
                    {/* small text */}
                    <p className="text-gray-500 font-medium text-sm tracking-wide mt-24">
                        10,000+ Members to Help you
                    </p>

                    {/* Big slogan */}
                    <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold text-gray-900 leading-snug md:leading-16">
                        Empowering communities with unified help
                    </h1>

                    {/* description */}
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed ">
                        Together we bring support, kindness, and resources to uplift the lives of people who need us the most.
                    </p>

                    {/* button */}
                    <Link
                        to="/help-required"
                        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition"
                    >
                        Need Help?
                    </Link>
                </div>

                {/* RIGHT SECTION */}
                {/* <div className="w-full lg:w-1/2 space-y-8 bg-[url(https://framerusercontent.com/images/iVXBNlfNlwOrYh8NPdvIwT1BY.png?width=1400&height=1824)] "> */}
                <div className="w-full lg:w-1/2 space-y-8 bg-[url('https://framerusercontent.com/images/iVXBNlfNlwOrYh8NPdvIwT1BY.png?width=1400&height=1824')] bg-cover bg-center rounded-3xl p-8  lg:p-6 py-12 lg:py-16 shadow-sm">

                    <div className="flex flex-col h-80 mt-20 items-center gap-48">
                        {/* <div className="text-xl flex items-center font-semibold text-gray-900 bg-white px-6 py-3 rounded-full leading-snug">
                              
                            <h2 className="">Latest actions, initiatives & updates</h2>
                            <a href="" className="bg-gray-200 p-3 ml-4 border rounded-full"><FaVideo/></a>
                        </div> */}
                        <div className="flex flex-nowrap"> 
                            <h2 className="bg-white/70 text-gray-800 text-2xl rounded-full py-3 px-6 font-medium border">Watch the Latest</h2>
                            <a href="" target="_blank" className="bg-white/80 p-4 text-2xl ml-4 border rounded-full"><FaVideo/></a>
                        </div>
                        
                        <div className="flex items-center justify-evenly gap-8 text-2xl text-black px-6 py-4 rounded-full bg-white/50 backdrop-blur-md border border-black/40 shadow-lg">
                            <FaInstagram className="hover:text-gray-600 transition cursor-pointer" />
                            <FaFacebookF className="hover:text-gray-600 transition cursor-pointer" />
                            <FaTwitter className="hover:text-gray-600 transition cursor-pointer" />
                            <FaYoutube className="hover:text-gray-600 transition cursor-pointer" />
                        </div>
                    </div>

                    {/* <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 bg-white px-6 py-3 rounded-xl leading-snug">
                        Latest actions, initiatives & updates
                    </h2>

                    <div className="bg-white border border-gray-200 rounded-xl p-3 ">
                        <h3 className="text-gray-800 font-medium text-lg mb-2">
                            Latest Announcement
                        </h3>

                        <Link
                            to="https://www.instagram.com"
                            target="_blank"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            <FaInstagram className="text-xl" />
                            click here to Watch Latest Instagram Update
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xl font-semibold text-gray-800 bg-white p-2 text-center rounded-full">
                            “Small acts create big impacts.”
                        </p>
                        <p className="text-xl font-semibold text-gray-800 bg-white p-2 text-center rounded-full">
                            “Together, we rise stronger.”
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl">
                        <h3 className="text-gray-800 text-lg text-center font-medium mb-3">
                            Follow us on social media
                        </h3>

                        <div className="flex items-center justify-evenly gap-5 text-2xl text-gray-700">
                            <FaInstagram className="hover:text-black transition cursor-pointer" />
                            <FaFacebookF className="hover:text-black transition cursor-pointer" />
                            <FaTwitter className="hover:text-black transition cursor-pointer" />
                            <FaYoutube className="hover:text-black transition cursor-pointer" />
                        </div>
                    </div> */}
                </div>

            </div>
        </section>
    );
}

export default HeroHome