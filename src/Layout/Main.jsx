import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../Shared/Footer/Footer';
import { Nav } from '../Shared/Navbar/Nav';
import { useRef } from 'react';
import ScrollToTop from '../Shared/ScrollToTop/ScrollToTop';

export const Main = () => {
  const footerRef = useRef(null);
  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const location = useLocation();

  const isCheckout = location.pathname.includes('/checkout');
  const isCart = location.pathname.includes('/cart');
  const isSuccess = location.pathname.includes('/order-confirmed');

  return (
    <div>
      <ScrollToTop />
      <Nav onContactClick={scrollToFooter} />
      <Outlet />
      {!isCheckout && !isCart && !isSuccess && <Footer ref={footerRef} />}
    </div>
  );
};
