// /*  src/pages/Offer.jsx  */
// import { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
// import { FaCheck } from 'react-icons/fa';

// import {
//   addItem,
//   selectCartItem,
//   setDirectPurchase,
// } from '../../../../cartSlice';
// import ScrollToTop from '../../../../Shared/ScrollToTop/ScrollToTop';

// /* tabs + sizes stay global */
// const TAB_ORDER = ['sandal', 'sacchi', 'casual'];
// const SIZES = [39, 40, 41, 42, 43, 44];

// export const Offer = () => {
//   const [products, setProducts] = useState([]);

//   /* fetch once */
//   useEffect(() => {
//     fetch('/products.json')
//       .then((r) => r.json())
//       .then(setProducts)
//       .catch((e) => console.error('products.json load error →', e));
//   }, []);

//   if (!products.length) return null;

//   const grouped = TAB_ORDER.map((name) => ({
//     name,
//     items: products.filter(
//       (p) => p.category.toLowerCase() === name.toLowerCase()
//     ),
//   }));

//   return (
//     <div className="select-none mb-20 md:mb-32 ">
//       <ScrollToTop />
//       <div className="max-w-[1440px] mx-auto lg:px-16 md:px-10 px-5">
//         <Tabs>
//           <div className="sticky md:static top-0 z-10 bg-[#FAF8F2] py-4">
//             <TabList className="flex gap-5 justify-center md:justify-normal w-fit mx-auto">
//               {grouped.map(({ name }) => (
//                 <Tab
//                   key={name}
//                   className="cursor-pointer px-2 md:px-4 py-1 md:py-2 border hover:bg-[#f7ecd9]
//                              data-[selected]:bg-[#B2672A] data-[selected]:text-white
//                              rounded outline-none data-[selected]:border-0 "
//                 >
//                   <h1 className="md:text-2xl text-lg md:font-bold">
//                     {name.charAt(0).toUpperCase() + name.slice(1)}
//                   </h1>
//                 </Tab>
//               ))}
//             </TabList>
//           </div>
//           {/* ─── tabs ─── */}

//           {/* ─── panels ─── */}
//           {grouped.map(({ name, items }) => (
//             <TabPanel key={name}>
//               <div className="mySwiper mt-10 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {items.map((prod) => (
//                   <div key={prod._id}>
//                     <ProductCard prod={prod} />
//                   </div>
//                 ))}
//               </div>
//             </TabPanel>
//           ))}
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// /* ───────────────── single product card ───────────────── */
// const ProductCard = ({ prod }) => {
//   /* build swatch list dynamically from product fields */
//   const swatches = [
//     prod.tan?.length && {
//       name: 'tan',
//       hex: '#9D4304',
//       key: 'tan',
//     },
//     prod.chocklate?.length && {
//       name: 'chocklate',
//       hex: '#4F2D1D',
//       key: 'chocklate',
//     },
//     prod.black?.length && {
//       name: 'black',
//       hex: '#222',
//       key: 'black',
//     },
//   ].filter(Boolean);

//   /* colour, size, warning states */
//   const [colourName, setColourName] = useState(swatches[0]?.name || '');
//   const [size, setSize] = useState(null);
//   const [warn, setWarn] = useState('');

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const productKey = swatches.find((c) => c.name === colourName)?.key;

//   /* check variant in cart */
//   const variantInCart = useSelector((state) =>
//     selectCartItem(state, prod._id, colourName, size)
//   );

//   /* choose image */
//   const img =
//     prod?.[productKey]?.[0]?.image ||
//     prod?.[swatches[0]?.key]?.[0]?.image ||
//     '';

//   console.log(img);

//   /* pricing */
//   const hasDiscount = prod.discount > 0;
//   const sale = hasDiscount
//     ? (prod.price * (1 - prod.discount / 100)).toFixed(0)
//     : prod.price;
//   const save = hasDiscount ? (prod.price - sale).toFixed(0) : 0;

//   /* build variant object once */
//   const buildVariant = () => ({
//     _id: prod._id,
//     name: prod.name,
//     price: Number(sale),
//     colour: colourName,
//     size,
//     qty: 1,
//     image: img,
//   });

//   /* handlers */
//   const handleAdd = () => {
//     if (!size) return setWarn('Please choose a size');
//     dispatch(addItem(buildVariant()));
//     setWarn('');
//   };

//   const handleBuyNow = () => {
//     if (!size) return setWarn('Please choose a size');
//     dispatch(setDirectPurchase(buildVariant()));
//     setWarn('');
//     navigate('/checkout');
//   };

//   const slug = `${prod.name.toLowerCase().replace(/\s+/g, '-')}`;

//   /* ----- UI ----- */
//   return (
//     <div className="bg-[#F6F0E6] rounded-2xl p-6 flex flex-col gap-6">
//       <Link to={`/products/${slug}`}>
//         <div className="text-center  rounded-lg overflow-hidden">
//           <img
//             src={img}
//             alt={prod.name}
//             className="aspect-square object-contain  mx-auto "
//           />
//         </div>
//       </Link>

