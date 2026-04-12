import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesHighlights from "@/components/ServicesHighlights";
import TechStackMarquee from "@/components/TechStackMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import AboutContactSection from "@/components/AboutContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <ServicesHighlights />
      <TechStackMarquee />
      <ProjectsSection />
      <AboutContactSection />
      <Footer />
    </div>
  );
};

export default Index;
