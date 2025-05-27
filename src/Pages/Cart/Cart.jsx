// /*  src/pages/Cart.jsx  */
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { FaMinus, FaPlus } from 'react-icons/fa';
// import { RiDeleteBinLine } from 'react-icons/ri';

// import {
//   updateQty,
//   removeItem,
//   clearDirectPurchase, // ⟵  NEW
//   selectCartItems,
//   selectCartTotal,
// } from '../../cartSlice';
// import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';

// const COLORS = [
//   { name: 'Chocklate', hex: '#4F2D1D' },
//   { name: 'tan', hex: '#9D4304' },
// ];
// const COLOR_HEX = Object.fromEntries(COLORS.map((c) => [c.name, c.hex]));
// const DIRECT_KEY = 'directPurchase'; // ⟵  same key used in Checkout

// export const Cart = () => {
//   const [showCoupon] = useState(false); // coupon kept but hidden
//   const items = useSelector(selectCartItems);
//   const grandTotal = useSelector(selectCartTotal);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   /* ─── empty cart view ─── */
//   if (!items.length) {
//     return (
//       <div className="max-w-xl mx-auto mt-20 text-center py-32">
//         <h1 className="text-3xl font-semibold">Your cart is empty 🛒</h1>
//       </div>
//     );
//   }

//   /* ─── proceed handler ─── */
//   const proceedToCheckout = () => {
//     /* clear any lingering Buy-Now variant */
//     dispatch(clearDirectPurchase());
//     sessionStorage.removeItem(DIRECT_KEY);

//     navigate('/checkout');
//   };

//   /* ─── cart table ─── */
//   return (
//     <div className="max-w-[1400px] mx-auto pb-20 ">
//       <ScrollToTop />
//       <h1 className="text-[35px] md:pt-40 pt-32 md:pb-10 font-bold">Cart</h1>

//       <div className="max-w-[1400px] bg-white mx-auto mt-1 p-4 md:p-14 rounded-lg gap-14 flex flex-col md:flex-row justify-between">
//         {/* ---------- left (items) ---------- */}
//         <div className="divide-y w-full  md:w-[910px]">
//           <div className="flex items-center justify-between text-gray-600 font-semibold">
//             <div className="w-[20%] py-3">Product</div>
//             <div className="w-[20%] py-3 text-right">Total</div>
//           </div>

//           {items.map((item, idx) => {
//             const unit = Number(item.price) || 0;
//             const qty = Number(item.qty) || 1;
//             const rowTotal = unit * qty;

//             return (
//               <div
//                 key={`${item._id}-${item.colour}-${item.size}`}
//                 className="flex  flex-row   md:items-center justify-between md:justify-between py-5"
//               >
//                 <div className="flex br items-center gap-2 md:gap-4">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="md:w-24 md:h-24 w-20 h-20 object-cover bg-gray-100 rounded-md"
//                   />
//                   <div>
//                     <p className="font-semibold text-base md:text-xl">
//                       {item.name}
//                     </p>
//                     <p className="text-[12px] md:text-sm flex items-center gap-2 pt-2">
//                       Color:
//                       <span
//                         className="inline-block h-3 md:h-4 w-3 md:w-4 rounded-full"
//                         style={{
//                           backgroundColor: COLOR_HEX[item.colour] || '#222',
//                         }}
//                         title={item.colour}
//                       />
//                       Size:&nbsp;{item.size}
//                     </p>
//                     <h1 className="pt-1 text-sm md:hidden block">
//                       {' '}
//                       Tk.&nbsp;{rowTotal.toFixed(0)}
//                     </h1>
//                   </div>
//                 </div>

//                 <div className="md:flex items-center gap-0 md:gap-4 hidden ">
//                   <div className="flex items-center gap-0 border rounded overflow-hidden">
//                     <button
//                       onClick={() => dispatch(updateQty({ idx, delta: -1 }))}
//                       className="h-5 md:h-10 px-1 md:px-3 border-r hover:bg-gray-100 cursor-pointer"
//                     >
//                       <FaMinus size={12} />
//                     </button>
//                     <span className="w-8 text-center">{qty}</span>
//                     <button
//                       onClick={() => dispatch(updateQty({ idx, delta: 1 }))}
//                       className=" h-5 md:h-10 px-1 md:px-3 border-l hover:bg-gray-100 cursor-pointer"
//                     >
//                       <FaPlus size={12} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="md:flex items-center gap-2 hidden ">
//                   <button
//                     onClick={() => dispatch(removeItem(idx))}
//                     className="p-2 bg-[#B2672A] text-white rounded hover:bg-[#713601] cursor-pointer"
//                   >
//                     <RiDeleteBinLine />
//                   </button>
//                   <p className="hidden md:block">
//                     {' '}
//                     Tk.&nbsp;{rowTotal.toFixed(0)}
//                   </p>
//                 </div>