//       {/* title & colour picker */}
//       <div className="flex items-center justify-between">
//         <Link to={`/products/${slug}`}>
//           <h1 className="text-2xl font-semibold">{prod.name}</h1>
//         </Link>

//         <div className="flex gap-2">
//           {swatches.map(({ name, hex }) => (
//             <button
//               key={name}
//               onClick={() => {
//                 setColourName(name);
//                 setWarn('');
//               }}
//               className="relative w-5 h-5 rounded-full border-2 cursor-pointer"
//               style={{
//                 backgroundColor: hex,
//                 borderColor: colourName === name ? '#B2672A' : 'transparent',
//               }}
//               title={name}
//             >
//               {colourName === name && (
//                 <FaCheck className="absolute inset-0 m-auto text-[8px] text-white" />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       <p className="text-gray-600 text-sm leading-relaxed w-[60%] -mt-4">
//         {prod.description}
//       </p>

//       <div className="flex items-center gap-3">
//         <p className="text-2xl font-bold text-[#B2672A]">Tk. {sale}</p>
//         {hasDiscount && (
//           <>
//             <p className="text-sm line-through text-gray-400">
//               Tk. {prod.price}
//             </p>
//             <p className="text-sm text-green-600">Save Tk. {save}</p>
//           </>
//         )}
//       </div>

//       {/* size picker */}
//       <div className="flex flex-wrap gap-2">
//         {SIZES.map((sz) => (
//           <button
//             key={sz}
//             onClick={() => {
//               setSize(sz);
//               setWarn('');
//             }}
//             className={`w-10 h-10 border rounded-sm transition cursor-pointer ${
//               size === sz
//                 ? 'bg-[#B2672A] text-white border-[#B2672A]'
//                 : 'hover:bg-[#B2672A]/10'
//             }`}
//           >
//             {sz}
//           </button>
//         ))}
//       </div>

//       {warn && <p className="text-red-600 text-xs -mb-3">{warn}</p>}

//       {/* actions */}
//       <div className="mt-auto flex flex-col sm:flex-row gap-2">
//         {variantInCart ? (
//           <>
//             <Link
//               to="/cart"
//               className="flex-1 py-2 text-center  rounded-md hover:bg-[#ece3d6] bg-[#F7F0E6] border-[0.5px] border-[#713601] text-[#713601] shadow-inner"
//             >
//               View cart
//             </Link>
//             <button
//               onClick={handleBuyNow}
//               className="flex-1 py-2  rounded-md hover:bg-[#713601]/90 cursor-pointer bg-[#713601] text-white"
//             >
//               Buy&nbsp;now
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={handleAdd}
//             className="w-full py-2 text-white rounded-md bg-[#B2672A] hover:bg-[#9E5522] "
//           >
//             Add to cart
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Offer;

/*  src/pages/Offer.jsx  */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { FaCheck } from 'react-icons/fa';

import {
  addItem,
  selectCartItem,
  setDirectPurchase,
} from '../../../../cartSlice';
import ScrollToTop from '../../../../Shared/ScrollToTop/ScrollToTop';

/* tabs + sizes stay global */
const TAB_ORDER = ['sandal', 'sacchi', 'casual'];
const SIZES = [39, 40, 41, 42, 43, 44];

