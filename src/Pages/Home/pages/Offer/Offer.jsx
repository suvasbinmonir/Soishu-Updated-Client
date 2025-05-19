/*  src/pages/Offer.jsx  */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { FaCheck } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {
  addItem,
  selectCartItem,
  setDirectPurchase,
} from '../../../../cartSlice';

// import { addItem, selectCartItem, setDirectPurchase } from '@/store/cartSlice';

/* ───────── constants ───────── */
const TAB_ORDER = ['Sandal', 'Sacchi', 'Casual'];
const COLORS = [
  { name: 'Chocklate', hex: '#4F2D1D', imgIdx: 0 },
  { name: 'Tan', hex: '#9D4304', imgIdx: 2 },
];
const SIZES = [39, 41, 42, 43];

/* ───────────────── component ───────────────── */
export const Offer = () => {
  const [products, setProducts] = useState([]);
  const swiperRef = useRef(null);

  /* load the mock products once */
  useEffect(() => {
    fetch('/products.json')
      .then((r) => r.json())
      .then(setProducts)
      .catch((e) => console.error('products.json load error →', e));
  }, []);

  if (!products.length) return null;

  /* group products per tab heading */
  const grouped = TAB_ORDER.map((name) => ({
    name,
    items: products.filter(
      (p) => p.category.toLowerCase() === name.toLowerCase()
    ),
  }));

  return (
    <div className="select-none mb-20 md:mb-32">
      <div className="max-w-[1400px] mx-auto">
        <Tabs>
          {/* ─── tab headers ─── */}
          <TabList className="flex gap-5 justify-center md:justify-normal w-fit mx-auto">
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

          {/* ─── tab bodies ─── */}
          {grouped.map(({ name, items }) => (
            <TabPanel key={name}>
              <Swiper
                onSwiper={(sw) => (swiperRef.current = sw)}
                spaceBetween={30}
                loop
                freeMode
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* already-in-cart? */
  const variantInCart = useSelector((state) =>
    selectCartItem(state, prod._id, colour?.name, size)
  );

  /* choose correct image */
  const img =
    (colour && prod.product?.[colour.imgIdx]?.image) ||
    prod.product?.[0]?.image ||
    prod.colors?.[0]?.image ||
    '';

  /* price helpers */
  const hasDiscount = prod.discount > 0;
  const sale = hasDiscount
    ? (prod.price * (1 - prod.discount / 100)).toFixed(0)
    : prod.price;
  const save = hasDiscount ? (prod.price - sale).toFixed(0) : 0;

  /* build the variant object once validation passes */
  const buildVariant = () => ({
    _id: prod._id,
    name: prod.name,
    price: Number(sale),
    colour: colour.name,
    size,
    image: img,
  });

  /* add to cart only */
  const handleAdd = () => {
    if (!colour) return setWarn('Please choose a colour');
    if (!size) return setWarn('Please choose a size');

    dispatch(addItem(buildVariant()));
    setWarn('');
  };

  /* “buy now” → directPurchase + navigate */
  const handleBuyNow = () => {
    if (!colour) return setWarn('Please choose a colour');
    if (!size) return setWarn('Please choose a size');

    dispatch(setDirectPurchase(buildVariant()));
    setWarn('');
    navigate('/checkout');
  };

  const slug = `soishu-${prod.name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
      <Link to={`/product-details/${prod._id}/${slug}`}>
        <div className="text-center bg-[#F6F0E6] rounded-2xl">
          <img
            src={img}
            alt={prod.name}
            className="w-[400px] h-[300px] object-contain mx-auto"
          />
        </div>
      </Link>
      {/* title & colour picker */}
      <div className="flex items-center justify-between">
        <Link to={`/product-details/${prod._id}/${slug}`}>
          <h1 className="text-2xl font-semibold">{prod.name}</h1>
        </Link>

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
            className={`w-10 h-10 border rounded-sm transition ${
              size === sz
                ? 'bg-[#B2672A] text-white border-[#B2672A]'
                : 'hover:bg-[#B2672A]/10'
            }`}
          >
            {sz}
          </button>
        ))}
      </div>
      {/* warnings */}
      {warn && <p className="text-red-600 text-xs -mb-3">{warn}</p>}
      <div className="mt-auto flex flex-col sm:flex-row gap-2">
        {variantInCart ? (
          /* already in cart → show VIEW CART + BUY NOW */
          <>
            <Link
              to="/cart"
              className="flex-1 py-2 text-center bg-green-900 text-white rounded-md hover:bg-green-800"
            >
              View cart
            </Link>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
            >
              Buy&nbsp;now
            </button>
          </>
        ) : (
          /* not yet in cart → single ADD button */
          <button
            onClick={handleAdd}
            className="w-full py-2 text-white rounded-md bg-[#B2672A] hover:bg-[#9E5522]"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};
