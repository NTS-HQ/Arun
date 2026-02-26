import "../styles/index.css"
import HeroHome from "../components/HeroHome";
import ImpactSectionPhoto from "../components/ImpactSectionPhoto";
import ImpactSection from "../components/ImpactSection";
import ForYouFromYou from "../components/ForYou";
import Faq from "../components/Faq"
import WhatsNext from "../components/WhatsNext";

export default function Home() {
  return <>
    <HeroHome/>
    <ImpactSection/>
    <ForYouFromYou/>
    <Faq/>  
    <WhatsNext/>
  </>;

}