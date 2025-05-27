// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import emailjs from 'emailjs-com';

// import {
//   selectDirectPurchase,
//   selectCartItems,
//   selectCartTotal,
//   clearCart,
//   clearDirectPurchase,
// } from '../../cartSlice';
// import ScrollToTop from '../ScrollToTop/ScrollToTop';
// import { useNavigate } from 'react-router-dom';

// const COLORS = [
//   { name: 'Chocklate', hex: '#4F2D1D' },
//   { name: 'tan', hex: '#9D4304' },
// ];
// const COLOR_HEX = Object.fromEntries(COLORS.map((c) => [c.name, c.hex]));

// const DIRECT_KEY = 'directPurchase';

// const Checkout = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [shipping, setShipping] = useState('inside');
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');

//   const shippingRates = {
//     inside: 80,
//     outside: 130,
//   };

//   const reduxDirect = useSelector(selectDirectPurchase);
//   const cartItems = useSelector(selectCartItems);
//   const cartTotal = useSelector(selectCartTotal);

//   useEffect(() => {
//     if (reduxDirect) {
//       sessionStorage.setItem(DIRECT_KEY, JSON.stringify(reduxDirect));
//     }
//   }, [reduxDirect]);

//   const storedDirect =
//     !reduxDirect && sessionStorage.getItem(DIRECT_KEY)
//       ? JSON.parse(sessionStorage.getItem(DIRECT_KEY))
//       : null;

//   const directItem = reduxDirect || storedDirect;
//   const items = directItem ? [directItem] : cartItems;
//   const total = directItem
//     ? (Number(directItem.price) || 0) * (Number(directItem.qty) || 1)
//     : cartTotal;

//   const shippingCost = shippingRates[shipping];
//   const grandTotal = total + shippingCost;

