import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from "../assets/sru_logo.png"

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-800 py-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 justify-between">

                {/* ------------------- PART 1: LOGO + SOCIAL LINKS ------------------- */}
                <div className="flex flex-col items-start space-y-4 w-full md:w-1/3">
                    <img src={logo} width="250px" alt="SRU" />

                    <div className=" w-60 flex justify-between text-2xl">
                        <a href="#" className="hover:text-blue-600">
                            <FaFacebook />
                        </a>
                        <a href="#" className="hover:text-pink-600">
                            <FaInstagram />
                        </a>
                        <a href="#" className="hover:text-blue-400">
                            <FaTwitter />
                        </a>
                        <a href="#" className="hover:text-red-700">
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                {/* ------------------- PART 2: PAGE LINKS ------------------- */}
                <div className="flex flex-col w-full md:w-1/3">
                    <h3 className="text-xl font-semibold mb-3">Quick Links</h3>

                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="hover:underline hover:text-blue-600">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about-us" >About Us</Link>
                        </li>
                        <li>
                            <Link to="/our-works">
                                Our Works
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact-us" >
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/join-our-team" >
                                Join Our Team
                            </Link>
                        </li>
                        <li><Link
                            to="/help-required" >
                            Help Required
                        </Link></li>
                        <li><Link
                            to="/donate"  >
                            Donate
                        </Link></li>
                        <li><Link
                            to="/privacy-policy"  >
                            Privacy Policy
                        </Link></li>
                        <li><Link
                            to="/terms-and-conditions"  >
                            Terms & Conditions
                        </Link></li>
                    </ul>
                </div>

                <div className="flex flex-col w-full md:w-1/3">
                    <h3 className="text-xl font-semibold mb-3">Our Location</h3>

                    <p className="mb-4">
                        123 Example Street,<br />
                        Sample City, Country 456789
                    </p>

                    <div className="w-full h-40 rounded-lg overflow-hidden border">
                        <iframe
                            title="org-location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450929!2d144.95373531531555!3d-37.81627974202119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAwLjYiUyAxNDTCsDU3JzE0LjMiRQ!5e0!3m2!1sen!2sus!4v1611782306915!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Bottom Strip */}
            <div className="text-center text-gray-500 text-sm mt-8">
                © {new Date().getFullYear()} Your Organization. All rights reserved.
            </div>
        </footer>
    );
}