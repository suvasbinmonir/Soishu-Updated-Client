import { forwardRef } from 'react';
import { FaWhatsapp, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { GrLocation } from 'react-icons/gr';
import { PiTiktokLogoFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

export const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-[#F6F0E6] text-[#2f3133]">
      <ScrollToTop />
      <div className="max-w-[1440px] mx-auto lg:px-16 md:px-10 px-5 lg:pt-14 pt-12 pb-8 gap-8">
        <div className="mb-8 flex flex-col lg:flex-row justify-between lg:gap-40">
          {/* Center Discount Section */}
          <div className="xl:max-w-2xl max-w-xl w-full">
            <img
              src="/logo.svg"
              className="w-[100px] md:w-[140px]"
              alt="Logo"
            />
            <p className="my-3 max-w-md text-[#2f3133]">
              At <span className="text-[#2f3133]">soishu</span>, we craft shoes
              that do more than just fit, they tell your story. Designed for the
              modern man who walks with purpose, style, and quiet strength.
            </p>
            <p className="flex items-center gap-2 text-lg mb-1.5">
              <FaWhatsapp className="text-[#b26729]" />
              <a
                href="https://wa.me/8801805121001"
                target="_blank"
                rel="noopener noreferrer"
              >
                +8801805121001
              </a>
            </p>
            <p className="flex items-center gap-2 text-lg">
              <FiMail className="text-[#b26729]" />
              <a
                href="mailto:hey@soishu.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hey@soishu.com
              </a>
            </p>
          </div>

          {/* Right Shop Section */}
          <div className="flex justify-between w-full">
            <div className="mt-6">
              <h3 className="text-xl mb-3">Shop</h3>
              <ul className="space-y-1 text-[#2f3133]">
                <li>
                  <a href="#" className="hover:underline">
                    Sandal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Shacci
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Casual
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-6 text-[#2f3133]">
              <h3 className="text-xl mb-3">Others</h3>
              <p>Follow us on Social Media</p>
              <div className="flex space-x-4 mt-5">
                <a
                  href="https://www.facebook.com/hi.soishu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#b26729] size-8 flex justify-center items-center rounded-full"
                >
                  <FaFacebookF className="text-white text-xl" />
                </a>
                <a
                  href="https://www.tiktok.com/@hi.soishu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#b26729] size-8 flex justify-center items-center rounded-full"
                >
                  <PiTiktokLogoFill className="text-white rounded-full text-xl cursor-pointer" />
                </a>

                <div className="bg-[#b26729] size-8 flex justify-center items-center rounded-full">
                  <FaYoutube className="text-white rounded-full text-xl cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t-[1.5px] border-[#ebbd97cc] text-[#2f3133] pt-2 flex xl:text-sm text-xs flex-col font-light md:flex-row justify-between items-center">
          <p className="text-center order-3 md:order-1">
            Copyright © 2025 BrandNasu, All rights reserved.
          </p>
          <div className="flex md:items-center justify-center md:gap-2 mt-2 md:mt-0 order-2 text-center pb-2">
            <GrLocation className="text-[#b26729] font-semibold text-base mt-0.5 hidden md:block " />
            <h1>
              H: 118/7, Chandrima R/A 03, Chandrima, Rajshahi, Bangladesh.
            </h1>
          </div>
          <div className="flex space-x-6 mt-2 md:mt-0 order-1 md:order-3">
            <Link
              to={'/terms-and-condition'}
              href="#"
              className="hover:underline"
            >
              Terms and Condition
            </Link>
            <Link to={'/privacy'} href="#" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
