/* Offer.jsx */
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { FaCheck } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

/* ───────── constants ───────── */
const TAB_ORDER = ['Sandal', 'Sacchi', 'Casual'];
const COLORS = [
  { name: 'Chocklate', hex: '#4F2D1D', imgIdx: 0 },
  { name: 'Tan', hex: '#9D4304', imgIdx: 2 },
];
const SIZES = [39, 41, 42, 43];

/* ───────── helper utils ───────── */
const readCart = () => JSON.parse(localStorage.getItem('cart') || '[]');

const writeCart = (newCart) =>
  localStorage.setItem('cart', JSON.stringify(newCart));

/* ───────────────── component ───────────────── */
export const Offer = () => {
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products.json')
      .then((r) => r.json())
      .then(setProducts)
      .catch((err) => console.error('products.json load error →', err));
  }, []);

  if (!products.length) return null;

  const grouped = TAB_ORDER.map((name) => ({
    name,
    items: products.filter(
      (p) => p.category.toLowerCase() === name.toLowerCase()
    ),
  }));

  return (
    <div className="select-none mb-20 md:mb-32">
      <div className="max-w-[1400px] mx-auto h-full">
        <Tabs>
          {/* Tabs */}
          <TabList className="flex gap-5 md:gap-5 justify-center md:justify-normal w-fit mx-auto ">
            {grouped.map(({ name }) => (
              <Tab
                key={name}
                className="cursor-pointer px-4 py-2 border hover:bg-[#f7ecd9]
                           data-[selected]:bg-[#B2672A] data-[selected]:text-white
                           rounded outline-none"
              >
                <h1 className="md:text-2xl text-lg font-bold">{name}</h1>
              </Tab>
            ))}
          </TabList>

          {/* Panels */}
          {grouped.map(({ name, items }) => (
            <TabPanel key={name}>
              <Swiper
                onSwiper={(sw) => (swiperRef.current = sw)}
                spaceBetween={30}
                freeMode
                loop
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 3 },
                }}
                modules={[FreeMode, Pagination, Autoplay]}
                className="mySwiper mt-10 md:mt-20"
                onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay.start()}
              >
                {items.map((prod) => (
                  <SwiperSlide key={prod._id}>
                    <ProductCard prod={prod} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

/* ───────────────── single product card ───────────────── */
const ProductCard = ({ prod }) => {
  const [colour, setColour] = useState(null);
  const [size, setSize] = useState(null);
  const [warn, setWarn] = useState('');
  const [bump, setBump] = useState(0); // used only to re-render

  /* pick correct image */
  const img =
    (colour && prod.product?.[colour.imgIdx]?.image) ||
    prod.product?.[0]?.image ||
    prod.colors?.[0]?.image ||
    '';

  /* price helpers */
  const hasDiscount = prod.discount && prod.discount > 0;
  const sale = hasDiscount
    ? (prod.price * (1 - prod.discount / 100)).toFixed(0)
    : prod.price;
  const save = hasDiscount ? (prod.price - sale).toFixed(0) : 0;

  /* check if this exact variant is already in cart */
  const inCart = () => {
    const cart = readCart();
    return cart.some(
      (it) =>
        it._id === prod._id && it.colour === colour?.name && it.size === size
    );
  };

  /* add-to-cart */
  const handleAdd = () => {
    if (!colour) return setWarn('Please choose a colour');
    if (!size) return setWarn('Please choose a size');

    const cart = readCart();
    const idx = cart.findIndex(
      (it) =>
        it._id === prod._id && it.colour === colour.name && it.size === size
    );

    if (idx > -1) {
      cart[idx].qty += 1; // already there, bump qty
    } else {
      cart.push({
        _id: prod._id,
        name: prod.name,
        colour: colour.name,
        size,
        qty: 1,
      });
    }
    writeCart(cart);
    setWarn('');
    setBump((b) => b + 1); // force re-render to update button text
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
      {/* image */}
      <div className="text-center bg-[#F6F0E6] rounded-2xl">
        <img
          src={img}
          alt={prod.name}
          className="w-[400px] h-[300px] object-contain mx-auto"
        />
      </div>

      {/* name + colours */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{prod.name}</h1>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setColour(c);
                setWarn('');
              }}
              className="relative w-5 h-5 rounded-full border-2 cursor-pointer"
              style={{
                backgroundColor: c.hex,
                borderColor:
                  colour?.name === c.name ? '#B2672A' : 'transparent',
              }}
              title={c.name}
            >
              {colour?.name === c.name && (
                <FaCheck className="absolute inset-0 m-auto text-[8px] text-white" />
              )}
              {warn && !colour && (
                <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-[ping_1s_ease-in-out_3]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* description */}
      <p className="text-gray-600 text-sm leading-relaxed w-[60%] -mt-4">
        {prod.description}
      </p>

      {/* price */}
      <div className="flex items-center gap-3">
        <p className="text-2xl font-bold text-[#B2672A]">Tk. {sale}</p>
        {hasDiscount && (
          <>
            <p className="text-sm line-through text-gray-400">
              Tk. {prod.price}
            </p>
            <p className="text-sm text-green-600">Save Tk. {save}</p>
          </>
        )}
      </div>

      {/* size picker */}
      <div className="flex flex-wrap gap-2">
        {SIZES.map((sz) => (
          <button
            key={sz}
            onClick={() => {
              setSize(sz);
              setWarn('');
            }}
            className={`w-10 h-10 border rounded-sm transition
              ${
                size === sz
                  ? 'bg-[#B2672A] text-white border-[#B2672A]'
                  : 'hover:bg-[#B2672A]/10'
              }`}
          >
            {sz}
          </button>
        ))}
      </div>

      {/* warn */}
      {warn && <p className="text-red-600 text-xs -mb-3">{warn}</p>}

      {/* add / make purchase */}
      <button
        onClick={handleAdd}
        className={`mt-auto w-full py-2 bg-[#B2672A] text-white rounded-md ${
          inCart() ? 'bg-green-900' : 'bg-[#B2672A]'
        }`}
      >
        {inCart() ? 'Checkout' : 'Add to cart'}
      </button>
    </div>
  );
};