//                 <div className="md:hidden flex flex-col-reverse gap-2 ">
//                   <div className="flex items-center gap-0 md:gap-4">
//                     <div className="flex items-center gap-0 border rounded overflow-hidden">
//                       <button
//                         onClick={() => dispatch(updateQty({ idx, delta: -1 }))}
//                         className="h-5 md:h-10 px-2 md:px-3 border-r hover:bg-gray-100 cursor-pointer"
//                       >
//                         <FaMinus size={12} />
//                       </button>
//                       <span className=" w-5 md:w-8 text-center">{qty}</span>
//                       <button
//                         onClick={() => dispatch(updateQty({ idx, delta: 1 }))}
//                         className=" h-5 md:h-10 px-2 md:px-3 border-l hover:bg-gray-100 cursor-pointer"
//                       >
//                         <FaPlus size={12} />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-end gap-2">
//                     <button
//                       onClick={() => dispatch(removeItem(idx))}
//                       className="p-2 bg-[#B2672A] text-white rounded hover:bg-[#713601] cursor-pointer"
//                     >
//                       <RiDeleteBinLine />
//                     </button>
//                     <p className="hidden md:block">
//                       {' '}
//                       Tk.&nbsp;{rowTotal.toFixed(0)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ---------- right (summary) ---------- */}
//         <div className="flex flex-col justify-between pb-5 px-5 gap-4 w-full md:w-[350px] bg-[#FAF8F2] rounded-xl">
//           <div>
//             <h1 className="border-b border-black/30 py-3 font-semibold">
//               Order Summary
//             </h1>
//             <div className="flex justify-between pt-3 text-lg">
//               <span>Subtotal:</span>
//               <span>Tk.&nbsp;{grandTotal.toFixed(0)}</span>
//             </div>
//             <div className="mt-4">
//               <h1 className="text-sm text-black pb-2">Add a coupon</h1>
//               <input
//                 type="text"
//                 name="coupon"
//                 placeholder="Enter your code"
//                 className="border outline-none px-4 h-10 rounded  placeholder:text-sm w-[60%]"
//                 id=""
//               />
//               <button className="border bg-[#713601] text-white px-3 h-10 ml-2 rounded">
//                 Apply
//               </button>
//             </div>
//           </div>

//           {/* checkout button */}
//           <div className="">
//             <div className="flex items-center justify-between border-t border-black/30  py-8">
//               <h1>Total: </h1>{' '}
//               <h1>
//                 {' '}
//                 <span>Tk.&nbsp;{grandTotal.toFixed(0)}</span>
//               </h1>
//             </div>
//             <button
//               onClick={proceedToCheckout}
//               className="px-6 py-2 bg-[#B2672A] text-white rounded hover:bg-[#9E5522]  w-[90%] mx-auto block cursor-pointer "
//             >
//               Checkout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';

import {
  updateQty,
  removeItem,
  clearDirectPurchase,
  selectCartItems,
  selectCartTotal,
} from '../../cartSlice';
import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';

const COLORS = [
  { name: 'Chocklate', hex: '#4F2D1D' },
  { name: 'tan', hex: '#9D4304' },
];
const COLOR_HEX = Object.fromEntries(COLORS.map((c) => [c.name, c.hex]));
const DIRECT_KEY = 'directPurchase';

