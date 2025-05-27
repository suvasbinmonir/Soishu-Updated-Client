import { useRef } from 'react';
import { FaqSection } from '../FAQ/FaqSection';
import { VideoSection } from '../VideoSection/VideoSection';
import { Banner } from './Banner';
import { Offer } from './pages/Offer/Offer';
import { Shipping } from './pages/Shipping/Shipping';
import { Nav } from '../../Shared/Navbar/Nav';
import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';

export const Index = () => {
  const offerRef = useRef(null);
  const videoRef = useRef(null);
  const faqRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <ScrollToTop />
      <Nav
        onShopClick={() => scrollToRef(offerRef)}
        onAboutClick={() => scrollToRef(videoRef)}
        onContactClick={() => scrollToRef(faqRef)}
      />
      <div>
        <Banner />
        <div ref={offerRef}>
          <Offer />
        </div>
        <Shipping />
        <div ref={videoRef}>
          <VideoSection />
        </div>
        <div>
          <FaqSection />
        </div>
        <div ref={faqRef}>
          <ScrollToTop />
        </div>
      </div>
    </>
  );
};
