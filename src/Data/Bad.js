// import { IoSearchOutline, IoSquareSharp } from 'react-icons/io5';
// import boot from './images/boot.png';
// import tak from './images/tak.png';
// import suede from './images/sude.png';
// import lofar from './images/lofar.png';
// import derby from './images/derby.png';
// import casual from './images/casual.png';
// import { Swiper, SwiperSlide } from 'swiper/react';

// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/pagination';
// import 'swiper/css/autoplay'; // optional but safe

// // ✅ Import required modules
// import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
// import { v4 as uuidv4 } from 'uuid';
// import { Link } from 'react-router-dom';
// import { IoMdHeartEmpty } from 'react-icons/io';
// import { BsCart2 } from 'react-icons/bs';
// import { useRef } from 'react';

// const products = [
//   {
//     id: uuidv4(),
//     name: 'Classic Boot',
//     title: 'Urban Edge',
//     description:
//       'Stylish boots perfect for both city walks and weekend getaways.',
//     price: 1450,
//     image: boot,
//   },
//   {
//     id: uuidv4(),
//     name: 'Tassel Loafer',
//     title: 'Effortless Style',
//     description: 'Slip into these loafers for a day of confidence and class.',
//     price: 1600,
//     image: tak,
//   },
//   {
//     id: uuidv4(),
//     name: 'Suede Charm',
//     title: 'Soft Elegance',
//     description: 'Crafted in suede, these shoes redefine comfort and elegance.',
//     price: 1800,
//     image: suede,
//   },
//   {
//     id: uuidv4(),
//     name: 'Modern Loafer',
//     title: 'Timeless Trend',
//     description:
//       'A minimalist loafer designed to keep you looking sharp and sleek.',
//     price: 1700,
//     image: lofar,
//   },
//   {
//     id: uuidv4(),
//     name: 'Derby Classic',
//     title: 'Formal Staple',
//     description:
//       'Reliable derby shoes tailored for the modern gentleman’s wardrobe.',
//     price: 1900,
//     image: derby,
//   },
//   {
//     id: uuidv4(),
//     name: 'Casual Slip-On',
//     title: 'Everyday Comfort',
//     description:
//       'Your go-to shoes for everyday ease and subtle sophistication.',
//     price: 1300,
//     image: casual,
//   },
// ];

// export const Offer = () => {
//   const swiperRef = useRef(null);

//   return (
//     <div className=" select-none mb-20 md:mb-32">
//       <div className="max-w-[1400px]  mx-auto  h-full">
//         <div>
//           <h1 className=" text-[16px]  uppercase tracking-widest flex mb-2 md:pb-5 items-center justify-center text-[#9E6747] ">
//             <IoSquareSharp className="rotate-45 text-sm" /> &nbsp; Elite Savings
//           </h1>
//           <h1 className="  text-3xl lg:text-5xl titlefont font-bold text-center ">
//             We offer affordable luxury..{' '}
//             <span className="lg:hidden">
//               {' '}
//               <br />{' '}
//             </span>
//             <span className="text-[#9E6747]"> .. at unbeatable prices</span>
//           </h1>
//           <h1 className="text-center text-sm md:text-lg pt-2 md:pt-5 w-[70%] md:w-full mx-auto">
//             <span className="text-[#9e6747]">Discover</span> Stylish shoes
//             starting as cheap as 1000tk
//           </h1>
//         </div>

//         <div className="mt-10 md:mt-20">
//           <Swiper
//             onSwiper={(swiper) => (swiperRef.current = swiper)}
//             spaceBetween={30}
//             freeMode
//             loop
//             autoplay={{ delay: 3000, disableOnInteraction: false }}
//             pagination={{ clickable: true }}
//             breakpoints={{
//               0: { slidesPerView: 1 },
//               640: { slidesPerView: 1 },
//               768: { slidesPerView: 3 },
//               1024: { slidesPerView: 3 },
//             }}
//             modules={[FreeMode, Pagination, Autoplay]}
//             className="mySwiper"
//             /* ⬇️ pause / resume autoplay */
//             onMouseEnter={() => swiperRef.current?.autoplay.stop()}
//             onMouseLeave={() => swiperRef.current?.autoplay.start()}
//           >
//             {products.map((product) => (
//               <SwiperSlide key={product.id}>
//                 <div className="p-3 text-center bg-[#F6F0E6] relative group cursor-pointer w-[90%]  mx-auto">
//                   <img
//                     style={{
//                       filter: 'drop-shadow(30px 60px 37px rgba(0, 0, 0, 0.51))',
//                     }}
//                     src={product.image}
//                     alt={product.name}
//                     className="w-[400px] h-[450px] object-contain mb-3"
//                   />
//                   <h2 className="text-lg uppercase tracking-widest">
//                     {product.name}
//                   </h2>
//                   <h3 className="font-semibold text-[#9e6747]">
//                     <span className="text-black pt-2">Tk.</span> {product.price}
//                   </h3>
//                   <div className="flex justify-between w-[90%] mx-auto left-5 absolute top-5 ">
//                     <div className="w-[50%]">
//                       <h1 className="text-white bg-[#9E6747] px-3 py-1 w-fit">
//                         25% Dis
//                       </h1>
//                     </div>
//                     <div className=" w-full flex justify-end">
//                       <h1 className="text-white bg-black px-3 py-1 group-hover:opacity-0 transition-all duration-700 border w-fit">
//                         New
//                       </h1>
//                     </div>
//                   </div>
//                   <div className="absolute top-5  right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col gap-4 text-2xl z-10 bg-white w-12">
//                     <Link
//                       to="/search "
//                       className="hover:bg-gray-100 text-center w-full flex justify-center py-2 hover:text-[#9E6747]"
//                     >
//                       <IoSearchOutline />
//                     </Link>
//                     <Link
//                       to="/cart"
//                       className="hover:bg-gray-100 text-center w-full flex justify-center py-2 hover:text-[#9E6747]"
//                     >
//                       <BsCart2 />
//                     </Link>
//                     <Link
//                       to="/wishlist"
//                       className="hover:bg-gray-100 text-center w-full flex justify-center py-2 hover:text-[#9E6747]"
//                     >
//                       <IoMdHeartEmpty />
//                     </Link>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </div>
//   );
// };