export const Cart = () => {
  const [showCoupon] = useState(false);
  const items = useSelector(selectCartItems);
  const grandTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ─── GTM: Push view_cart whenever items change ───
  useEffect(() => {
    if (items.length > 0 && window.dataLayer) {
      const products = items.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
        item_color: item.colour,
        item_size: item.size,
      }));

      window.dataLayer.push({ ecommerce: null });

      window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
          currency: 'BDT',
          value: grandTotal,
          items: products,
        },
      });
    }
  }, [items, grandTotal]);

  const handleRemove = (idx, item) => {
    if (window.dataLayer) {
      window.dataLayer.push({ ecommerce: null });

      window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          currency: 'BDT',
          value: item.price * item.qty,
          items: [
            {
              item_id: item._id,
              item_name: item.name,
              price: item.price,
              quantity: item.qty,
              item_color: item.colour,
              item_size: item.size,
            },
          ],
        },
      });
    }

    dispatch(removeItem(idx));
  };

  const proceedToCheckout = () => {
    // ─── GTM: Push begin_checkout ───
    if (window.dataLayer && items.length > 0) {
      const products = items.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
        item_color: item.colour,
        item_size: item.size,
      }));

      window.dataLayer.push({ ecommerce: null });

      window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'BDT',
          value: grandTotal,
          items: products,
        },
      });
    }

    dispatch(clearDirectPurchase());
    sessionStorage.removeItem(DIRECT_KEY);
    navigate('/checkout');
  };

  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center py-32">
        <h1 className="text-3xl font-semibold">Your cart is empty 🛒</h1>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 ">
      <ScrollToTop />
      <h1 className="text-[35px] md:pt-40 pt-32 md:pb-10 font-bold">Cart</h1>

      <div className="max-w-[1400px] bg-white mx-auto mt-1 p-4 md:p-14 rounded-lg gap-14 flex flex-col md:flex-row justify-between">
        {/* ---------- left (items) ---------- */}
        <div className="divide-y w-full md:w-[910px]">
          <div className="flex items-center justify-between text-gray-600 font-semibold">
            <div className="w-[20%] py-3">Product</div>
            <div className="w-[20%] py-3 text-right">Total</div>
          </div>

          {items.map((item, idx) => {
            const unit = Number(item.price) || 0;
            const qty = Number(item.qty) || 1;
            const rowTotal = unit * qty;

            return (
              <div
                key={`${item._id}-${item.colour}-${item.size}`}
                className="flex flex-row md:items-center justify-between py-5"
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="md:w-24 md:h-24 w-20 h-20 object-cover bg-gray-100 rounded-md"
                  />
                  <div>
                    <p className="font-semibold text-base md:text-xl">
                      {item.name}
                    </p>
                    <p className="text-[12px] md:text-sm flex items-center gap-2 pt-2">
                      Color:
                      <span
                        className="inline-block h-3 md:h-4 w-3 md:w-4 rounded-full"
                        style={{
                          backgroundColor: COLOR_HEX[item.colour] || '#222',
                        }}
                        title={item.colour}
                      />
                      Size:&nbsp;{item.size}
                    </p>
                    <h1 className="pt-1 text-sm md:hidden block">
                      Tk.&nbsp;{rowTotal.toFixed(0)}
                    </h1>
                  </div>
                </div>

                <div className="md:flex items-center gap-4 hidden">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => dispatch(updateQty({ idx, delta: -1 }))}
                      className="h-10 px-3 border-r hover:bg-gray-100"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="w-8 text-center">{qty}</span>
                    <button
                      onClick={() => dispatch(updateQty({ idx, delta: 1 }))}
                      className="h-10 px-3 border-l hover:bg-gray-100"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>

                <div className="md:flex items-center gap-2 hidden">
                  <button
                    onClick={() => handleRemove(idx, item)}
                    className="p-2 bg-[#B2672A] text-white rounded hover:bg-[#713601]"
                  >
                    <RiDeleteBinLine />
                  </button>
                  <p>Tk.&nbsp;{rowTotal.toFixed(0)}</p>
                </div>

                {/* ─── Mobile Layout ─── */}
                <div className="md:hidden flex flex-col-reverse gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        onClick={() => dispatch(updateQty({ idx, delta: -1 }))}
                        className="h-5 px-2 border-r hover:bg-gray-100"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="w-5 text-center">{qty}</span>
                      <button
                        onClick={() => dispatch(updateQty({ idx, delta: 1 }))}
                        className="h-5 px-2 border-l hover:bg-gray-100"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRemove(idx, item)}
                      className="p-2 bg-[#B2672A] text-white rounded hover:bg-[#713601]"
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- right (summary) ---------- */}
        <div className="flex flex-col justify-between pb-5 px-5 gap-4 w-full md:w-[350px] bg-[#FAF8F2] rounded-xl">
          <div>
            <h1 className="border-b border-black/30 py-3 font-semibold">
              Order Summary
            </h1>
            <div className="flex justify-between pt-3 text-lg">
              <span>Subtotal:</span>
              <span>Tk.&nbsp;{grandTotal.toFixed(0)}</span>
            </div>
            <div className="mt-4">
              <h1 className="text-sm text-black pb-2">Add a coupon</h1>
              <input
                type="text"
                name="coupon"
                placeholder="Enter your code"
                className="border outline-none px-4 h-10 rounded placeholder:text-sm w-[60%]"
              />
              <button className="border bg-[#713601] text-white px-3 h-10 ml-2 rounded">
                Apply
              </button>
            </div>
          </div>

          <div className="">
            <div className="flex items-center justify-between border-t border-black/30 py-8">
              <h1>Total:</h1>
              <h1>Tk.&nbsp;{grandTotal.toFixed(0)}</h1>
            </div>
            <button
              onClick={proceedToCheckout}
              className="px-6 py-2 bg-[#B2672A] text-white rounded hover:bg-[#9E5522] w-[90%] mx-auto block"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
