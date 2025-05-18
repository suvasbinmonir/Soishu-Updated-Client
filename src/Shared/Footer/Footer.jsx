import { IoSquareSharp } from 'react-icons/io5';
import light from './images/light.png';
import { FaFacebookF, FaRegClock, FaTiktok } from 'react-icons/fa';
import { LuYoutube } from 'react-icons/lu';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdCall } from 'react-icons/io';
import { MdOutlineMailOutline } from 'react-icons/md';

export const Footer = () => {
  return (
    <div className="bg-[#F6F0E6]">
      <div className="max-w-[1400px] mx-auto relative  mt-32 px-4 py-10 ">
        {/* Main Container */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start px-0 md:px-24 w-full h-full gap-10">
          {/* Left Side */}
          <div className="w-full md:w-[40%]">
            <h1 className="text-[16px] flex items-center text-[#9E6747] tracking-widest uppercase">
              <IoSquareSharp className="rotate-45 text-sm" />
              &nbsp; Know the discounts
            </h1>
            <h2 className="titlefont text-3xl md:text-5xl font-bold capitalize leading-tight mt-2">
              Join The newsletter <br /> family
            </h2>

            <div className="mt-8 flex items-center">
              <input
                type="text"
                placeholder="email address"
                className="border border-black w-80 h-[60px] pl-2 placeholder:text-xl placeholder:text-black"
              />
              <button className="text-white bg-black border border-black px-10 h-[60px] text-xl">
                Send
              </button>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <input type="checkbox" className="scale-110 mt-1" />
              <h1 className="text-base sm:text-xl">
                I accept the privacy and policy
              </h1>
            </div>

            <div className="flex gap-4 mt-6 justify-center md:justify-normal">
              {[FaFacebookF, FaTiktok, LuYoutube].map((Icon, i) => (
                <h1
                  key={i}
                  className="text-xl sm:text-2xl text-white w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex justify-center items-center"
                >
                  <Icon />
                </h1>
              ))}
            </div>
          </div>

          {/* Light Image (absolute, centered) */}
          <img
            src={light}
            alt=""
            className="w-28 md:w-[200px] mx-auto absolute top-0 right-0  md:right-1/3 md:-translate-x-2/3  z-0"
          />

          {/* Right Side */}
          <div className="w-full md:w-[40%]  -mr-0 md:-mr-10 z-10">
            <div className="w-full  space-y-10">
              {/* Address + Business Hour */}
              <div className="flex flex-row justify-between gap-6">
                <div className="w-full md:w-[45%]">
                  <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
                    <FaLocationDot className="text-[#9E6747]" />
                    <span className="titlefont font-bold">Address</span>
                  </h1>
                  <p className="pt-2 text-base">
                    NO: 118/7, Chandrima R/A 03, Chandrima, Rajshahi, Bangladesh
                  </p>
                </div>

                <div className="w-full md:w-[50%]">
                  <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
                    <FaRegClock className="text-[#9E6747]" />
                    <span className="titlefont font-bold">Business Hour</span>
                  </h1>
                  <p className="pt-2 text-base">24/7 Hours, Always Open</p>
                </div>
              </div>

              {/* Call + Email */}
              <div className="flex flex-row justify-between gap-6">
                <div className="w-full md:w-[45%]">
                  <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
                    <IoMdCall className="text-[#9E6747]" />
                    <span className="titlefont font-bold">Call Us</span>
                  </h1>
                  <p className="pt-2">+8801805121001</p>
                  <p className="pt-1">+8801805121001</p>
                </div>

                <div className="w-full md:w-[50%]">
                  <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
                    <MdOutlineMailOutline className="text-[#9E6747] text-4xl md:text-6xl" />
                    <span className="titlefont font-bold">Email Us</span>
                  </h1>
                  <p className="pt-2">hey@soishu.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-[#f6f0e6] pt-10 md:pt-28">
          <h1 className="text-black uppercase tracking-widest text-center pb-1">
            SOISHU
          </h1>
          <div className="w-32 border-b-2 border-dashed border-black mx-auto "></div>
          <h1 className="text-center py-1 text-sm sm:text-base">
            &#169; All reserved. Made with &hearts; by Saikat Somir
          </h1>
        </div>
      </div>
    </div>
  );
};
