import { useEffect, useRef } from 'react';
import Player from '@vimeo/player';
import image1 from './images/1.svg';
import image2 from './images/2.svg';
import image3 from './images/3.svg';
import image4 from './images/4.svg';
import image5 from './images/5.svg';
import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';

export const VideoSection = () => {
  const iframeRef = useRef(null);
  const sectionRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current, {
      muted: true,
    });

    playerRef.current = player;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          player
            .play()
            .catch((error) => console.error('Vimeo play error:', error));
        } else {
          player
            .pause()
            .catch((error) => console.error('Vimeo pause error:', error));
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      player
        .unload()
        .catch((error) => console.error('Vimeo unload error:', error));
    };
  }, []);

  return (
    <div className="bg-[#f7f7f7]">
      <ScrollToTop />
      <section
        ref={sectionRef}
        className="md:py-20 py-10 max-w-[1440px] w-full mx-auto px-4 md:px-6"
      >
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-center mb-3 md:mb-4 text-[#495057]">
          Why we are different?
        </h2>

        <p className="text-[#878a99] text-sm md:text-base leading-relaxed max-w-5xl mx-auto text-center mb-10">
          At <span>soishu</span>, every pair of leather shoes is crafted with
          passion, precision, and premium materials. We blend timeless tradition
          with modern style to deliver unmatched comfort and durability — shoes
          that tell your story.
        </p>

        {/* responsive 16:9 wrapper */}
        <div className="relative w-full mx-auto overflow-hidden md:rounded-lg shadow-lg">
          <div className="pt-[56.25%]" />
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full"
            src="https://player.vimeo.com/video/1086020610?h=d1114eb328&autoplay=0&muted=0&autopause=0"
            title="From Concept to Craft, Step inside SOISHU."
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="md:mt-32 mt-20 mb-10 flex flex-wrap justify-center gap-6 text-white">
          {[image1, image2, image3, image4, image5].map((img, i) => (
            <div
              key={i}
              className="rounded-2xl h-52 bg-[#daf4f0] text-[#212529] text-center flex flex-col justify-center items-center p-3 lg:max-w-md md:max-w-sm w-full"
            >
              <img src={img} className="h-14 w-14 mx-auto mb-4" alt="" />
              <h1 className="text-2xl font-semibold text-[#212529]">
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
              <h1 className="text-sm mt-1.5 text-[#212529]">
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
