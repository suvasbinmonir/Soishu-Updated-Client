import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import bg from './images/shop-bg.png'; // untouched

/* helpers for localStorage with TTL */
const CART_KEY = 'cart_items';

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
    const now = Date.now();
    const valid = raw.filter((i) => i.expires > now); // strip expired
    if (valid.length !== raw.length) {
      localStorage.setItem(CART_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

function saveToCart(item) {
  const stored = loadCart();
  const fifteenDays = 15 * 24 * 60 * 60 * 1000;
  const newItem = { ...item, expires: Date.now() + fifteenDays };

  const idx = stored.findIndex((i) => i._id === item._id);
  if (idx > -1) {
    stored[idx] = newItem; // overwrite existing
  } else {
    stored.push(newItem); // add new
  }

  localStorage.setItem(CART_KEY, JSON.stringify(stored));
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState('');
  const [activeColor, setActiveColor] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [qty, setQty] = useState(1);

  /* fetch product once */
  useEffect(() => {
    fetch('/products.json')
      .then((r) => r.json())
      .then((d) => {
        const found = d.find((p) => p._id.toString() === id);
        setProduct(found);
        setActiveImg(
          found?.product?.[0]?.image ?? found?.colors?.[0]?.image ?? ''
        );
      });
  }, [id]);

  if (!product) return <div className="p-20 text-center">Loading…</div>;

  /* pricing helpers */
  const hasDiscount = product.discount > 0;
  const sale = hasDiscount
    ? (product.price * (1 - product.discount / 100)).toFixed(0)
    : product.price;
  const save = hasDiscount ? (product.price - sale).toFixed(0) : 0;

  const thumbs = [...(product.product ?? []), ...(product.colors ?? [])].slice(
    0,
    4
  );

  const changeColor = (c) => {
    setActiveColor(c.name);
    setActiveImg(c.image);
  };

  /* ADD TO CART ⇒ store / update for 15 days with price */
  const handleAddToCart = () => {
    saveToCart({
      _id: product._id,
      price: Number(sale), // number, easier for math later
      qty,
      color: activeColor,
      size: activeSize,
      image: activeImg,
      name: product.name,
      title: product.title,
    });
  };

  return (
    <div className="bg-[#FAF8F2] min-h-screen">
      {/* main */}
      <div className="max-w-[1400px] mx-auto px-4 lg:flex gap-20 py-12 mt-20">
        {/* LEFT column */}
        <div className="lg:w-1/2 flex gap-4">
          {/* thumbnails */}
          <div className="flex lg:flex-col gap-6 ">
            {thumbs.map(({ image }, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(image)}
                className={`border-2 overflow-hidden w-20 h-20 lg:w-36 lg:h-36 bg-[#f0ecec] ${
                  activeImg === image
                    ? 'border-[#9E6747]'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          {/* Main image with zoom */}
          <div className="flex-1 flex items-center">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: product.name,
                  isFluidWidth: true,
                  src: activeImg,
                },
                largeImage: {
                  src: activeImg,
                  width: 1200,
                  height: 1000,
                },
                enlargedImagePosition: 'beside',
                enlargedImageContainerDimensions: {
                  width: '120%',
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

        {/* RIGHT column */}
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <h2 className="text-2xl uppercase">{product.name}</h2>
          <p className="text-3xl font-semibold pt-2">{product.title}</p>

          <div className="flex items-center gap-3 pt-5 pb-2 border-b mb-5">
            <p className="text-2xl font-bold text-[#B2672A]">Tk. {sale}</p>
            {hasDiscount && (
              <>
                <p className="text-sm line-through text-gray-400">
                  Tk. {product.price}
                </p>
                <p className="text-sm text-green-600">Save Tk. {save}</p>
              </>
            )}
          </div>

          {/* stock */}
          <p
            className={`mb-4 font-medium ${
              product.stock === 'in' ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {product.stock === 'in' ? 'In Stock' : 'Out of Stock'}
          </p>

          {/* color picker */}
          <h3 className="font-semibold mb-2">Select color:</h3>
          <div className="flex gap-3 mb-6">
            {(product.colors ?? []).map((c) => (
              <button
                key={c.name}
                onClick={() => changeColor(c)}
                className={`w-12 h-12 rounded-full overflow-hidden ring-2 ${
                  activeColor === c.name ? 'ring-[#9E6747]' : 'ring-transparent'
                }`}
                title={c.name}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* size picker */}
          <h3 className="font-semibold mb-2">Select size:</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {[39, 41, 42, 43].map((sz) => (
              <button
                key={sz}
                onClick={() => setActiveSize(sz)}
                className={`w-12 h-12 flex items-center justify-center border ${
                  activeSize === sz
                    ? 'text-black border-[#9E6747]'
                    : 'border-gray-300'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* quantity */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-semibold">Quantity:</span>
            <div className="border flex items-center justify-center">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 border-r flex items-center justify-center cursor-pointer"
              >
                −
              </button>
              <span className="min-w-[2ch] px-3 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="w-9 h-9 border-l flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between gap-14">
            <div className="w-[50%]">
              <button
                onClick={handleAddToCart}
                className="px-12 py-3 w-full bg-green-900 text-white text-2xl"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
