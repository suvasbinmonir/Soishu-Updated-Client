import shop from './images/2.svg';
import shipping from './images/1.svg';
import pay from './images/3.svg';
import ScrollToTop from '../../../../Shared/ScrollToTop/ScrollToTop';
export const Shipping = () => {
  return (
    <div className="max-w-[1440px] mx-auto lg:px-16 md:px-10 px-5">
      <ScrollToTop />
      <div className="flex flex-wrap justify-evenly items-center h-full  ">
        <div className="text-[#2f3133] ">
          <img src={shipping} className="w-24 mx-auto" alt="" />
          <h1 className="text-lg uppercase font-semibold text-center">
            shipping & return
          </h1>
          <h1 className="text-center text-gray-600">
            Hassle-free returns, no questions asked.
          </h1>
        </div>

        <div className="text-[#2f3133] ">
          <img src={shop} className="w-24  mx-auto" alt="" />
          <h1 className="text-lg uppercase font-semibold text-center mt-3">
            SHOP WITH CONFIDENCE
          </h1>
          <h1 className="text-center text-gray-600">
            Protected from purchase to doorstep.
          </h1>
        </div>

        <div className="text-[#2f3133] ">
          <img src={pay} className="w-24  mx-auto" alt="" />
          <h1 className="text-lg uppercase font-semibold text-center mt-3">
            CASH ON DELIVERY
          </h1>
          <h1 className="text-center text-gray-600">
            Pay at your doorstep, no upfront payment.
          </h1>
        </div>
      </div>
    </div>
  );
};
