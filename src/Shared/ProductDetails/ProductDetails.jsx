import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem, setDirectPurchase } from '../../cartSlice';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { useGetProductBySlugQuery } from '../../api/productsApi';
import { Loader2, Minus, Plus } from 'lucide-react';
import NotFoundPage from '../../components/NotFoundPage';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, color } = useParams();
  const { data } = useGetProductBySlugQuery(name);
  const product = data?.data;
  const colors = product?.colors;
  const [colorKey, setColorKey] = useState('');
  const [validColor, setValidColor] = useState(Boolean | null);
  const [colorValue, setColorValue] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [stockMessage, setStockMessage] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!product) return;

    const lowerName = name?.toLowerCase();
    const lowerColor = color?.toLowerCase();

    const validColors = product.variants?.map((v) => v.color.toLowerCase());
    const hasValidColor = color ? validColors.includes(lowerColor) : false;
    setValidColor(hasValidColor);

    let expectedPath = `/products/${lowerName}`;
    if (color) {
      if (hasValidColor) {
        expectedPath += `/${lowerColor}`;
      } else if (product.variants?.length > 0) {
        expectedPath += `/${product.variants[0].color.toLowerCase()}`;
      }
    } else if (product.variants?.length > 0) {
      expectedPath += `/${product.variants[0].color.toLowerCase()}`;
    }

    if (location.pathname !== expectedPath) {
      navigate(expectedPath, { replace: true });
    }
  }, [product, name, color, navigate, location.pathname]);

  useEffect(() => {
    if (!product) return;

    const lowerColor = color?.toLowerCase();

    // Find a matching variant (case-insensitive)
    const variant =
      product.variants.find((v) => v.color.toLowerCase() === lowerColor) ??
      product.variants[0];

    const variantColor = variant?.color;
    const firstImage = variant?.images?.[0];

    // Set UI states with corrected variant
    setColorKey(variantColor);
    setColorValue(variantColor);
    if (firstImage) setActiveImg(firstImage);

    // Push correct data to GTM
    if (variantColor) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          price: product.price,
          items: [
            {
              item_id: `${product._id}-${variantColor.toLowerCase()}`,
              item_name: product.name,
              price: Number(product.price),
              item_category: product.category,
              item_brand: 'Soishu',
              quantity: 1,
              item_variant: product.color,
              item_size: product.size,
            },
          ],
        },
      });
    }
  }, [product, color]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    const updateArrows = () => {
      if (!container) return;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft + container.offsetWidth < container.scrollWidth
      );
    };

    if (container) {
      container.addEventListener('scroll', updateArrows);
      updateArrows();
    }

    return () => {
      container?.removeEventListener('scroll', updateArrows);
    };
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 100, behavior: 'smooth' });
  };

  const sizeRef = useRef(null);
  const errorRef = useRef(null);
  const stockRef = useRef(null);
  const sizeChartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target)) {
        setSize(null);
      }

      if (errorRef.current && !errorRef.current.contains(e.target)) {
        setError(null);
      }

      if (stockRef.current && !stockRef.current.contains(e.target)) {
        setStockMessage(null);
      }

      if (sizeChartRef.current && !sizeChartRef.current.contains(e.target)) {
        setShowSizeChart(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (color) => {
    setColorKey(color);
    setColorValue(color);

    const variant = product.variants.find((v) => v.color === color);
    const firstImage = variant?.images?.[0];
    if (firstImage) setActiveImg(firstImage);

    // 👇 Update the dynamic URL
    navigate(`/products/${name}/${color}`, { replace: true });
  };

  const currentVariant = product?.variants?.find((v) => v.color === colorKey);
  const sizesForColor = currentVariant?.sizes || [];

  if (!product)
    return (
      <div className="p-20 flex justify-center min-h-screen mt-40">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );

  if (color && !validColor) {
    return <NotFoundPage />;
  }

  const thumbs = (currentVariant?.images || []).slice(0, 10);
  const hasDiscount = product.discount > 0;
  const sale = hasDiscount ? product.discount : product.price;

  const handleAddToCart = () => {
    if (!size || !colorKey) {
      setError('সাইজ সিলেক্ট করুন।');
      return;
    }
    setError('');

    // ✅ Push GTM event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'BDT',
        value: Number(sale),
        items: [
          {
            item_id: `${product._id}-${colorKey}`,
            item_name: product.name,
            item_brand: 'Soishu',
            item_category: product.category,
            price: Number(sale),
            quantity: qty,
            item_color: colorKey,
            item_size: size,
          },
        ],
      },
    });

    dispatch(
      addItem({
        _id: product._id,
        price: Number(product.price),
        qty,
        color: colorKey,
        value: colorValue,
        size,
        image: activeImg,
        name: product.name,
        title: product.title,
      })
    );
  };

  const handleBuyNow = () => {
    if (!size || !colorKey) {
      setError('সাইজ সিলেক্ট করুন।');
      return;
    }
    setError('');

    // ✅ Push GTM event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        items: [
          {
            item_id: `${product._id}-${colorKey}`,
            item_name: product.name,
            item_brand: 'Soishu',
            item_category: product.title,
            price: Number(sale),
            quantity: qty,
            item_color: colorKey,
            item_size: size,
          },
        ],
      },
    });

    dispatch(
      setDirectPurchase({
        _id: product._id,
        price: Number(sale),
        qty,
        color: colorKey,
        size,
        image: activeImg,
        name: product.name,
        title: product.title,
      })
    );
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen md:pt-20">
      <ScrollToTop />
      <div className="max-w-[1440px] w-full mx-auto md:px-6 px-8 flex flex-col lg:flex-row gap-6 lg:gap-10 py-12 mt-6 md:mt-20">
        {/* LEFT column */}
        <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-4">
          <div className="relative order-2 md:hidden flex items-center">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-10 bg-gray-100 shadow-md rounded-full p-1 cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Scrollable Thumbnails */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-2 scroll-smooth px-"
            >
              {thumbs.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(image)}
                  className={`w-16 h-16 flex-shrink-0 bg-[#f7f7f7] rounded-md cursor-pointer ${
                    activeImg === image ? 'border border-gray-300' : 'border-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumb ${i}`}
                    className="object-cover w-full h-full p-1"
                  />
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 z-10 bg-gray-100 shadow-md rounded-full p-1 cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>

          <div className="md:flex hidden order-2 md:order-1 lg:flex-col gap-2 sm:gap-4 justify-center md:justify-normal">
            {thumbs.map((image, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(image)}
                className={`overflow-hidden w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#f7f7f7] rounded-md cursor-pointer ${
                  activeImg === image ? 'border border-gray-300' : 'border-none'
                }`}
              >
                <img
                  src={image}
                  alt="Alternative"
                  className="object-cover w-full h-full p-1 sm:p-2"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 order-1 md:order-2 flex z-20 mt-3 lg:mt-0">
            <img
              src={activeImg}
              className="object-cover block md:hidden border border-gray-300 rounded-xl"
              alt=""
            />
            <div className="md:w-full md:h-full max-w-[600px] hidden md:block">
              <img
                src={activeImg}
                alt="Alternative"
                className="aspect-square border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="w-full lg:w-1/2 lg:mt-0">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#212529]">
            {product.name}
          </h2>
          <p className="pt-2 text-sm sm:text-base text-[#878a99] hidden md:block">
            {product.title}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4 pb-3">
            <p className="text-xl sm:text-2xl font-bold text-[#099885]">
              Tk. {product.price}
            </p>
            {hasDiscount && (
              <p className="text-sm line-through text-gray-400">
                Tk. {product.price}
              </p>
            )}
          </div>

          {/* Color and Size chart */}
          <div className="flex items-center gap-6 mb-3">
            <div className="flex flex-wrap gap-3 items-center">
              <h3 className="font-semibold md:text-2xl text-lg uppercase md:capitalize text-[#212529]">
                কালার:
              </h3>
              {colors?.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  title={color.name}
                  className={`relative w-6 h-6 md:w-5 md:h-5 cursor-pointer rounded-full border-2 transition ${
                    colorKey === color.name
                      ? 'border-[#9E6747] scale-105'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {colorKey === color.name && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                      >
                        <path
                          d="M20 6.5 9 17.5l-5-5"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ))}

              {product.total_stock <= 0 && (
                <p className=" text-lg font-medium  text-red-500 px-4 pl-2 rounded-[2px] py-1 text-right ">
                  Out of Stock
                </p>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSizeChart((prev) => !prev)}
                className="flex items-center justify-center gap-2 px-2 py-[2px] bg-[#daf4f0] border border-[#0ab39c] text-[#212529] rounded text-[10px] font-medium hover:bg-[#aae2d7] transition-colors cursor-pointer"
              >
                সাইজ চার্ট
              </button>
              {showSizeChart && (
                <div
                  ref={sizeChartRef}
                  className="absolute z-10 -top-48 left-1/2 transform -translate-x-1/2 w-60 bg-white shadow-lg border border-gray-300 rounded-md p-3"
                >
                  {/* Arrow */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-300 rotate-45"></div>
                  <div>
                    <img src="/size-chart.jpg" alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Size Selector */}
          <div className="flex flex-wrap gap-2 mt-4 mb-2">
            {sizesForColor.map(({ size: sz, stock }) => {
              const isOutOfStock = stock <= 0;

              const handleClick = () => {
                if (isOutOfStock) {
                  setError('');
                  setStockMessage(`${sz} সাইজ ‍স্টকে নেই। `);
                } else {
                  setSize(sz);
                  setStockMessage('');
                }
              };

              return (
                <button
                  key={sz}
                  onClick={handleClick}
                  className={`w-10 h-10 text-[#212529] rounded-sm transition
          ${
            isOutOfStock
              ? 'opacity-50 cursor-not-allowed border border-gray-300'
              : 'cursor-pointer'
          }
          ${
            size === sz && !isOutOfStock
              ? 'bg-[#099885] text-white'
              : !isOutOfStock
              ? 'hover:bg-[#e6e6e6] border-gray-400 border'
              : ''
          }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>

          {stockMessage && (
            <p className="text-xs text-[#f06548] font-medium">{stockMessage}</p>
          )}

          {/* Warning */}
          {error && !size && <p className="text-[#f06548] text-xs">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-300 pb-4 mt-2 md:mt-5">
            <div className="flex items-center gap-4">
              <div className="md:flex items-center gap-4 hidden">
                <div className="flex items-center">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-3 border border-gray-300 rounded-l-md hover:bg-gray-200 cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={qty ?? 0}
                    onChange={(e) => {
                      let val = e.target.value;

                      if (val.length > 1 && val.startsWith('0')) {
                        val = val.replace(/^0+(?=\d)/, '');
                      }
                    }}
                    className={`no-arrows w-10 text-center py-2 border-y border-gray-300 text-[#212529] outline-none bg-white`}
                  />
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="p-3 border border-gray-300 rounded-r-md hover:bg-gray-200 cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                ref={stockRef}
                onClick={async () => {
                  handleAddToCart();
                  handleBuyNow();
                }}
                className="md:w-60 w-full py-2.5 text-white rounded-md bg-[#099885] hover:bg-[#00846e] cursor-pointer"
              >
                অর্ডার করুন
              </button>
            </div>
          </div>

          <div className="pt-6">
            <h1 className="text-xl sm:text-2xl font-semibold pb-2 text-[#212529]">
              Key Features
            </h1>
            <h2 className="font-semibold text-sm sm:text-base text-[#878a99]">
              {product?.keyFeatures?.subtitle}
            </h2>
            <p className="text-sm sm:text-base pt-1 text-[#878a99]">
              {product?.keyFeatures?.paragraph}
            </p>
            <ul className="pl-5 space-y-1 pt-2 text-sm sm:text-base text-[#878a99]">
              {product?.keyFeatures?.bullets?.map((point) => (
                <li key={point} className="-ml-5">
                  ✅ {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
