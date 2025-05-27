import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactImageMagnify from 'react-image-magnify';
import { addItem, setDirectPurchase } from '../../cartSlice';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

const SIZES = [39, 40, 41, 42, 43, 44];
const SWATCHES = {
  tan: { name: 'tan', hex: '#9D4304' },
  chocklate: { name: 'chocklate', hex: '#4F2D1D' },
  black: { name: 'black', hex: '#000000' },
};

const ProductDetails = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [colourKey, setColourKey] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/products.json')
      .then((r) => r.json())
      .then((all) => {
        const found = all.find((p) => {
          const generatedSlug = p.name.toLowerCase().replace(/\s+/g, '-');
          return generatedSlug === name;
        });
        setProduct(found);

        const firstColour = Object.keys(SWATCHES).find(
          (k) => Array.isArray(found[k]) && found[k].length
        );
        setColourKey(firstColour);
        setActiveImg(found[firstColour]?.[0]?.image ?? '');
        const hdis = found.discount > 0;
        const di = hdis
          ? (found.price * (1 - found.discount / 100)).toFixed(0)
          : product.price;
        // ✅ GTM view_item event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'view_item',
          ecommerce: {
            items: [
              {
                item_id: found._id,
                item_name: found.name,
                item_brand: 'Soishu',
                item_category: found.category,
                price: Number(di),
              },
            ],
          },
        });
      });
  }, [name]);

  // ✅ Clear error when both color and size are selected
  useEffect(() => {
    if (colourKey && size) {
      setError('');
    }
  }, [colourKey, size]);

  if (!product) return <div className="p-20 text-center">Loading…</div>;

  const thumbs = (product[colourKey] ?? []).slice(0, 10);
  const hasDiscount = product.discount > 0;
  const sale = hasDiscount
    ? (product.price * (1 - product.discount / 100)).toFixed(0)
    : product.price;
  const save = hasDiscount ? (product.price - sale).toFixed(0) : 0;

  const isAlreadyInCart = cartItems.some(
    (item) =>
      item._id === product._id &&
      item.colour === colourKey &&
      item.size === size
  );

  // const handleAddToCart = () => {
  //   if (!size || !colourKey) {
  //     setError('Please select both color and size.');
  //     return;
  //   }
  //   setError('');
  //   dispatch(
  //     addItem({
  //       _id: product._id,
  //       price: Number(sale),
  //       qty,
  //       colour: colourKey,
  //       size,
  //       image: activeImg,
  //       name: product.name,
  //       title: product.title,
  //     })
  //   );
  // };

  // const handleBuyNow = () => {
  //   if (!size || !colourKey) {
  //     setError('Please select both color and size.');
  //     return;
  //   }
  //   setError('');
  //   dispatch(
  //     setDirectPurchase({
  //       _id: product._id,
  //       price: Number(sale),
  //       qty,
  //       colour: colourKey,
  //       size,
  //       image: activeImg,
  //       name: product.name,
  //       title: product.title,
  //     })
  //   );
  //   navigate('/checkout');
  // };
  const handleAddToCart = () => {
    if (!size || !colourKey) {
      setError('Please select both color and size.');
      return;
    }
    setError('');

    // ✅ Push GTM event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        items: [
          {
            item_id: product._id,
            item_name: product.name,
            item_brand: 'Soishu',
            item_category: product.category,
            price: Number(sale),
            quantity: qty,
            item_color: colourKey,
            item_size: size,
          },
        ],
      },
    });

    dispatch(
      addItem({
        _id: product._id,
        price: Number(sale),
        qty,
        colour: colourKey,
        size,
        image: activeImg,
        name: product.name,
        title: product.title,
      })
    );
  };

  const handleBuyNow = () => {
    if (!size || !colourKey) {
      setError('Please select both color and size.');
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
            item_id: product._id,
            item_name: product.name,
            item_brand: 'Soishu',
            item_category: product.title,
            price: Number(sale),
            quantity: qty,
            item_color: colourKey,
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
        colour: colourKey,
        size,
        image: activeImg,
        name: product.name,
        title: product.title,
      })
    );
    navigate('/checkout');
  };
  return (
    <div className="bg-[#FAF8F2] min-h-screen pt-20">
      <ScrollToTop />
      <div className="max-w-[1440px] w-full mx-auto lg:px-16 md:px-10 px-4 flex flex-col lg:flex-row gap-10 lg:gap-20 py-12 mt-20">
        {/* LEFT column */}
        <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-4">
          <div className="flex order-2 md:order-1 lg:flex-col gap-4 sm:gap-6 justify-center md:justify-normal">
            {thumbs.map(({ image }, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(image)}
                className={`border-[1.5px] overflow-hidden w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#f0ecec] ${
                  activeImg === image
                    ? 'border-[#9E6747]'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={image.replace(/^\.\//, '/')}
                  alt=""
                  className="object-cover md:w-full md:h-full p-1 sm:p-2"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 order-1 md:order-2 flex z-20 mt-4 lg:mt-0">
            <img
              src={activeImg.replace(/^\.\//, '/')}
              className="w-96 h-96 object-cover block md:hidden"
              alt=""
            />
            <div className="  md:w-full md:h-full max-w-[600px]  hidden md:block">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: product.name,
                    isFluidWidth: true,
                    src: activeImg.replace(/^\.\//, '/'),
                  },
                  largeImage: {
                    src: activeImg.replace(/^\.\//, '/'),
                    width: 1500,
                    height: 675,
                  },
                  enlargedImagePosition: 'beside',
                  enlargedImageContainerDimensions: {
                    width: '100%',
                    height: '100%',
                  },
                  enlargedImageContainerStyle: {
                    background: '#fff',
                    boxShadow: '0 0 8px rgba(0,0,0,.15)',
                  },
                  lensStyle: { background: 'rgba(255,255,255,.3)' },
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <h2 className="text-2xl sm:text-4xl font-semibold">{product.name}</h2>
          <p className="pt-2 text-sm sm:text-base">{product.description}</p>

          <div className="flex flex-wrap items-center gap-3 pt-5 pb-2 border-b border-black/30 mb-5">
            <p className="text-xl sm:text-2xl font-bold text-[#B2672A]">
              Tk. {sale}
            </p>
            {hasDiscount && (
              <>
                <p className="text-sm line-through text-gray-400">
                  Tk. {product.price}
                </p>
                <p className="text-sm text-green-600">Save Tk. {save}</p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-3 items-center">
            <h3 className="font-semibold">Color:</h3>
            {Object.entries(SWATCHES).map(([key, { name, hex }]) =>
              Array.isArray(product[key]) && product[key].length ? (
                <button
                  key={key}
                  onClick={() => {
                    setColourKey(key);
                    setActiveImg(product[key][0].image);
                  }}
                  title={name}
                  className={`relative w-5 h-5 cursor-pointer rounded-full border-2 transition ${
                    colourKey === key
                      ? 'border-[#9E6747] scale-105'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: hex }}
                >
                  {colourKey === key && (
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
              ) : null
            )}
          </div>

          <h3 className="font-semibold mb-2">Size:</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSize(sz)}
                className={`w-12 h-12 flex items-center justify-center border rounded cursor-pointer
                ${
                  size === sz
                    ? 'text-white bg-[#B2672A]'
                    : 'border-black/30 hover:bg-[#B2672A]/10'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 text-red-600 ">{error}</div>}

          <div className="flex flex-col sm:flex-row gap-4 border-b border-black/30 pb-8">
            <div className="flex items-center gap-4">
              <div className="border border-black/30 flex items-center justify-center">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 border-r border-black/30 flex items-center justify-center cursor-pointer"
                >
                  −
                </button>
                <span className="min-w-[2ch] px-3 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  className="w-9 h-9 border-l border-black/30 flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {isAlreadyInCart ? (
                <button
                  onClick={() => navigate('/cart')}
                  className="px-8 py-2 rounded bg-[#F7F0E6] border border-[#713601] text-[#713601] text-sm sm:text-base"
                >
                  View Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="px-8 py-2 rounded bg-[#B2672A] text-white text-sm sm:text-base"
                >
                  Add To Cart
                </button>
              )}
              <button
                onClick={handleBuyNow}
                className="px-8 py-2 rounded bg-[#713601] text-white text-sm sm:text-base"
              >
                Buy Now
              </button>
            </div>
          </div>

          <div className="pt-6">
            <h1 className="text-xl sm:text-2xl font-semibold pb-2">
              Key Features
            </h1>
            <h2 className="font-semibold text-sm sm:text-base">
              Nogor Sandel – Effortless Style for the Urban Step
            </h2>
            <p className="text-sm sm:text-base pt-1">
              Step into comfort and confidence with Nogor Sandel...
            </p>
            <ul className="list-disc pl-5 space-y-1 pt-2 text-sm sm:text-base">
              <li>✅ Premium Genuine Cow Leather</li>
              <li>✅ Open Slip-on Design</li>
              <li>✅ Padded Insole Comfort</li>
              <li>✅ Sturdy Rubber Grip</li>
              <li>✅ Minimalist Stitch Detail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
