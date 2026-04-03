import Hero from '../components/home/header/Hero'
import Platform from '../components/home/platform/Platform';
import Goals from '../components/home/goals/Goals';
import Testimonials from '../components/home/testimonials/Testimonials';
import CTA from '../components/home/cta/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <Platform />
      <Goals />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
