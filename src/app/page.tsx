import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Benefits from "@/components/Benefits/Benefits";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import FeaturedCoaches from "@/components/FeaturedCoaches/FeaturedCoaches";
import Testimonials from "@/components/Testimonials/Testimonials";
import CTASection from "@/components/CTASection/CTASection";
import FAQ from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <FeaturedCoaches />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
