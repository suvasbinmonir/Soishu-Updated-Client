import { Outlet } from 'react-router-dom';
import { Footer } from '../Shared/Footer/Footer';
import { Nav } from '../Shared/Navbar/Nav';
import { useRef } from 'react';
import ScrollToTop from '../Shared/ScrollToTop/ScrollToTop';

export const Main = () => {
  const footerRef = useRef(null);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <ScrollToTop />
      <Nav onContactClick={scrollToFooter} />
      <Outlet />
      <Footer ref={footerRef} />
    </div>
  );
};
