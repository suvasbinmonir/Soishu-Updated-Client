// import { IoSquareSharp } from 'react-icons/io5';
// import light from './images/light.png';
// import chair from './images/4.jpg';
// import lamp from './images/lamp.png';
// import boot from './images/image1.png';
// import polish from './images/image2.png';
// import single from './images/image3.png';
// import { Link } from 'react-router-dom';
// import down from './images/down.gif';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// export const Banner = () => {
//   const slides = [
//     {
//       img: boot,
//       title: 'Explorer Hot Sacchi',
//       desc: 'Built for rugged terrains with unmatched grip and comfort.',
//       price: 60,
//       category: 'half sacchi',
//     },
//     {
//       img: polish,
//       title: 'Classic Polish Lofar',
//       desc: 'Shine and protect your shoes with our premium polish.',
//       price: 90,
//       category: 'lofar',
//     },
//     {
//       img: single,
//       title: 'Urban Stepper Shoes',
//       desc: 'Minimalist design perfect for daily city walks.',
//       price: 100,
//       category: 'shoes',
//     },
//   ];
//   return (
//     <div className="relative mb-20 md:mb-0 border">
//       <div className="h-full w-full relative flex  justify-between items-center ">
//         <div className="flex justify-between flex-col md:flex-row  w-full items-center  -mt-24  md:-mt-72">
//           <div className="w-full pl-4 md:pl-0 md:w-[40vw] ">
//             <img
//               className="absolute -top-30 w-20 md:w-48 md:left-[20%] left-[35%] lg:left-[15%]"
//               src={light}
//               alt=""
//             />

//             <div>
//               <h1 className="  md:text-[16px] uppercase tracking-widest flex pb-3 md:pb-5 items-center text-[#9E6747]">
//                 <IoSquareSharp className="rotate-45 text-sm" /> &nbsp;
//                 Sustainable Shoes
//               </h1>
//               <h1 className="titlefont text-3xl md:text-7xl font-semibold leading-tight ">
//                 Confidence in <span className="text-[#9E6747]">shoes</span>{' '}
//                 <br />
//                 built every step.
//               </h1>
//               <h1 className="text-base md:text-xl pt-2 md:pt-5 w-[90%]">
//                 Designed for real people and real movement, our shoes offer
//                 support, comfort, and bold style — empowering you to go further,
//                 feel better, and look great doing it.
//               </h1>
//               <button className="bg-[#9E6747] hover:bg-black transition-all duration-500 h-13 px-10 font-light mt-5 md:mt-10">
//                 <Link
//                   to="/shop"
//                   className="titlefont text-xl md:text-2xl text-white  "
//                 >
//                   New Collection
//                 </Link>
//               </button>
//             </div>
//           </div>
//           <div className=" w-[90vw] md:w-[35vw] mt-5 md:mt-0">
//             <div className="bg-[#F6F0E6] h-[45vh] md:h-[60vh] rounded-t-full rounded-l-full">
//               <img
//                 style={{
//                   filter: 'drop-shadow(30px 60px 37px rgba(0, 0, 0, 0.51))',
//                 }}
//                 src={chair}
//                 className="w-[500px] rounded-full h-[500px] object-cover absolute  md:left-[63%] mt-20 z-20"
//                 alt=""
//               />
//               <img
//                 src={lamp}
//                 className="md:h-[700px] absolute z-10 top-0 right-10 hidden md:block"
//                 alt=""
//               />
//             </div>
//           </div>
//         </div>
//       </div>
// {/*
//       {/* <div className="flex flex-col md:flex-row justify-between items-center">
//         <div className="md:w-[50vw] w-full relative md:static">
//           <div className="relative md:absolute bottom-0 md:w-[45vw] h-auto md:h-[30vh]">
//             <div className="w-full md:w-[45vw] bg-[#313131] rounded-tr-[70%] md:rounded-tr-full py-10 md:py-0 flex justify-center items-center cursor-grab">
//               <Swiper
//                 pagination={{ clickable: true }}
//                 modules={[Pagination, Autoplay]}
//                 autoplay={{ delay: 6000, disableOnInteraction: false }}
//                 loop={true}
//                 className="mySwiper w-full md:w-[40vw]"
//               >
//                 {slides.map((item, index) => (
//                   <SwiperSlide key={index}>
//                     <div className="flex flex-col md:flex-row justify-center items-center text-center px-4 text-white">
//                       <div className="w-full md:w-[50%] mb-4 md:mb-0">
//                         <img
//                           src={item.img}
//                           alt={item.title}
//                           className="mx-auto w-48 md:w-72"
//                         />
//                       </div>
//                       <div className="flex flex-col items-center md:items-start w-full md:w-[50%]">
//                         <h1 className="text-black md:text-white font-light uppercase text-sm md:text-xl tracking-widest">
//                           {item.category}
//                         </h1>
//                         <h3 className="text-base md:text-2xl font-semibold titlefont tracking-wider py-2">
//                           {item.title}
//                         </h3>
//                         <p className="text-white text-base md:text-lg">
//                           ${item.price}
//                         </p>
//                         <button className="bg-[#9E6747] hover:bg-black transition-all duration-500 h-12 px-6 md:px-10 font-light mt-4">
//                           <Link
//                             to="/shop"
//                             className="titlefont text-lg md:text-2xl text-white"
//                           >
//                             Shop Now
//                           </Link>
//                         </button>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>
//           </div>
//         </div>

