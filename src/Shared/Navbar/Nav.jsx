import { useState } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoCall, IoSearchOutline } from 'react-icons/io5';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export const Nav = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#F6F0E6] sticky top-0 z-40 select-none">
      <div className=" max-w-[1400px] mx-auto w-full ">
        <nav className="h-24 flex items-center justify-between px-4 md:px-0 lg:mx-0 relative z-50">
          <div className="md:order-2 lg:order-1">
            <Link to="/">
              <img
                src="/logo.svg"
                className="w-[100px] md:w-[140px]"
                alt="Logo"
              />
            </Link>
          </div>

          <div className="hidden lg:order-2 lg:flex gap-8 text-lg uppercase font-medium">
            <Link
              to="/"
              className="text-black text-lg hover:text-[#9E6747] font-light"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-black text-lg hover:text-[#9E6747] font-light"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-black text-lg hover:text-[#9E6747] font-light"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-black text-lg hover:text-[#9E6747] font-light"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:order-1 lg:order-3 md:flex items-center gap-6 text-xl">
            <a
              href="tel:01805121001"
              className="inline-flex items-center gap-2 rounded-md px-3 py-1 bg-[#B2672A] text-white hover:bg-[#9E5522] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B2672A]"
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
              className="text-black text-2xl hover:text-[#9E6747]"
            >
              <BsCart2 />
            </Link>
            <Link
              to="/wishlist"
              className="text-black text-2xl hover:text-[#9E6747]"
            >
              <IoMdHeartEmpty />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden md:order-3 order-3 text-3xl lg:order-3">
            <button onClick={() => setMobileMenuOpen(true)}>
              <div className="space-y-[8.5px]">
                <div className="border-b-1 border-black w-[40px]"></div>
                <div className="border-b-1 border-black w-[40px]"></div>
                <div className="border-b-1 border-black w-[40px]"></div>
              </div>
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`fixed top-0 left-0 w-full h-full overflow-hidden z-50 transform transition-transform bg-[#F6F0E6] duration-700 ease-in-out ${
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
              <img src="./logo.svg" className="w-[140px]" alt="Logo" />
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col items-center gap-6 text-xl font-medium mt-12 uppercase ">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden justify-center gap-6 text-2xl mt-10">
              <Link to="/search" onClick={() => setMobileMenuOpen(false)}>
                <IoSearchOutline />
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                <BsCart2 />
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                <IoMdHeartEmpty />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
