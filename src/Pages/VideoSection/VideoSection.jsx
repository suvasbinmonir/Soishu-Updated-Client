import image1 from './images/1.svg';
import image2 from './images/2.svg';
import image3 from './images/3.svg';
import image4 from './images/4.svg';
import image5 from './images/5.svg';
export const VideoSection = () => (
  <div className="bg-[#FAF8F2] ">
    <section className="py-16 max-w-[1400px] w-full mx-auto">
      <h2 className="text-4xl md:text-5xl font-semibold text-center mb-6">
        Why we are different?
      </h2>

      {/* Subtitle */}
      <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-center mb-10 px-4">
        At{' '}
        <span className="font-semibold text-[#B2672A] uppercase">Soishu</span>,
        every pair of leather shoes is crafted with passion, precision, and
        premium materials. We blend timeless tradition with modern style to
        deliver unmatched comfort and durability — shoes that tell your story.
      </p>

      {/* responsive 16:9 wrapper */}
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-lg">
        {/* padding-top hack for 16:9 aspect ratio */}
        <div className="pt-[56.25%]" />

        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/ePMibIEgL3Q?si=32XqhhPYhBPFAOag"
          title="Why we are different? – YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 text-white">
        <div className=" rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center">
          <img src={image1} className="h-14 w-14 mx-auto mb-2" alt="" />
          <h1 className="text-2xl font-semibold">Handcrafted Quality</h1>
          <h1 className="text-sm  ">
            {' '}
            Premium leather. Expert finish. Each pair is made to last.
          </h1>
        </div>
        <div className=" rounded-2xl h-52 bg-[#B2672A] text-center  flex flex-col justify-center items-center">
          <img src={image2} className="h-14 w-14 mx-auto mb-2" alt="" />
          <h1 className="text-2xl font-semibold">Everyday Comfort</h1>
          <h1 className="text-sm ">
            {' '}
            From morning meetings to midnight strolls, comfort that keeps up.
          </h1>
        </div>
        <div className=" rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center">
          <img src={image3} className="h-14 w-14 mx-auto mb-2" alt="" />
          <h1 className="text-2xl font-semibold ">Bangladeshi Streets</h1>
          <h1 className="text-sm ">
            {' '}
            Weather-resistant. Slip-tested. Designed for our roads.
          </h1>
        </div>
        <div className=" rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center">
          <img src={image4} className="h-14 w-14 mx-auto mb-2" alt="" />
          <h1 className="text-2xl font-semibold">Style & Stands Out</h1>
          <h1 className="text-sm px-[2px]">
            {' '}
            Bold, exclusive footwear, unique craftsmanship, never mass-produced.
          </h1>
        </div>
        <div className=" rounded-2xl h-52 bg-[#B2672A] text-center flex flex-col justify-center items-center">
          <img src={image5} className="h-14 w-14 mx-auto mb-2" alt="" />
          <h1 className="text-2xl font-semibold">No Middlemen</h1>
          <h1 className="text-sm ">
            {' '}
            Direct-to-you pricing. No markups, no compromise.
          </h1>
        </div>
      </div>
    </section>
  </div>
);