//         <div className="hidden md:flex w-[40vw] absolute right-0 bottom-40">
//           <div className="border-r border-black w-72 pr-5">
//             <h1 className="text-5xl uppercase titlefont text-black pb-4">
//               1K+
//             </h1>
//             <h1>Shoes Crafted for Everyday Excellence</h1>
//           </div>
//           <div className="border-r border-black w-80 px-10">
//             <h1 className="text-5xl uppercase titlefont text-black pb-4">
//               50+
//             </h1>
//             <h1>Unique Footwear with Signature Style</h1>
//           </div>
//           <div className="pl-10 w-72">
//             <h1 className="text-5xl uppercase titlefont text-black pb-4">
//               200 +
//             </h1>
//             <h1>Delighted Customers Every Day</h1>
//           </div>
//         </div>

//         <div className="flex flex-col md:hidden w-full mt-10 space-y-6 px-4">
//           <div className="text-center">
//             <h1 className="text-3xl uppercase titlefont text-black pb-2">
//               1K+
//             </h1>
//             <h1 className="text-sm text-gray-700">
//               Shoes Crafted for Everyday Excellence
//             </h1>
//           </div>
//           <div className="text-center">
//             <h1 className="text-3xl uppercase titlefont text-black pb-2">
//               50+
//             </h1>
//             <h1 className="text-sm text-gray-700">
//               Unique Footwear with Signature Style
//             </h1>
//           </div>
//           <div className="text-center">
//             <h1 className="text-3xl uppercase titlefont text-black pb-2">
//               200 +
//             </h1>
//             <h1 className="text-sm text-gray-700">
//               Delighted Customers Every Day
//             </h1>
//           </div>
//         </div>
//       </div> */} */}

//       <div className="rounded-full w-20 md:w-32 h-20 md:h-32 bg-black text-white absolute top-[45%] md:top-[30%] left-[35%] md:left-[45%] flex items-center justify-center z-20">
//         <svg viewBox="0 0 200 200" className="w-full h-full ">
//           <defs>
//             <path
//               id="circlePath"
//               d="M 100, 100
//          m -75, 0
//          a 75,75 0 1,1 150,0
//          a 75,75 0 1,1 -150,0"
//             />
//           </defs>

//           <circle
//             cx="100"
//             cy="100"
//             r="100"
//             fill="none"
//             stroke="white"
//             strokeWidth="1"
//             strokeDasharray="0 0"
//           />

//           <text
//             fill="white"
//             fontSize="14"
//             fontFamily="Arial"
//             textAnchor="middle"
//           >
//             <textPath href="#circlePath" className="text-2xl" startOffset="25%">
//               scroll down
//             </textPath>
//             <textPath href="#circlePath" className="text-2xl" startOffset="75%">
//               scroll down
//             </textPath>
//           </text>

