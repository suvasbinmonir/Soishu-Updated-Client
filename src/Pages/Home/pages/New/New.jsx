import { IoSquareSharp } from 'react-icons/io5';
import top1 from './images/remove.png';
import side from './images/side.jpg';
import top2 from './images/2.jpg';
import image3 from './images/3.jpg';

export const New = () => {
  return (
    <div className="mt-24 min-h-screen h-full px-4">
      <div>
        <div>
          <h1 className="text-[16px] flex pb-2 items-center text-[#9E6747] tracking-widest uppercase">
            <IoSquareSharp className="rotate-45 text-sm" />
            &nbsp; Fresh Finds !!
          </h1>
          <h1 className="titlefont text-3xl md:text-5xl  font-semibold">
            Step into Bold. Stay Ahead.
          </h1>
          <h1 className="text-black text-lg pt-2">
            Fresh styles. Bold comfort. Shoes designed to move with you.
          </h1>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-5">
          {/* Left Section */}
          <div className="w-full md:w-[30%] h-[400px] md:h-[800px] rounded-2xl overflow-hidden">
            <img src={side} className="w-full h-full object-cover" alt="" />
          </div>

          {/* Right Section */}
          <div className="w-full md:w-[70%] h-full md:h-[800px] flex flex-col gap-5">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row w-full h-full md:h-1/2 gap-5">
              <div className="w-full md:w-[65%] rounded-2xl overflow-hidden h-[250px] md:h-full">
                <img src={top2} className="object-cover h-full w-full" alt="" />
              </div>
              <div className="w-full md:w-[35%] rounded-2xl overflow-hidden bg-[#ccc8c9] h-[250px] md:h-full">
                <img
                  style={{
                    filter: 'drop-shadow(10px 60px 37px rgba(0, 0, 0, 0.51))',
                  }}
                  src={top1}
                  className="object-cover h-full w-full"
                  alt=""
                />
              </div>
            </div>

            {/* Bottom Image */}
            <div className="w-full rounded-2xl overflow-hidden h-[250px] md:h-1/2">
              <img src={image3} className="object-cover h-full w-full" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
