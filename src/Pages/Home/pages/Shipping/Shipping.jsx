import shop from './images/2.svg';
import shipping from './images/1.svg';
import pay from './images/3.svg';
import ScrollToTop from '../../../../Shared/ScrollToTop/ScrollToTop';

export const Shipping = () => {
  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6 mb-20 md:mb-28">
      <ScrollToTop />
      <div className="flex md:flex-nowrap flex-wrap lg:gap-10 gap-6 justify-between items-center h-full">
        <div className="text-[#212529] bg-[#fef4e4] p-4 rounded-lg h-56 w-full">
          <img src={shipping} className="w-28 mx-auto mt-2" alt="" />
          <div>
            <h1 className="text-xl capitalize font-semibold text-center">
              Shipping & return
            </h1>
            <h1 className="text-center text-[#212529]">
              Hassle-free returns, no questions asked.
            </h1>
          </div>
        </div>

        <div className="text-[#212529] bg-[#aec0f4CC] p-4 rounded-lg h-56 w-full">
          <img src={shop} className="w-24 mx-auto mt-3" alt="" />
          <div>
            <h1 className="text-xl capitalize font-semibold text-center mt-3">
              Shop with confidence
            </h1>
            <h1 className="text-center text-[#212529]">
              Protected from purchase to doorstep.
            </h1>
          </div>
        </div>

        <div className="text-[#212529] bg-[#daf4f0] p-4 rounded-lg h-56 w-full">
          <img src={pay} className="w-24  mt-3 mx-auto" alt="" />
          <div>
            <h1 className="text-xl capitalize font-semibold text-center mt-3">
              Cash on delivery
            </h1>
            <h1 className="text-center text-[#212529]">
              Pay at your doorstep, no upfront payment.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
