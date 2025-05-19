/* Cart.jsx */
import { useDispatch, useSelector } from 'react-redux';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { HiPlus, HiMinus } from 'react-icons/hi'; // ⟵ install @heroicons/react or swap any icons you like

import {
  updateQty,
  removeItem,
  clearCart,
  selectCartItems,
  selectCartTotal,
} from '../../cartSlice';
import { Link } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useState } from 'react';

const COLORS = [
  { name: 'Chocklate', hex: '#4F2D1D', imgIdx: 0 },
  { name: 'Tan', hex: '#9D4304', imgIdx: 2 },
];
const COLOR_HEX = Object.fromEntries(COLORS.map((c) => [c.name, c.hex]));

export const Cart = () => {
  /* read data from the slice */
  const [showCoupon, setShowCoupon] = useState(false);

  const items = useSelector(selectCartItems);
  const grandTotal = useSelector(selectCartTotal);

  const dispatch = useDispatch();

  /* ─── empty view ─── */
  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty 🛒</h1>
      </div>
    );
  }
  console.log(items);
  /* ─── cart table ─── */
  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-5xl mt-20 font-bold  "> Cart</h1>
      <div className="max-w-[1400px]  bg-white mx-auto mt-1 p-4 md:p-14  rounded-lg  gap-14 flex justify-between">
        <div className="divide-y w-[910px]  ">
          <div className="flex items-center justify-between  border-black/30 text-gray-600 font-semibold ">
            <div className="w-[20%]  py-3 border-black">Product</div>
            {/* <div className="w-[60%] border-r py-3 border-black text-center">
              Details
            </div> */}
            <div className="w-[20%]  py-3 text-right">Total</div>
          </div>
          {items.map((item, idx) => {
            const unit = Number(item.price) || 0;
            const qty = Number(item.qty) || 1;
            const rowTotal = unit * qty;

            return (
              <div
                key={`${item._id}-${item.colour}-${item.size}`}
                className="flex flex-col md:flex-row items-center justify-between border-black/30 py-5"
              >
                <div className="  flex items-center gap-4 justify-center">
                  <div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24  h-24 object-cover bg-gray-100 mx-auto rounded-md flex-shrink-0"
                    />
                  </div>
                  <div className="">
                    <p className="font-semibold  text-xl">{item.name}</p>
                    <p className="text-sm  text-black">
                      <p className="text-sm py-2 text-black flex items-center justify-center gap-2">
                        Color:
                        <span
                          className="inline-block h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: COLOR_HEX[item.colour] || '#ccc',
                          }}
                          title={item.colour} // keeps tooltip with the name
                        />
                        Size: {item.size}
                      </p>
                    </p>
                    {/* <p className="text-sm text-white bg-green-900 w-fit  p-1 px-2">
                      Unit&nbsp;Price: Tk.&nbsp;{unit.toFixed(0)}
                    </p> */}
                  </div>
                </div>

                <div>
                  <div className="text-center">
                    <div className="flex justify-center gap-4 pt-2">
                      <div className="flex items-center justify-center mt-2 gap-2 border border-black/30 overflow-hidden rounded w-fit mx-auto">
                        <button
                          onClick={() =>
                            dispatch(updateQty({ idx, delta: -1 }))
                          }
                          className="h-10 px-3 border-r cursor-pointer border-black/30 hover:bg-gray-100"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-8 text-center">{qty}</span>
                        <button
                          onClick={() => dispatch(updateQty({ idx, delta: 1 }))}
                          className="h-10 px-3 border-l cursor-pointer border-black/30  hover:bg-gray-100"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="  ">
                  <button
                    onClick={() => dispatch(removeItem(idx))}
                    className="p-2   bg-[#B2672A] px-2 rounded mt-2 mr-2 text-white cursor-pointer hover:text-black "
                  >
                    <RiDeleteBinLine />
                  </button>
                  Tk.&nbsp;{rowTotal.toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-between  pb-5 px-5 gap-4 w-[350px] bg-[#FAF8F2] rounded-2xl">
          {/* ─── heading + subtotal ─── */}
          <div>
            <h1 className="border-b border-black/30 py-3 text-left font-semibold">
              Order Summary
            </h1>

            <div className="flex justify-between pt-3 text-lg">
              <span>Subtotal:</span>
              <span>Tk.&nbsp;{grandTotal.toFixed(0)}</span>
            </div>

            {/* ─── add-coupon toggle row ─── */}
            <button
              type="button"
              // onClick={() => setShowCoupon((prev) => !prev)}
              className="mt-4 flex w-full items-center justify-between text-sm font-medium hover:text-[#B2672A] cursor-pointer"
            >
              <span>Add a coupon'</span>
              {/* <span className="border p-1 rounded-full">
                {' '}
                {showCoupon ? <HiMinus /> : <HiPlus />}
              </span> */}
            </button>

            {/* ─── coupon input (collapsible) ─── */}
            {showCoupon && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 rounded border px-3 py-2 text-sm outline-none"
                />
                <button className="whitespace-nowrap rounded bg-green-900 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* ─── checkout button ─── */}
          <Link
            to="/checkout"
            className="px-6 py-2 bg-[#B2672A] text-center text-white rounded hover:bg-[#9E5522]"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
