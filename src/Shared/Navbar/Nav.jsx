import { useState, useEffect, useRef } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectCartTotalQty } from '../../cartSlice';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { CiLogin } from 'react-icons/ci';
import { Menu, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export const Nav = ({ onShopClick, onAboutClick, onContactClick }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  const cartCount = useSelector(selectCartTotalQty);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setShowNav(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNav(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowNav(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let startY = 0;
    let endY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      endY = e.touches[0].clientY;
      const swipeDistance = startY - endY;

      // If the user swipes up, prevent scrolling on the background
      if (swipeDistance > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      const swipeDistance = startY - endY;
      if (swipeDistance > 50 && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen]);

  return (
    <div
      className={`bg-[#f7f7f7] top-0 z-40 select-none fixed w-full transition-transform duration-300 ease-in-out ${
        showNav ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <ScrollToTop />
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 relative">
        <nav className="md:h-24 h-16 flex items-center justify-between md:px-0 lg:mx-0 relative z-50">
          {/* Logo */}
          <div className="md:order-2 lg:order-1">
            <Link to="/">
              <img
                src="/logo.svg"
                className="w-[100px] md:w-[140px]"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:order-2 lg:flex gap-8 text-lg uppercase font-medium">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#212529] hover:text-[#099885] font-light"
            >
              Home
            </Link>
            <span
              onClick={onShopClick}
              className="text-[#212529] hover:text-[#099885] font-light cursor-pointer"
            >
              Shop
            </span>
            <span
              onClick={onAboutClick}
              className="text-[#212529] hover:text-[#099885] font-light cursor-pointer"
            >
              About Us
            </span>
            <span
              onClick={onContactClick}
              className="text-[#212529] hover:text-[#099885] font-light cursor-pointer"
            >
              Contact
            </span>
          </div>

          {/* Contact & Icons */}
          <div className="hidden md:order-1 lg:order-3 md:flex items-center gap-6 text-xl">
            <a
              href="tel:01805121001"
              className="inline-flex items-center gap-2 rounded-md px-5 py-1 bg-[#099885] hover:bg-[#00846e] cursor-pointer text-white font-light"
            >
              <FaWhatsapp />
              01805121001
            </a>
            <Link
              // to="/search"
              className="text-[#212529] text-2xl hover:text-[#099885]"
            >
              <IoSearchOutline />
            </Link>

            <Link
              to="/cart"
              className="relative text-[#212529] text-2xl hover:text-[#099885]"
            >
              <BsCart2 />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#099885] rounded-full text-xs text-white px-1.5 py-0.5 font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/login"
              className="text-[#212529] text-2xl hover:text-[#099885]"
            >
              <CiLogin />
            </Link>
            {/* <Link
              to="/wishlist"
              className="text-[#212529] text-2xl hover:text-[#099885]"
            >
              <IoMdHeartEmpty />
            </Link> */}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden md:order-3 order-3 text-3xl text-[#099885]">
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown (outside nav for better layout) */}
        <div
          className={`fixed top-0 left-0 w-full h-[100vh] overflow-y-auto z-[9999] bg-[#F6F0E6] transform transition-transform duration-700 ease-in-out ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Close Button */}
          <button
            className="absolute top-8 right-4 text-3xl text-[#099885]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={28} />
          </button>

          {/* Logo Centered */}
          <div className="mt-8 flex justify-center">
            <img src="/logo.svg" className="w-[100px]" alt="Logo" />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col items-center gap-6 text-lg mt-12 uppercase">
            <Link
              to="/"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </Link>
            <span
              onClick={() => {
                setMobileMenuOpen(false);
                onShopClick();
              }}
            >
              Shop
            </span>
            <span
              onClick={() => {
                setMobileMenuOpen(false);
                onAboutClick();
              }}
            >
              About Us
            </span>
            <span
              onClick={() => {
                setMobileMenuOpen(false);
                onContactClick();
              }}
            >
              Contact
            </span>
          </div>

          {/* Mobile Icons */}
          <div className="flex justify-center gap-6 text-2xl mt-10">
            <Link onClick={() => setMobileMenuOpen(false)}>
              <IoSearchOutline />
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="relative"
            >
              <BsCart2 />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#099885] rounded-full text-xs text-white px-1.5 py-0.5 font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/login"
              className="text-[#212529] text-2xl hover:text-[#099885]"
            >
              <CiLogin />
            </Link>
            {/* <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
              <IoMdHeartEmpty />
            </Link> */}
          </div>
          <div className="flex justify-center pt-9">
            <a
              href="tel:01805121001"
              className="inline-flex w-[60%] justify-center items-center gap-2 text-lg rounded-md px-6 py-2 bg-[#B2672A] text-white hover:bg-[#9E5522]"
            >
              <FaWhatsapp />
              01805121001
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