//   // if (!items.length) {
//   //   navigate('/');
//   //   return null;
//   // }

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const templateParams = {
//       user_name: fullName,
//       user_phone: phone,
//       user_address: address,
//       shipping_cost: shippingCost,
//       subtotal: total.toFixed(0),
//       grand_total: grandTotal.toFixed(0),
//       product_list: items
//         .map(
//           (it) =>
//             `Name: ${it.name}, Size: ${it.size}, Color: ${it.colour}, Qty: ${it.qty}`
//         )
//         .join('\n'),
//     };

//     emailjs
//       .send(
//         'service_soishu',
//         'template_soishu',
//         templateParams,
//         'user_gt4irDh4mb3s75Q9ekHO6'
//       )
//       .then(
//         () => {
//           navigate('/order-confirmed');

//           // Store success data for Success page
//           sessionStorage.setItem(
//             'orderSuccessData',
//             JSON.stringify({
//               fullName,
//               phone,
//               address,
//               shippingCost,
//               subtotal: total.toFixed(0),
//               grandTotal: grandTotal.toFixed(0),
//               items,
//             })
//           );

//           // Clear cart or direct purchase
//           if (directItem) {
//             sessionStorage.removeItem(DIRECT_KEY);
//             dispatch(clearDirectPurchase());
//           } else {
//             dispatch(clearCart());
//           }
//         },
//         (error) => {
//           console.error('FAILED...', error);
//           alert('Failed to place order');
//         }
//       );
//   };

//   return (
//     <div className="max-w-[1400px] md:pt-32 mx-auto md:pb-16">
//       <ScrollToTop />
//       <div className="rounded-2xl md:px-14 md:py-20 pt-20 pb-10 bg-white mx-auto mt-10 grid md:grid-cols-2 gap-10">
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4 order-2 md:order-1 bg-[#FAF8F2] px-4 py-10 rounded-xl mx-2 h-fit static md:sticky md:top-32"
//         >
//           <h2 className="text-2xl font-bold mb-4">Delivery information</h2>

//           <input
//             required
//             placeholder="Full name"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="w-full border p-3 rounded border-black/30"
//           />
//           <input
//             required
//             type="tel"
//             placeholder="Phone"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full border p-3 rounded border-black/30"
//           />
//           <textarea
//             required
//             rows={4}
//             placeholder="Address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             className="w-full border p-3 rounded border-black/30"
//           />

//           <fieldset>
//             <legend className="text-lg font-semibold mb-3">
//               Shipping method
//             </legend>

//             <label
//               htmlFor="inside"
//               className="flex items-center justify-between px-5 py-4 rounded-t-lg border border-black/30 cursor-pointer transition
//                          peer-checked/inside:bg-amber-50 peer-checked/inside:border-amber-600 peer-checked/inside:text-amber-800"
//             >
//               <input
//                 type="radio"
//                 id="inside"
//                 name="shipping"
//                 value="inside"
//                 checked={shipping === 'inside'}
//                 onChange={() => setShipping('inside')}
//                 className="peer/inside sr-only"
//               />
//               <span
//                 className="relative h-5 w-5 mr-4 rounded-full before:content-[''] before:absolute before:inset-0 before:rounded-full
//                              before:border before:border-amber-600 peer-checked/inside:before:bg-amber-600"
//               />
//               <span className="flex-1">Inside Dhaka</span>
//               <span>৳80.00</span>
//             </label>

//             <label
//               htmlFor="outside"
//               className="flex items-center justify-between px-5 py-4 rounded-b-lg border border-t-0 border-black/30 cursor-pointer transition
//                          peer-checked/outside:border-amber-600 peer-checked/outside:text-amber-800"
//             >
//               <input
//                 type="radio"
//                 id="outside"
//                 name="shipping"
//                 value="outside"
//                 checked={shipping === 'outside'}
//                 onChange={() => setShipping('outside')}
//                 className="peer/outside sr-only"
//               />
//               <span
//                 className="relative h-5 w-5 mr-4 rounded-full before:content-[''] before:absolute before:inset-0 before:rounded-full
//                              before:border before:border-amber-600 peer-checked/outside:before:bg-amber-600"
//               />
//               <span className="flex-1">Outside Dhaka</span>
//               <span>৳130.00</span>
//             </label>
//           </fieldset>

//           <button
//             type="submit"
//             className="w-full py-3 bg-[#B2672A] text-white rounded hover:bg-[#9E5522] mt-4"
//           >
//             Place order
//           </button>
//         </form>

//         <div className="order-1 md:order-2 mx-4">
//           <h2 className="text-2xl font-bold border-b border-black/30 pb-4">
//             Order summary
//           </h2>

//           <div className="divide-y divide-black/30 rounded">
//             {items.map((it) => (
//               <div
//                 key={`${it._id}-${it.colour}-${it.size}`}
//                 className="p-4 flex gap-4"
//               >
//                 <img
//                   src={it.image}
//                   alt={it.name}
//                   className="w-20 h-20 object-cover bg-gray-100 rounded"
//                 />
//                 <div className="flex-1">
//                   <p className="font-medium">{it.name}</p>
//                   <p className="text-sm text-gray-500 flex gap-2 items-center pt-2">
//                     <span
//                       className="inline-block h-4 w-4 rounded-full"
//                       style={{
//                         backgroundColor: COLOR_HEX[it.colour] || '#222',
//                       }}
//                       title={it.colour}
//                     />
//                     {it.size}
//                   </p>
//                 </div>
//                 <p className="text-sm">
//                   Tk.&nbsp;{it.price} × {it.qty}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 border-t border-black/30 pt-4 space-y-1 text-right text-lg">
//             <div>
//               Subtotal:&nbsp;
//               <span className="font-medium">Tk.&nbsp;{total.toFixed(0)}</span>
//             </div>
//             <div className="pb-[14px]">
//               Courier charge:&nbsp;
//               <span className="font-medium">Tk.&nbsp;{shippingCost}</span>
//             </div>
//             <div className="text-xl font-bold border-t border-black/30 pt-2">
//               Grand Total:&nbsp;Tk.&nbsp;{grandTotal.toFixed(0)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import emailjs from 'emailjs-com';
import {
  selectDirectPurchase,
  selectCartItems,
  selectCartTotal,
  clearCart,
  clearDirectPurchase,
} from '../../cartSlice';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { useNavigate } from 'react-router-dom';

const COLORS = [
  { name: 'Chocklate', hex: '#4F2D1D' },
  { name: 'tan', hex: '#9D4304' },
];
const COLOR_HEX = Object.fromEntries(COLORS.map((c) => [c.name, c.hex]));

const DIRECT_KEY = 'directPurchase';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shipping, setShipping] = useState('inside');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const shippingRates = {
    inside: 80,
    outside: 130,
  };

  const reduxDirect = useSelector(selectDirectPurchase);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  useEffect(() => {
    if (reduxDirect) {
      sessionStorage.setItem(DIRECT_KEY, JSON.stringify(reduxDirect));
    }
  }, [reduxDirect]);

  const storedDirect =
    !reduxDirect && sessionStorage.getItem(DIRECT_KEY)
      ? JSON.parse(sessionStorage.getItem(DIRECT_KEY))
      : null;

  const directItem = reduxDirect || storedDirect;
  const items = directItem ? [directItem] : cartItems;
  const total = directItem
    ? (Number(directItem.price) || 0) * (Number(directItem.qty) || 1)
    : cartTotal;

  const shippingCost = shippingRates[shipping];
  const grandTotal = total + shippingCost;

  // 🟡 New: Fire GTM event before actual order
  const sendCheckoutInitiatedEvent = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      user_info: {
        fullName,
        phone,
        address,
        shipping,
      },
      ecommerce: {
        currency: 'BDT',
        value: grandTotal,
        shipping: shippingCost,
        items: items.map((it) => ({
          item_id: it._id,
          item_name: it.name,
          item_brand: 'Soishu',
          item_category: it.title,
          price: it.price,
          quantity: it.qty,
          item_color: it.colour,
          item_size: it.size,
        })),
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trigger GTM event (user submitted checkout info)
    sendCheckoutInitiatedEvent();

    const templateParams = {
      user_name: fullName,
      user_phone: phone,
      user_address: address,
      shipping_cost: shippingCost,
      subtotal: total.toFixed(0),
      grand_total: grandTotal.toFixed(0),
      product_list: items
        .map(
          (it) =>
            `Name: ${it.name}, Size: ${it.size}, Color: ${it.colour}, Qty: ${it.qty}`
        )
        .join('\n'),
    };

    emailjs
      .send(
        'service_soishu',
        'template_soishu',
        templateParams,
        'user_gt4irDh4mb3s75Q9ekHO6'
      )
      .then(
        () => {
          navigate('/order-confirmed');

          sessionStorage.setItem(
            'orderSuccessData',
            JSON.stringify({
              fullName,
              phone,
              address,
              shippingCost,
              subtotal: total.toFixed(0),
              grandTotal: grandTotal.toFixed(0),
              items,
            })
          );

          if (directItem) {
            sessionStorage.removeItem(DIRECT_KEY);
            dispatch(clearDirectPurchase());
          } else {
            dispatch(clearCart());
          }
        },
        (error) => {
          console.error('FAILED...', error);
          alert('Failed to place order');
        }
      );
  };

  return (
    <div className="max-w-[1400px] md:pt-32 mx-auto md:pb-16">
      <ScrollToTop />
      <div className="rounded-2xl md:px-14 md:py-20 pt-20 pb-10 bg-white mx-auto mt-10 grid md:grid-cols-2 gap-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 order-2 md:order-1 bg-[#FAF8F2] px-4 py-10 rounded-xl mx-2 h-fit static md:sticky md:top-32"
        >
          <h2 className="text-2xl font-bold mb-4">Delivery information</h2>

          <input
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-3 rounded border-black/30"
          />
          <input
            required
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-3 rounded border-black/30"
          />
          <textarea
            required
            rows={4}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-3 rounded border-black/30"
          />

          <fieldset>
            <legend className="text-lg font-semibold mb-3">
              Shipping method
            </legend>

            <label
              htmlFor="inside"
              className="flex items-center justify-between px-5 py-4 rounded-t-lg border border-black/30 cursor-pointer transition
                         peer-checked/inside:bg-amber-50 peer-checked/inside:border-amber-600 peer-checked/inside:text-amber-800"
            >
              <input
                type="radio"
                id="inside"
                name="shipping"
                value="inside"
                checked={shipping === 'inside'}
                onChange={() => setShipping('inside')}
                className="peer/inside sr-only"
              />
              <span
                className="relative h-5 w-5 mr-4 rounded-full before:content-[''] before:absolute before:inset-0 before:rounded-full
                             before:border before:border-amber-600 peer-checked/inside:before:bg-amber-600"
              />
              <span className="flex-1">Inside Dhaka</span>
              <span>৳80.00</span>
            </label>

            <label
              htmlFor="outside"
              className="flex items-center justify-between px-5 py-4 rounded-b-lg border border-t-0 border-black/30 cursor-pointer transition
                         peer-checked/outside:border-amber-600 peer-checked/outside:text-amber-800"
            >
              <input
                type="radio"
                id="outside"
                name="shipping"
                value="outside"
                checked={shipping === 'outside'}
                onChange={() => setShipping('outside')}
                className="peer/outside sr-only"
              />
              <span
                className="relative h-5 w-5 mr-4 rounded-full before:content-[''] before:absolute before:inset-0 before:rounded-full
                             before:border before:border-amber-600 peer-checked/outside:before:bg-amber-600"
              />
              <span className="flex-1">Outside Dhaka</span>
              <span>৳130.00</span>
            </label>
          </fieldset>

          <button
            type="submit"
            className="w-full py-3 bg-[#B2672A] text-white rounded hover:bg-[#9E5522] mt-4"
          >
            Place order
          </button>
        </form>

        <div className="order-1 md:order-2 mx-4">
          <h2 className="text-2xl font-bold border-b border-black/30 pb-4">
            Order summary
          </h2>

          <div className="divide-y divide-black/30 rounded">
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
                        backgroundColor: COLOR_HEX[it.colour] || '#222',
                      }}
                      title={it.colour}
                    />
                    {it.size}
                  </p>
                </div>
                <p className="text-sm">
                  Tk.&nbsp;{it.price} × {it.qty}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-black/30 pt-4 space-y-1 text-right text-lg">
            <div>
              Subtotal:&nbsp;
              <span className="font-medium">Tk.&nbsp;{total.toFixed(0)}</span>
            </div>
            <div className="pb-[14px]">
              Courier charge:&nbsp;
              <span className="font-medium">Tk.&nbsp;{shippingCost}</span>
            </div>
            <div className="text-xl font-bold border-t border-black/30 pt-2">
              Grand Total:&nbsp;Tk.&nbsp;{grandTotal.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
