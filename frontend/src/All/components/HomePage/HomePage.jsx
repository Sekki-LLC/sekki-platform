import React from 'react';
import './HomePage.css';        // ← add this

import Header           from '../Header/Header';
import Hero             from '../Hero/Hero';
import FeaturesSection  from '../FeaturesSection/FeaturesSection';
import PricingSection   from '../PricingSection/PricingSection';
import FounderOffer     from '../FounderOffer/FounderOffer';
import AboutSection     from '../AboutSection/AboutSection';
import FAQSection       from '../FAQSection/FAQSection';
import Footer           from '../Footer/Footer';


export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <FeaturesSection />
      <PricingSection />
      <FounderOffer />
      <AboutSection />
      <FAQSection />
      <Footer />
    </>
  );
}
