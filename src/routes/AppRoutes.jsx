import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import OurWorks from "../pages/OurWorks";
import ContactUs from "../pages/ContactUs";
import HelpRequired from "../pages/HelpRequired";
import JoinOurTeam from "../pages/JoinOurTeam";
import Donate from "../pages/Donate";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import Footer from "../components/Footer";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-works" element={<OurWorks />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/help-required" element={<HelpRequired />} />
        <Route path="/join-our-team" element={<JoinOurTeam />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}