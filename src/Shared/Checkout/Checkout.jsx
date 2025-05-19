/*  src/pages/Checkout.jsx  */
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDirectPurchase,
  selectCartItems,
  selectCartTotal,
  clearCart,
  clearDirectPurchase,
} from '../../cartSlice';

const COLORS = [
  { name: 'Chocklate', hex: '#4F2D1D', imgIdx: 0 },
  { name: 'Tan', hex: '#9D4304', imgIdx: 2 },
];
const COLOR_HEX = Object.fromEntries(COLORS.map((c) => [c.name, c.hex]));
const Checkout = () => {
  /* ----- data selectors ----- */
  const directItem = useSelector(selectDirectPurchase); // object | null
  const cartItems = useSelector(selectCartItems); // array
  const cartTotal = useSelector(selectCartTotal); // number

  /* decide which list we’re showing */
  const items = directItem ? [directItem] : cartItems;
  const total = directItem
    ? (Number(directItem.price) || 0) * (Number(directItem.qty) || 1)
    : cartTotal;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* redirect if accidentally landed here with nothing to pay for */
  if (!items.length) {
    navigate('/'); // or '/shop'
    return null;
  }

  /* ---- submit handler ---- */
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔒 here you would POST the order to your backend

    alert('Order placed! (Cash on Delivery)');

    /* clear state */
    if (directItem) {
      dispatch(clearDirectPurchase());
    } else {
      dispatch(clearCart());
    }
    navigate('/'); // back to home after order
  };

  /* ----- component ----- */
  return (
    <div className="max-w-[1400px]  rounded-2xl px-14 py-10 bg-white mx-auto mt-10 grid md:grid-cols-2 gap-10">
      {/* ─── delivery form ─── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Delivery information</h2>

        <input
          required
          placeholder="Full name"
          className="w-full border p-3 rounded border-black/30"
        />
        <input
          required
          type="tel"
          placeholder="Phone"
          className="w-full border p-3 rounded border-black/30"
        />
        <textarea
          required
          rows={4}
          placeholder="Address"
          className="w-full border p-3 rounded border-black/30"
        />

        {/* payment method (only COD for now) */}
        {/* ─── Shipping / payment method ─── */}
        <fieldset>
          <legend className="text-lg font-semibold mb-3">
            Shipping method
          </legend>

          {/* ─── Inside Dhaka ─── */}
          <label
            htmlFor="inside"
            className="
      flex items-center justify-between px-5 py-4 rounded-t-lg border-black/30 border cursor-pointer transition
      peer-checked/inside:bg-amber-50  peer-checked/inside:border-amber-600
      peer-checked/inside:text-amber-800           /* <- text color change */
    "
          >
            <input
              type="radio"
              id="inside"
              name="shipping"
              value="inside"
              defaultChecked
              className="peer/inside sr-only"
            />

            {/* custom bullet */}
            <span
              className="
        relative h-5 w-5 mr-4 rounded-full
        before:content-[''] before:absolute before:inset-0 before:rounded-full
        before:border before:border-amber-600
        peer-checked/inside:before:bg-amber-600
      "
            />

            {/* text container gets the color via peer-checked utility above */}
            <span className="flex-1">Inside Dhaka</span>
            <span>৳80.00</span>
          </label>

          <label
            htmlFor="outside"
            className="
      flex items-center justify-between px-5 py-4 rounded-b-lg border border-t-0 cursor-pointer transition border-black/30
       peer-checked/outside:border-amber-600
      peer-checked/outside:text-amber-800   peer-checked/outside:bg-black   
    "
          >
            <input
              type="radio"
              id="outside"
              name="shipping"
              value="outside"
              className="peer/outside sr-only "
            />
            <span
              className="
        relative h-5 w-5 mr-4 rounded-full
        before:content-[''] before:absolute before:inset-0 before:rounded-full
        before:border before:border-amber-600
        peer-checked/outside:before:bg-amber-600
      "
            />
            <span className="flex-1">Outside Dhaka</span>
            <span>৳130.00</span>
          </label>
        </fieldset>

        <button
          type="submit"
          className="w-full py-3 bg-[#B2672A] text-white rounded hover:bg-[#9E5522]"
        >
          Place order
        </button>
      </form>

      {/* ─── order summary ─── */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Order summary</h2>

        <div className="divide-y divide-black/30  rounded">
          {items.map((it) => (
            <div
              key={`${it._id}-${it.colour}-${it.size}`}
              className="p-4 flex gap-4"
            >
              <img
                src={it.image}
                alt={it.name}
                className="w-20 h-20 object-cover bg-gray-100 rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{it.name}</p>

                <p className="text-sm text-gray-500 flex gap-2 items-center pt-2">
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: COLOR_HEX[it.colour],
                    }}
                    title={it.colour} // keeps tooltip with the name
                  />{' '}
                  {it.size}
                </p>
              </div>
              <p className="text-sm">
                Tk.&nbsp;{it.price} × {it.qty}
              </p>
            </div>
          ))}
        </div>

        <div className="text-right font-semibold text-xl mt-4 border-t border-black/30 pt-2">
          Grand total:&nbsp;Tk.&nbsp;{total.toFixed(0)}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
