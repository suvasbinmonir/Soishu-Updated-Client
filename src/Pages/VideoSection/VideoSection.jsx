// import image1 from './images/1.svg';
// import image2 from './images/2.svg';
// import image3 from './images/3.svg';
// import image4 from './images/4.svg';
// import image5 from './images/5.svg';
// export const VideoSection = () => (
//   <div className="bg-[#FAF8F2] ">
//     <section className="py-16 max-w-[1400px] w-full mx-auto px-4">
//       <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-3 md:mb-4 text-[#2f3133]">
//         Why we are different?
//       </h2>

//       {/* Subtitle */}
//       <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-5xl mx-auto text-center mb-10">
//         At <span>soishu</span>, every pair of leather shoes is crafted with
//         passion, precision, and premium materials. We blend timeless tradition
//         with modern style to deliver unmatched comfort and durability — shoes
//         that tell your story.
//       </p>

//       {/* responsive 16:9 wrapper */}
//       <div className="relative w-full max-w-6xl mx-auto overflow-hidden md:rounded-lg shadow-lg">
//         {/* padding-top hack for 16:9 aspect ratio */}
//         <div className="pt-[56.25%]" />

//         <iframe
//           className="absolute inset-0 w-full h-full"
//           src="https://www.youtube.com/embed/ePMibIEgL3Q?autoplay=1&mute=0&enablejsapi=1"
//           title="Why we are different? – YouTube video player"
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//           allowFullScreen
//           referrerPolicy="strict-origin-when-cross-origin"
//         />
//       </div>

//       <div className="mt-20 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 text-white">
//         <div className="rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center p-2">
//           <img src={image1} className="h-14 w-14 mx-auto mb-2" alt="" />
//           <h1 className="text-2xl font-semibold">Handcrafted Quality</h1>
//           <h1 className="text-sm mt-1.5 ">
//             {' '}
//             Premium leather. Expert finish. Each pair is made to last.
//           </h1>
//         </div>
//         <div className=" rounded-2xl h-52 bg-[#B2672A] text-center  flex flex-col justify-center items-center p-2">
//           <img src={image2} className="h-14 w-14 mx-auto mb-2" alt="" />
//           <h1 className="text-2xl font-semibold">Everyday Comfort</h1>
//           <h1 className="text-sm mt-1.5">
//             {' '}
//             From morning meetings to midnight strolls, comfort that keeps up.
//           </h1>
//         </div>
//         <div className=" rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center p-2">
//           <img src={image3} className="h-14 w-14 mx-auto mb-2" alt="" />
//           <h1 className="text-2xl font-semibold ">Bangladeshi Streets</h1>
//           <h1 className="text-sm mt-1.5">
//             {' '}
//             Weather-resistant. Slip-tested. Designed for our roads.
//           </h1>
//         </div>
//         <div className=" rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center p-2">
//           <img src={image4} className="h-14 w-14 mx-auto mb-2" alt="" />
//           <h1 className="text-2xl font-semibold">Style & Stands Out</h1>
//           <h1 className="text-sm mt-1.5">
//             {' '}
//             Bold, exclusive footwear, unique craftsmanship, never mass-produced.
//           </h1>
//         </div>
//         <div className=" rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center p-2">
//           <img src={image5} className="h-14 w-14 mx-auto mb-2" alt="" />
//           <h1 className="text-2xl font-semibold">No Middlemen</h1>
//           <h1 className="text-sm mt-1.5">
//             {' '}
//             Direct-to-you pricing. No markups, no compromise.
//           </h1>
//         </div>
//       </div>
//     </section>
//   </div>
// );

import { useEffect, useRef } from 'react';
import image1 from './images/1.svg';
import image2 from './images/2.svg';
import image3 from './images/3.svg';
import image4 from './images/4.svg';
import image5 from './images/5.svg';

export const VideoSection = () => {
  const iframeRef = useRef(null);
  const sectionRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Load YouTube Iframe API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // When API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            observeSection();
          },
        },
      });
    };

    function observeSection() {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            playerRef.current.playVideo();
          } else {
            playerRef.current.pauseVideo();
          }
        },
        {
          threshold: 0.5, // Play when 50% visible
        }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
    }
  }, []);

  return (
    <div className="bg-[#FAF8F2]">
      <section
        ref={sectionRef}
        className="py-16 max-w-[1400px] w-full mx-auto px-4"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-3 md:mb-4 text-[#2f3133]">
          Why we are different?
        </h2>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-5xl mx-auto text-center mb-10">
          At <span>soishu</span>, every pair of leather shoes is crafted with
          passion, precision, and premium materials. We blend timeless tradition
          with modern style to deliver unmatched comfort and durability — shoes
          that tell your story.
        </p>

        {/* responsive 16:9 wrapper */}
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden md:rounded-lg shadow-lg">
          <div className="pt-[56.25%]" />
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/geFi-ZpN2ZM?enablejsapi=1"
            title="Why we are different? – YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 text-white">
          {[image1, image2, image3, image4, image5].map((img, i) => (
            <div
              key={i}
              className="rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center p-2"
            >
              <img src={img} className="h-14 w-14 mx-auto mb-2" alt="" />
              <h1 className="text-2xl font-semibold">
                {
                  [
                    'Handcrafted Quality',
                    'Everyday Comfort',
                    'Bangladeshi Streets',
                    'Style & Stands Out',
                    'No Middlemen',
                  ][i]
                }
              </h1>
              <h1 className="text-sm mt-1.5">
                {
                  [
                    'Premium leather. Expert finish. Each pair is made to last.',
                    'From morning meetings to midnight strolls, comfort that keeps up.',
                    'Weather-resistant. Slip-tested. Designed for our roads.',
                    'Bold, exclusive footwear, unique craftsmanship, never mass-produced.',
                    'Direct-to-you pricing. No markups, no compromise.',
                  ][i]
                }
              </h1>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
