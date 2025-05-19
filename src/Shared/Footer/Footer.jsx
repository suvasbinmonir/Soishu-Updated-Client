import { FaWhatsapp, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { GrLocation } from 'react-icons/gr';
import { PiTiktokLogoFill } from 'react-icons/pi';

export const Footer = () => {
  return (
    <footer className="bg-[#F6F0E6] text-[#2f3133]">
      <div className="max-w-[1440px] w-full mx-auto lg:pt-14 pt-12 pb-8 gap-8 px-5">
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
                <div className="bg-[#b26729] size-8 flex justify-center items-center rounded-full">
                  <FaFacebookF className="text-white rounded-full text-xl cursor-pointer" />
                </div>
                <div className="bg-[#b26729] size-8 flex justify-center items-center rounded-full">
                  <PiTiktokLogoFill className="text-white rounded-full text-xl cursor-pointer" />
                </div>
                <div className="bg-[#b26729] size-8 flex justify-center items-center rounded-full">
                  <FaYoutube className="text-white rounded-full text-xl cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t-[1.5px] border-[#ebbd97cc] text-[#2f3133] pt-2 flex xl:text-sm text-xs flex-col font-light md:flex-row justify-between items-center">
          <p className="text-center">
            Copyright © 2025 BrandNasu, All rights reserved.
          </p>
          <p className="flex md:items-center justify-center gap-2 mt-2 md:mt-0">
            <GrLocation className="text-[#b26729] font-semibold text-base mt-0.5" />
            H: 118/7, Chandrima R/A 03, Chandrima, Rajshahi, Bangladesh.
          </p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="#" className="hover:underline">
              Terms and Condition
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// export default Footer;

// import { IoSquareSharp } from 'react-icons/io5';
// import light from './images/light.png';
// import { FaFacebookF, FaRegClock, FaTiktok } from 'react-icons/fa';
// import { LuYoutube } from 'react-icons/lu';
// import { FaLocationDot } from 'react-icons/fa6';
// import { IoMdCall } from 'react-icons/io';
// import { MdOutlineMailOutline } from 'react-icons/md';

// export const Footer = () => {
//   return (
// <div className="bg-[#F6F0E6]">
//   <div className="max-w-[1400px] w-full mx-auto relative mt-32 py-10">
//         {/* Main Container */}
//         <div className="flex flex-col md:flex-row justify-between items-center md:items-start w-full h-full gap-10">
//           {/* Left Side */}
//           <div className="w-full md:w-[40%]">
//             <h1 className="text-[16px] flex items-center text-[#9E6747] tracking-widest uppercase">
//               <IoSquareSharp className="rotate-45 text-sm" />
//               &nbsp; Know the discounts
//             </h1>
//             <h2 className="titlefont text-3xl md:text-5xl font-bold capitalize leading-tight mt-2">
//               Join The newsletter <br /> family
//             </h2>

//             <div className="mt-8 flex items-center">
//               <input
//                 type="text"
//                 placeholder="email address"
//                 className="border border-black w-80 h-[60px] pl-2 placeholder:text-xl placeholder:text-black"
//               />
//               <button className="text-white bg-black border border-black px-10 h-[60px] text-xl">
//                 Send
//               </button>
//             </div>

//             <div className="flex items-start gap-3 mt-4">
//               <input type="checkbox" className="scale-110 mt-1" />
//               <h1 className="text-base sm:text-xl">
//                 I accept the privacy and policy
//               </h1>
//             </div>

//             <div className="flex gap-4 mt-6 justify-center md:justify-normal">
//               {[FaFacebookF, FaTiktok, LuYoutube].map((Icon, i) => (
//                 <h1
//                   key={i}
//                   className="text-xl sm:text-2xl text-white w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex justify-center items-center"
//                 >
//                   <Icon />
//                 </h1>
//               ))}
//             </div>
//           </div>

//           {/* Light Image (absolute, centered) */}
//           <img
//             src={light}
//             alt=""
//             className="w-28 md:w-[200px] mx-auto absolute top-0 right-0  md:right-1/3 md:-translate-x-2/3  z-0"
//           />

//           {/* Right Side */}
//           <div className="w-full md:w-[40%]  -mr-0 md:-mr-10 z-10">
//             <div className="w-full  space-y-10">
//               {/* Address + Business Hour */}
//               <div className="flex flex-row justify-between gap-6">
//                 <div className="w-full md:w-[45%]">
//                   <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
//                     <FaLocationDot className="text-[#9E6747]" />
//                     <span className="titlefont font-bold">Address</span>
//                   </h1>
//                   <p className="pt-2 text-base">
//                     NO: 118/7, Chandrima R/A 03, Chandrima, Rajshahi, Bangladesh
//                   </p>
//                 </div>

//                 <div className="w-full md:w-[50%]">
//                   <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
//                     <FaRegClock className="text-[#9E6747]" />
//                     <span className="titlefont font-bold">Business Hour</span>
//                   </h1>
//                   <p className="pt-2 text-base">24/7 Hours, Always Open</p>
//                 </div>
//               </div>

//               {/* Call + Email */}
//               <div className="flex flex-row justify-between gap-6">
//                 <div className="w-full md:w-[45%]">
//                   <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
//                     <IoMdCall className="text-[#9E6747]" />
//                     <span className="titlefont font-bold">Call Us</span>
//                   </h1>
//                   <p className="pt-2">+8801805121001</p>
//                   <p className="pt-1">+8801805121001</p>
//                 </div>

//                 <div className="w-full md:w-[50%]">
//                   <h1 className="flex gap-2 items-center text-2xl md:text-4xl">
//                     <MdOutlineMailOutline className="text-[#9E6747] text-4xl md:text-6xl" />
//                     <span className="titlefont font-bold">Email Us</span>
//                   </h1>
//                   <p className="pt-2">hey@soishu.com</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Bottom */}
//         <div className="bg-[#f6f0e6] pt-10 md:pt-28">
//           <h1 className="text-black uppercase tracking-widest text-center pb-1">
//             SOISHU
//           </h1>
//           <div className="w-32 border-b-2 border-dashed border-black mx-auto "></div>
//           <h1 className="text-center py-1 text-sm sm:text-base">
//             &#169; All reserved. Made with &hearts; by Saikat Somir
//           </h1>
//         </div>
//       </div>
//     </div>
//   );
// };
