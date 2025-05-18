/* Cart.jsx */
import { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';

/* helpers */
const readCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const writeCart = (c) => localStorage.setItem('cart', JSON.stringify(c));

export const Cart = () => {
  const [cart, setCart] = useState(readCart());

  /* keep storage in-sync */
  useEffect(() => writeCart(cart), [cart]);

  /* ─── handlers ─── */
  const updateQty = (idx, delta) =>
    setCart((prev) => {
      const next = [...prev];
      /* make sure we’re dealing with a NUMBER  */
      const current = Number(next[idx].qty) || 1;
      next[idx].qty = Math.max(1, current + delta);
      return next;
    });

  const removeItem = (idx) =>
    setCart((prev) => prev.filter((_, i) => i !== idx));
  const clearCart = () => setCart([]);

  const grandTotal = cart.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1),
    0
  );

  /* ─── empty view ─── */
  if (!cart.length) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty 🛒</h1>
      </div>
    );
  }

  /* ─── cart table ─── */
  return (
    <div className="max-w-3xl mx-auto mt-12 p-4 md:p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="divide-y">
        {cart.map((item, idx) => (
          <div
            key={`${item._id}-${item.colour}-${item.size}`}
            className="flex flex-col md:flex-row items-center gap-4 py-4"
          >
            {/* thumbnail placeholder */}
            <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0" />

            {/* info */}
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                Colour: <span className="capitalize">{item.colour}</span> •
                Size: {item.size}
              </p>
            </div>

            {/* qty controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(idx, -1)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                <FaMinus size={12} />
              </button>
              <span className="w-8 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(idx, 1)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* remove */}
            <button
              onClick={() => removeItem(idx)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>

      {/* totals + actions */}
      <div className="border-t pt-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-lg font-semibold">
          Total:&nbsp;Tk.&nbsp;{grandTotal.toFixed(0)}
        </div>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Clear cart
          </button>
          <button className="px-6 py-2 bg-[#B2672A] text-white rounded hover:bg-[#9E5522]">
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
