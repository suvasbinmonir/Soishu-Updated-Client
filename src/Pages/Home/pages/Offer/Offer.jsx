import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

import { addItem, setDirectPurchase } from '../../../../cartSlice';
import {
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
} from '../../../../api/productsApi';
import { useGetAllCategoriesQuery } from '../../../../api/categoryApi';

export const Offer = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: categories = [] } = useGetAllCategoriesQuery();

  const categoryNames = categories.map((category) => category.name);
  const TAB_ORDER = categoryNames ? ['All', ...categoryNames] : [];

  // Query all products
  const { data: allProducts, isLoading: loadingAll } = useGetAllProductsQuery();

  // Query products by category
  const { data: categoryProducts, isLoading: loadingCategory } =
    useGetProductsByCategoryQuery(selectedCategory, {
      skip: selectedCategory === 'All',
    });

  const products =
    selectedCategory === 'All' ? allProducts?.data : categoryProducts?.data;

  const isLoading = selectedCategory === 'All' ? loadingAll : loadingCategory;

  if (!products) return null;

  return (
    <div className="select-none mb-20 md:mb-32 mt-16">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6">
        <div className="sticky hidden md:flex justify-center md:static top-0 z-10 bg-white py-4">
          <div className="flex gap-5 justify-center md:justify-normal w-fit mx-auto">
            {TAB_ORDER.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`cursor-pointer px-2 mx-2 md:px-4 py-1 md:py-2 border border-gray-200
                  ${
                    selectedCategory === name
                      ? 'bg-[#0ab39c] text-white border-[#0ab39c]'
                      : 'hover:bg-[#f7f7f7] text-[#495057]'
                  }
                  rounded-lg outline-none`}
              >
                <h1 className="md:text-2xl text-lg md:font-bold capitalize">
                  {name}
                </h1>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-40">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="mySwiper mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {products.map((prod) => (
              <div key={prod._id}>
                <ProductCard prod={prod} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ prod }) => {
  const swatches = prod.colors || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [colorName, setColorName] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(null);
  const [colorValue, setColorValue] = useState('');
  const [size, setSize] = useState(null);
  const [warn, setWarn] = useState('');
  const [stockMessage, setStockMessage] = useState('');

  // Set initial color
  useEffect(() => {
    if (swatches.length) {
      setColorName(swatches[0].name);
    }
  }, [prod]);

  // Clear size when color changes
  useEffect(() => {
    if (!colorName) return;
    setSize(null);
  }, [colorName]);

  const sizeRef = useRef(null);
  const warnRef = useRef(null);
  const stockRef = useRef(null);
  const sizeChartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target)) {
        setSize(null);
      }

      if (warnRef.current && !warnRef.current.contains(e.target)) {
        setWarn(null);
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

  const currentVariant = prod.variants.find((v) => v.color === colorName);
  const sizesForColor = currentVariant?.sizes || [];
  const img = currentVariant?.images?.[0] || '';

  const hasDiscount = prod.discount > 0;
  const sale = hasDiscount ? prod.discount : prod.price;

  const buildVariant = () => ({
    _id: prod._id,
    name: prod.name,
    price: Number(prod.price),
    color: colorName,
    value: colorValue,
    size,
    qty: 1,
    image: img,
  });

  const handleAdd = () => {
    setStockMessage('');
    if (!size) {
      return setWarn('সাইজ সিলেক্ট করুন।');
    }
    const item = buildVariant();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        items: [
          {
            item_id: `${item._id}-${colorName}`,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            item_brand: 'Soishu',
            item_category: prod.category || 'Shoes',
            item_variant: item.color,
            item_size: item.size,
          },
        ],
      },
    });

    dispatch(addItem(item));
    setWarn('');
  };

  const handleBuyNow = () => {
    if (!size) return setWarn('সাইজ সিলেক্ট করুন।');
    const item = buildVariant();

    dispatch(setDirectPurchase(item));

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        items: [
          {
            item_id: `${item._id}-${colorName}`,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            item_brand: 'Soishu',
            item_category: prod.category || 'Shoes',
            item_variant: item.color,
            item_size: item.size,
          },
        ],
      },
    });

    setWarn('');
    navigate('/checkout');
  };

  return (
    <div className="bg-[#F7f7f7] rounded-xl md:p-6 p-4 flex flex-col relative h-auto">
      <Link to={`/products/${prod.slug}/${colorName.toLowerCase()}`}>
        <div className="text-center rounded-lg overflow-hidden relative h-64 sm:h-80">
          <img
            src={img}
            alt={prod.name}
            className="w-full h-full object-contain object-center bg-white"
          />
        </div>

        {/* <div className="text-center rounded-lg overflow-hidden relative h-64 sm:h-80 md:h-full">
          <img
            src={img}
            alt={prod.name}
            className="w-full h-full object-cover object-center bg-white"
          />
        </div> */}

        {prod.total_stock <= 0 && (
          <p className=" text-sm font-medium bg-white border-2 border-[#B2672A] text-[#212529] px-4 rounded-[2px] py-1 text-right absolute top-10 right-10">
            Out of Stock
          </p>
        )}
      </Link>

      {/* Title & Color Picker */}
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-2xl font-semibold text-[#212529]">{prod.name}</h1>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-2 mt-4">
        <p className="text-2xl font-bold text-[#099885] flex items-center">
          Tk.{prod.price}
        </p>
        {hasDiscount && (
          <p className="text-base line-through text-gray-400 flex items-center">
            Tk.{sale}
          </p>
        )}
      </div>

      {/* Colors */}
      <div className="mt-3 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[#212529]">কালার:</h1>
          <div className="flex gap-2">
            {swatches.map(({ name, value }) => (
              <button
                key={name}
                onClick={() => {
                  setColorName(name);
                  setColorValue(value);
                  setWarn('');
                }}
                className="relative w-5 h-5 rounded-full border-2 cursor-pointer"
                style={{
                  backgroundColor: value,
                  borderColor: colorName === name ? '#B2672A' : 'transparent',
                }}
                title={name}
              >
                {colorName === name && (
                  <FaCheck className="absolute inset-0 m-auto text-[8px] text-white" />
                )}
              </button>
            ))}
          </div>
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
              setWarn('');
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
      {warn && !size && <p className="text-[#f06548] text-xs">{warn}</p>}

      {/* Actions */}
      <div className="mt-4 md:mb-0 mb-2">
        <button
          ref={stockRef}
          onClick={async () => {
            handleAdd();
            handleBuyNow();
          }}
          className="w-full py-2.5 text-white rounded-md bg-[#099885] hover:bg-[#00846e] cursor-pointer"
        >
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
};

export default Offer;
