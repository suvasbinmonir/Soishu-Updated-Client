import { useEffect, useState } from 'react';
import { IoSquareSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import amazingBanner from './images/amazing-banner.jpg';

export const DontMiss = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hrs: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    let storedTarget = localStorage.getItem('dealCountdownTarget');
    let targetTime;

    if (storedTarget) {
      targetTime = parseInt(storedTarget, 10);
    } else {
      targetTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('dealCountdownTarget', targetTime.toString());
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hrs: 0, mins: 0, secs: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hrs = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hrs, mins, secs });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-32  max-w-[1400px] mx-auto">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-10">
        {/* Left Text/Countdown */}
        <div className="w-full md:w-[45%] rounded-2xl h-full p-2 md:p-10 md:pl-0">
          <div>
            <h1 className="text-[16px] flex pb-2 items-center text-[#9E6747] tracking-widest uppercase">
              <IoSquareSharp className="rotate-45 text-sm" />
              &nbsp; Amazing deals inside!!
            </h1>
            <h1 className="titlefont text-3xl md:text-[55px] font-semibold mb-6">
              Don't miss the best deals
            </h1>

            {/* Countdown */}
            <div className="flex flex-wrap  md:justify-start text-center text-white font-semibold">
              {['days', 'hrs', 'mins', 'secs'].map((unit, index, arr) => (
                <div key={unit} className="text-black flex items-center mb-4">
                  <div className="bg-[#91919333] px-4  md:py-3">
                    <div className="text-xl md:text-4xl titlefont">
                      {String(timeLeft[unit]).padStart(2, '0')}
                    </div>
                    <div className="w-8 md:w-16 border-b-3 my-2 border-[#9E6747]"></div>
                    <div className="text-12px md:text-lg capitalize">
                      {unit}
                    </div>
                  </div>
                  {unit !== 'secs' && (
                    <div className="text-3xl md:text-4xl mt-2 px-2 md:px-4 text-[#9e6747]">
                      :
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h1 className="pt-6 md:pt-10 text-sm md:text-base">
              Discover exclusive offers — limited-time discounts and unbeatable
              prices curated just for you. These deals won’t last long, so act
              fast!
            </h1>
            <button className="bg-[#9E6747] hover:bg-black transition-all duration-500 h-13 px-8 py-2 font-light mt-6 md:mt-10">
              <Link
                to="/shop"
                className="titlefont text-lg md:text-2xl text-white"
              >
                Shop Now
              </Link>
            </button>
          </div>
        </div>

        <div className="w-full md:w-[55%] rounded-2xl md:rounded-none h-full overflow-hidden">
          <img
            src={amazingBanner}
            className="w-full h-full object-cover"
            alt="Amazing Deal Banner"
          />
        </div>
      </div>
    </div>
  );
};
