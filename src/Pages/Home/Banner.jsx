import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';
import bg from './images/banner.png';
import heroPhone from './images/hero-phone.png';
export const Banner = () => {
  return (
    <div className="bg-[#F6F0E6] mb-20 md:mb-32 md:pt-32 select-none  ">
      <ScrollToTop />
      <div className="max-w-[1440px] mx-auto lg:px-16 md:px-10 px-5  pb-20">
        <div className="md:flex hidden">
          <img src={bg} className=" w-full " alt="" />
        </div>
        <div className="md:hidden pt-32 pb-16">
          <img src={heroPhone} className=" w-full " alt="" />
        </div>
      </div>
    </div>
  );
};