//           <image href={down} x="-25" y="-30" width="250" height="250" />
//         </svg>
//       </div>
//     </div>
//   );
// };

// import { IoSquareSharp } from 'react-icons/io5';
// import light from './images/light.png';
// import chair from './images/4.jpg';

// import { Link } from 'react-router-dom';
// import down from './images/down.gif';

// import 'swiper/css';
// import 'swiper/css/pagination';
// export const Banner = () => {
//   return (
//     <div className="bg-[#F6F0E6] mb-20 md:mb-32 select-none">
//       <div className=" relative pt-5 pb-16 md:py-16  max-w-[1400px] mx-auto w-full  ">
//         <div className="flex justify-between flex-col md:flex-row  w-full items-center ">
//           <div className="w-full px-5  md:pl-0 md:w-[40vw] ">
//             <img
//               className="absolute -top-30 w-20 md:w-40  left-[40%] md:left-[20%] z-50"
//               src={light}
//               alt=""
//             />

//             <div>
//               <h1 className="text-[16px] uppercase tracking-widest flex  justify-center md:justify-normal items-center text-[#9E6747] ">
//                 <IoSquareSharp className="rotate-45 text-sm" /> &nbsp;
//                 Sustainable Shoes
//               </h1>
//               <h1 className="titlefont text-3xl md:text-7xl py-3 md:py-5 font-semibold leading-tight  text-center md:text-start">
//                 Confidence in <span className="text-[#9E6747]">shoes</span>{' '}
//                 built every step.
//               </h1>
//               <h1 className="text-[14px] md:text-xl w-full md:w-[90%] mx-auto  md:mx-0 text-center md:text-start">
//                 Designed for real people and real movement, our shoes offer
//                 support, comfort, and bold style — empowering you to go further,
//                 feel better, and look great doing it.
//               </h1>
//               <div className="w-[90%]  mx-auto md:mx-0">
//                 <button className="bg-[#9E6747] hover:bg-black transition-all duration-500 h-13  w-full px-10  md:w-fit font-light mt-5 md:mt-10">
//                   <Link
//                     to="/shop"
//                     className="titlefont text-xl md:text-2xl text-white  "
//                   >
//                     New Collection
//                   </Link>
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className=" md:w-[35vw]  px-5 md:px-0 mt-10  flex justify-end">
//             <img
//               style={{
//                 filter: 'drop-shadow(30px 60px 37px rgba(0, 0, 0, 0.51))',
//               }}
//               src={chair}
//               className="w-[400px] md:w-[500px]  rounded-2xl md:rounded-full md:h-[500px] object-cover   "
//               alt=""
//             />
//           </div>
//         </div>
//         <div className="rounded-full w-20 md:w-32 h-20 md:h-32 bg-black text-white absolute left-1/2 -translate-x-1/2 bottoom-0  flex items-center justify-center z-20">
//           <svg viewBox="0 0 200 200" className="w-full h-full">
//             <defs>
//               <path
//                 id="circlePath"
//                 d="M100 100
//          m -75 0
//          a 75 75 0 1 1 150 0
//          a 75 75 0 1 1 -150 0"
//               />
//             </defs>

//             <circle
//               cx="100"
//               cy="100"
//               r="100"
//               fill="none"
//               stroke="white"
//               strokeWidth="1"
//             />

//             <text
//               fill="white"
//               fontSize="14"
//               fontFamily="Arial"
//               textAnchor="middle"
//             >
//               <textPath
//                 href="#circlePath"
//                 className="text-xl uppercase"
//                 startOffset="25%"
//               >
//                 awesome shoes
//               </textPath>

//               <textPath
//                 href="#circlePath"
//                 className="text-xl uppercase"
//                 startOffset="75%"
//               >
//                 scroll down{' '}
//               </textPath>
//             </text>

//             <image href={down} x="-25" y="-30" width="250" height="250" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

import bg from './images/banner.png';
export const Banner = () => {
  return (
    <div className="bg-[#F6F0E6] mb-20 md:mb-32 select-none">
      <div className=" max-w-[1400px] w-ful mx-auto">
        <img src={bg} className=" w-full " alt="" />
      </div>
    </div>
  );
};