export const Offer = () => {
  const [products, setProducts] = useState([]);

  /* fetch once */
  useEffect(() => {
    fetch('/products.json')
      .then((r) => r.json())
      .then(setProducts)
      .catch((e) => console.error('products.json load error →', e));
  }, []);

  if (!products.length) return null;

  const grouped = TAB_ORDER.map((name) => ({
    name,
    items: products.filter(
      (p) => p.category.toLowerCase() === name.toLowerCase()
    ),
  }));

  return (
    <div className="select-none mb-20 md:mb-32 ">
      <ScrollToTop />
      <div className="max-w-[1440px] mx-auto lg:px-16 md:px-10 px-5">
        <Tabs>
          <div className="sticky md:static top-0 z-10 bg-[#FAF8F2] py-4">
            <TabList className="flex gap-5 justify-center md:justify-normal w-fit mx-auto">
              {grouped.map(({ name }) => (
                <Tab
                  key={name}
                  className="cursor-pointer px-2 md:px-4 py-1 md:py-2 border hover:bg-[#f7ecd9]
                             data-[selected]:bg-[#B2672A] data-[selected]:text-white
                             rounded outline-none data-[selected]:border-0 "
                >
                  <h1 className="md:text-2xl text-lg md:font-bold">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </h1>
                </Tab>
              ))}
            </TabList>
          </div>
          {/* ─── tabs ─── */}

          {/* ─── panels ─── */}
          {grouped.map(({ name, items }) => (
            <TabPanel key={name}>
              <div className="mySwiper mt-10 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((prod) => (
                  <div key={prod._id}>
                    <ProductCard prod={prod} />
                  </div>
                ))}
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

/* ───────────────── single product card ───────────────── */
const ProductCard = ({ prod }) => {
  /* build swatch list dynamically from product fields */
  const swatches = [
    prod.tan?.length && {
      name: 'tan',
      hex: '#9D4304',
      key: 'tan',
    },
    prod.chocklate?.length && {
      name: 'chocklate',
      hex: '#4F2D1D',
      key: 'chocklate',
    },
    prod.black?.length && {
      name: 'black',
      hex: '#222',
      key: 'black',
    },
  ].filter(Boolean);

  /* colour, size, warning states */
  const [colourName, setColourName] = useState(swatches[0]?.name || '');
  const [size, setSize] = useState(null);
  const [warn, setWarn] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productKey = swatches.find((c) => c.name === colourName)?.key;

  /* check variant in cart */
  const variantInCart = useSelector((state) =>
    selectCartItem(state, prod._id, colourName, size)
  );

  /* choose image */
  const img =
    prod?.[productKey]?.[0]?.image ||
    prod?.[swatches[0]?.key]?.[0]?.image ||
    '';

  // console.log(img);

  /* pricing */
  const hasDiscount = prod.discount > 0;
  const sale = hasDiscount
    ? (prod.price * (1 - prod.discount / 100)).toFixed(0)
    : prod.price;
  const save = hasDiscount ? (prod.price - sale).toFixed(0) : 0;

  /* build variant object once */
  const buildVariant = () => ({
    _id: prod._id,
    name: prod.name,
    price: Number(sale),
    colour: colourName,
    size,
    qty: 1,
    image: img,
  });

  const handleAdd = () => {
    if (!size) return setWarn('Please choose a size');
    const item = buildVariant();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        items: [
          {
            item_id: item._id,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            item_brand: 'Soishu',
            item_category: prod.category || 'Shoes',
            item_variant: item.colour,
            item_size: item.size,
          },
        ],
      },
    });

    dispatch(addItem(item));
    setWarn('');
  };

  const handleBuyNow = () => {
    if (!size) return setWarn('Please choose a size');
    const item = buildVariant(); // ✅ capture variant
    dispatch(setDirectPurchase(item));

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        items: [
          {
            item_id: item._id,
            item_name: item.name,
            price: item.price,
            quantity: 1,
            item_brand: 'Soishu',
            item_category: prod.category || 'Shoes',
            item_variant: item.colour,
            item_size: item.size,
          },
        ],
      },
    });

    setWarn('');
    navigate('/checkout');
  };

  const slug = `${prod.name.toLowerCase().replace(/\s+/g, '-')}`;

  /* ----- UI ----- */
  return (
    <div className="bg-[#F6F0E6] rounded-2xl p-6 flex flex-col gap-6">
      <Link to={`/products/${slug}`}>
        <div className="text-center  rounded-lg overflow-hidden">
          <img
            src={img}
            alt={prod.name}
            className="aspect-square object-contain  mx-auto "
          />
        </div>
      </Link>

      {/* title & colour picker */}
      <div className="flex items-center justify-between">
        <Link to={`/products/${slug}`}>
          <h1 className="text-2xl font-semibold">{prod.name}</h1>
        </Link>

        <div className="flex gap-2">
          {swatches.map(({ name, hex }) => (
            <button
              key={name}
              onClick={() => {
                setColourName(name);
                setWarn('');
              }}
              className="relative w-5 h-5 rounded-full border-2 cursor-pointer"
              style={{
                backgroundColor: hex,
                borderColor: colourName === name ? '#B2672A' : 'transparent',
              }}
              title={name}
            >
              {colourName === name && (
                <FaCheck className="absolute inset-0 m-auto text-[8px] text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed w-[60%] -mt-4">
        {prod.description}
      </p>

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
            className={`w-10 h-10 border rounded-sm transition cursor-pointer ${
              size === sz
                ? 'bg-[#B2672A] text-white border-[#B2672A]'
                : 'hover:bg-[#B2672A]/10'
            }`}
          >
            {sz}
          </button>
        ))}
      </div>

      {warn && <p className="text-red-600 text-xs -mb-3">{warn}</p>}

      {/* actions */}
      <div className="mt-auto flex flex-col sm:flex-row gap-2">
        {variantInCart ? (
          <>
            <Link
              to="/cart"
              className="flex-1 py-2 text-center  rounded-md hover:bg-[#ece3d6] bg-[#F7F0E6] border-[0.5px] border-[#713601] text-[#713601] shadow-inner"
            >
              View cart
            </Link>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-2  rounded-md hover:bg-[#713601]/90 cursor-pointer bg-[#713601] text-white"
            >
              Buy&nbsp;now
            </button>
          </>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full py-2 text-white rounded-md bg-[#B2672A] hover:bg-[#9E5522] "
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Offer;
