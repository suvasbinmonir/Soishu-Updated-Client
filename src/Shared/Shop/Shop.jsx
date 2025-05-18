// import '../../index.css';
import { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Optional default styles
import boot from './images/boot.png';
import casual from './images/casual.png';
import derby from './images/derby.png';
import lofar from './images/lofar.png';
import sandal from './images/sandal.png';
import { IoSearchOutline, IoSquareSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { BsCart2 } from 'react-icons/bs';
import { IoMdHeartEmpty } from 'react-icons/io';

const products = [
  { name: 'Boot', image: boot },
  { name: 'Casual', image: casual },
  { name: 'Derby', image: derby },
  { name: 'Lofar', image: lofar },
  { name: 'Sandal', image: sandal },
];

export const Shop = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProductData(data));
  }, []);

  // const getProductsByCategory = (category) => {
  //   return productData.filter((item) =>
  //     item.name.toLowerCase().includes(category.toLowerCase())
  //   );
  // };
  const slugify = (name) => {
    return `soishu-${name.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="bg-[#F6F0E6] mb-20 md:mb-32">
      <div className=" max-w-[1400px] w-full mx-auto   py-20">
        <div className="mb-10 ">
          <h1 className="text-[16px] flex pb-2 items-center justify-center md:justify-normal text-[#9E6747] tracking-widest uppercase">
            <IoSquareSharp className="rotate-45 text-sm" />
            &nbsp; Fresh Finds !!
          </h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center  ">
            <h1 className=" text-2xl md:text-5xl titlefont font-semibold text-center ">
              Discover, Choose, And Enjoy By Category
            </h1>
            <button className="hidden md:block bg-[#9E6747] hover:bg-black transition-all duration-500 h-13 px-10 font-light mt-5 w-fit mx-auto md:mx-0">
              <Link to="/shop" className="titlefont text-xl text-white">
                View All Collection
              </Link>
            </button>
          </div>
        </div>

        <Tabs>
          <div className="">
            <TabList className="flex flex-wrap gap-5  md:gap-0 justify-center md:justify-normal w-full md:w-fit mx-auto outline-none overflow-hidden">
              {products.map((p, idx) => (
                <Tab
                  key={idx}
                  className="cursor-pointer  md:w-64 hover:bg-[#f5f5f5]  data-[selected]:text-white transition outline-none  md:h-[150px]"
                >
                  <div
                    className={`flex md:items-center  justify-center md:border-[0.5px]   md:h-[150px] relative ${
                      p.name === 'Sandal'
                        ? 'md:border-r-[0.5px]'
                        : 'md:border-r-0 '
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className={`${
                        p.name === 'Boot'
                          ? 'h-[20px] md:h-[80px]  '
                          : 'h-[20px] md:h-[100px]'
                      } ${
                        p.name === 'Lofar' ? 'mt-3 -ml-4' : 'mt-0'
                      } object-contain mb-4 rotate-45 z-10 hidden md:block`}
                    />
                    <div className="w-4 md:w-14 h-4 md:h-14 rounded-full bg-[#c19576] absolute md:bottom-5 left-2/5 md:left-1/3 z-0 hidden md:block"></div>
                    <h1 className="md:text-2xl text-[16px] titlefont font-bold">
                      {p.name}
                    </h1>
                  </div>
                </Tab>
              ))}
            </TabList>

            <div className="mb-10 mt-20 hidden md:block text-center">
              <h1 className="text-[16px] flex pb-2 items-center text-[#9E6747] tracking-widest uppercase w-fit mx-auto">
                <IoSquareSharp className="rotate-45 text-sm" />
                &nbsp; OUR COLLECTIONS.
              </h1>
              <h1 className="text-2xl md:text-5xl titlefont font-semibold">
                <span className="text-[#9E6747]">Stylish </span> And{' '}
                <span className="text-[#9E6747]">Perfect </span>For You
              </h1>
              <h1 className="md:w-[50%] text-sm md:text-xl mx-auto pt-4">
                Step into confidence with shoes that blend style, comfort, and
                timeless design. Perfect for any occasion, our footwear is
                crafted to elevate your look while keeping you comfortable all
                day long.
              </h1>
            </div>

            <div className="flex-1 mt-10 md:mt-20">
              {/* {products.map((p, idx) => (  */}
              <TabPanel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-20  cursor-pointer ">
                  {productData.map((item, i) => (
                    <Link
                      to={`/product-details/${item._id}/${slugify(item.name)}`}
                      key={i}
                      className="relative group"
                    >
                      <div
                        key={i}
                        className="relative group w-[90%] md:w-[100%] mx-auto"
                      >
                        <div className="bg-[#FAF8F2]">
                          <img
                            style={{
                              filter:
                                'drop-shadow(50px 60px 37px rgba(0, 0, 0, 0.51))',
                            }}
                            src={
                              item?.product?.[0]?.image ?? // first product image, if it exists
                              item?.colors?.[0]?.image // otherwise fallback to first color image
                            }
                            alt={item.name}
                            className="w-full h-[500px] object-contain mb-4"
                          />
                        </div>

                        {/* Title & Price */}
                        <h2 className="text-xl tracking-wider pt-3 uppercase">
                          {item.name}
                        </h2>
                        <p className="text-[#9E6747] font-semibold text-lg">
                          <span className="text-black pt-2">Tk.</span> &nbsp;
                          {item.price}
                        </p>

                        {/* Labels */}
                        <div className="flex justify-between w-[90%] mx-auto left-5 absolute top-5 ">
                          {item.discount && (
                            <div className="w-[50%]">
                              <h1 className="text-white bg-[#9E6747] px-3 py-1 w-fit">
                                25% Dis
                              </h1>
                            </div>
                          )}
                          {item.depend === 'new' && (
                            <div className=" w-full flex justify-end">
                              <h1 className="text-white bg-black px-3 py-1 group-hover:opacity-0 transition-all duration-500 border w-fit">
                                New
                              </h1>
                            </div>
                          )}
                        </div>

                        <div className="absolute top-5  right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-4 text-2xl z-10 bg-white w-12">
                          <Link
                            to="/search "
                            className="hover:bg-gray-100 text-center w-full flex justify-center py-2 hover:text-[#9E6747]"
                          >
                            <IoSearchOutline />
                          </Link>
                          <Link
                            to="/cart"
                            className="hover:bg-gray-100 text-center w-full flex justify-center py-2 hover:text-[#9E6747]"
                          >
                            <BsCart2 />
                          </Link>
                          <Link
                            to="/wishlist"
                            className="hover:bg-gray-100 text-center w-full flex justify-center py-2 hover:text-[#9E6747]"
                          >
                            <IoMdHeartEmpty />
                          </Link>
                        </div>
                        {/* <button className="bg-[#9E6747] hover:bg-black transition-all duration-1000 py-2 px-10 font-light absolute bottom-28  right-[100px] opacity-0 group-hover:opacity-100  flex flex-col gap-4 text-2xl z-10 ">
                      <Link
                        to="/shop"
                        className="titlefont text-lg text-white  "
                      >
                        Add To Cart
                      </Link>
                    </button> */}
                      </div>
                    </Link>
                  ))}
                </div>
              </TabPanel>
              {/* ))} */}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
