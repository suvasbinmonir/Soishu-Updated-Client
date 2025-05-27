import { useState, useEffect, useRef } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoCall, IoSearchOutline } from 'react-icons/io5';
import { HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectCartTotalQty } from '../../cartSlice';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

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

  return (
    <div
      className={`bg-[#F6F0E6] top-0 z-40 select-none fixed w-full transition-transform duration-300 ease-in-out ${
        showNav ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <ScrollToTop />
      <div className="max-w-[1440px] mx-auto lg:px-16 md:px-10 px-5 relative">
        <nav className="h-24 flex items-center justify-between px-4 md:px-0 lg:mx-0 relative z-50">
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
              className="text-black hover:text-[#9E6747] font-light"
            >
              Home
            </Link>
            <span
              onClick={onShopClick}
              className="text-black hover:text-[#9E6747] font-light"
            >
              Shop
            </span>
            <span
              onClick={onAboutClick}
              className="text-black hover:text-[#9E6747] font-light"
            >
              About Us
            </span>
            <span
              onClick={onContactClick}
              className="text-black hover:text-[#9E6747] font-light"
            >
              Contact
            </span>
          </div>

          {/* Contact & Icons */}
          <div className="hidden md:order-1 lg:order-3 md:flex items-center gap-6 text-xl">
            <a
              href="tel:01805121001"
              className="inline-flex items-center gap-2 rounded-md px-3 py-1 bg-[#B2672A] text-white hover:bg-[#9E5522]"
            >
              <IoCall />
              01805121001
            </a>
            <Link
              to="/search"
              className="text-black text-2xl hover:text-[#9E6747]"
            >
              <IoSearchOutline />
            </Link>
            <Link
              to="/cart"
              className="relative text-black text-2xl hover:text-[#9E6747]"
            >
              <BsCart2 />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#9E6747] rounded-full text-xs text-white px-1.5 py-0.5 font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* <Link
              to="/wishlist"
              className="text-black text-2xl hover:text-[#9E6747]"
            >
              <IoMdHeartEmpty />
            </Link> */}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden md:order-3 order-3 text-3xl">
            <button onClick={() => setMobileMenuOpen(true)}>
              <div className="space-y-[8.5px]">
                <div className="border-b border-black w-[40px]" />
                <div className="border-b border-black w-[40px]" />
                <div className="border-b border-black w-[40px]" />
              </div>
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
            className="absolute top-4 right-4 text-3xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HiX />
          </button>

          {/* Logo Centered */}
          <div className="mt-8 flex justify-center">
            <img src="/logo.svg" className="w-[140px]" alt="Logo" />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col items-center gap-6 text-lg  mt-12 uppercase">
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
            <Link to="/search" onClick={() => setMobileMenuOpen(false)}>
              <IoSearchOutline />
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="relative"
            >
              <BsCart2 />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#9E6747] rounded-full text-xs text-white px-1.5 py-0.5 font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
              <IoMdHeartEmpty />
            </Link> */}
          </div>
          <div className="flex justify-center pt-5">
            <a
              href="tel:01805121001"
              className="inline-flex items-center gap-2 rounded-md px-6 py-1 bg-[#B2672A] text-white hover:bg-[#9E5522]"
            >
              <IoCall />
              01805121001
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
