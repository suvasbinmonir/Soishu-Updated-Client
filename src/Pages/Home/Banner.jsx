// import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';
// import bg from './images/banner.png';
// import heroPhone from './images/hero-phone.png';
// export const Banner = () => {
//   return (
//     <div className="bg-[#F6F0E6] mb-16 md:pt-32 select-none  ">
//       <ScrollToTop />
//       <div className="max-w-[1440px] mx-auto lg:px-16 md:px-10 px-5  pb-20">
//         <div className="md:flex hidden">
//           <img src={bg} className=" w-full " alt="" />
//         </div>
//         <div className="md:hidden pt-32 pb-16">
//           <img src={heroPhone} className=" w-full " alt="" />
//         </div>
//       </div>
//     </div>
//   );
// };

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';
import { Link } from 'react-router-dom';
import { useGetAllBannersQuery } from '../../api/bannerApi';

export const Banner = () => {
  const { data: heroImages = [], isLoading } = useGetAllBannersQuery();

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] select-none">
      <ScrollToTop />
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-6 pt-16 md:mt-16 mt-10 pb-8 md:pb-12">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="relative"
        >
          {heroImages.map((slide) => (
            <SwiperSlide key={slide._id}>
              <div className="relative px-1">
                <img
                  src={slide.image}
                  className="w-full h-full object-cover"
                  alt={slide.alt}
                />
                {slide.link && (
                  <Link to={slide.link}>
                    <button className="absolute bottom-[34px] px-8 h-13 w-58 rounded-lg cursor-pointer" />
                  </Link>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer duration-300 ${
                activeIndex === index
                  ? 'bg-[#495057CC] scale-110'
                  : 'bg-[#878a99CC]'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};
