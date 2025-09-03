import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDirectPurchase,
  selectCartItems,
  clearCart,
  removeItem,
} from '../../cartSlice';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { useNavigate } from 'react-router-dom';
import * as address from '@bangladeshi/bangladesh-address';
import {
  usePurchaseProductMutation,
  useSendOrderEmailMutation,
} from '../../api/ordersApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useCheckFraudMutation } from '../../api/fraudApi';

const DIRECT_KEY = 'directPurchase';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shipping, setShipping] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressText, setAddressText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [zela, setZela] = useState('');

  useEffect(() => {
    if (!zela) return;

    const normalizedZela = zela.trim().toLowerCase();

    if (['dhaka', 'ঢাকা'].includes(normalizedZela)) {
      setShipping('inside');
    } else {
      setShipping('outside');
    }
  }, [zela]);
  const districts = address.allDistict();

  const shippingRates = {
    inside: 80,
    outside: 130,
  };

  const reduxDirect = useSelector(selectDirectPurchase);
  const cartItems = useSelector(selectCartItems);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const [purchaseProduct] = usePurchaseProductMutation();
  const [fraudCheck] = useCheckFraudMutation();
  const [sendOrderEmail] = useSendOrderEmailMutation();

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

  const shippingCost = shipping ? shippingRates[shipping] : 0;
  const grandTotal = total + shippingCost;

  // const sendCheckoutInitiatedEvent = () => {
  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push({
  //     event: 'purchase',
  //     user_info: {
  //       fullName,
  //       phone,
  //       zela,
  //       // upozila,
  //       addressText,
  //       shipping,
  //     },
  //     ecommerce: {
  //       currency: 'BDT',
  //       value: grandTotal,
  //       shipping: shippingCost,
  //       items: items.map((it) => ({
  //         item_id: `${it._id}-${it.color}`,
  //         item_name: it.name,
  //         item_brand: 'Soishu',
  //         item_category: it.title,
  //         price: it.price,
  //         quantity: it.qty,
  //         item_color: it.color,
  //         item_size: it.size,
  //       })),
  //     },
  //   });
  // };

  const handlePhoneChange = (e) => {
    let input = e.target.value;

    // Remove any +880 if pasted
    if (input.startsWith('+880')) {
      input = input.slice(4);
    }

    // Remove non-digit chars
    input = input.replace(/\D/g, '');

    // Remove leading 0
    if (input.startsWith('0')) {
      input = input.slice(1);
    }

    // Limit to 11 digits
    if (input.length > 10) {
      input = input.slice(0, 10);
    }

    setPhone(input);
    if (phoneError) setPhoneError('');
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (loading) return;

  //   const fullPhone = '0' + phone;
  //   const isValidPhone = /^01[3-9]\d{8}$/.test(fullPhone);

  //   if (phone.length !== 10) {
  //     setPhoneError('মোবাইল নাম্বার অবশ্যই ১১ সংখ্যার হতে হবে।');
  //     return;
  //   }

  //   if (!isValidPhone) {
  //     setPhoneError(
  //       'আপনার মোবাইল নাম্বারটি ‍সঠিক হয়নি, আপনি ‍সঠিক মোবাইল নাম্বার দিন।'
  //     );
  //     return;
  //   }

  //   setLoading(true);
  //   sendCheckoutInitiatedEvent();

  //   const purchasePayload = {
  //     recipient_name: fullName,
  //     recipient_phone: '0' + phone,
  //     recipient_email: '',
  //     recipient_address: `${zela}, ${addressText}`,
  //     note: '',
  //     shippingCost,
  //     items: items.map((it) => ({
  //       productId: it._id,
  //       product_color: it.color,
  //       product_size: it.size,
  //       total_lot: it.qty,
  //     })),
  //   };

  //   try {
  //     await purchaseProduct(purchasePayload).unwrap();

  //     sessionStorage.setItem(
  //       'orderSuccessData',
  //       JSON.stringify({
  //         fullName,
  //         phone: '0' + phone,
  //         zela,
  //         // upozila,
  //         addressText,
  //         shippingCost,
  //         subtotal: total.toFixed(0),
  //         grandTotal: grandTotal.toFixed(0),
  //         items,
  //       })
  //     );

  //     if (directItem) {
  //       sessionStorage.removeItem(DIRECT_KEY);
  //       // dispatch(clearDirectPurchase());
  //       dispatch(clearCart());
  //     } else {
  //       dispatch(clearCart());
  //     }

  //     navigate('/order-confirmed');
  //   } catch {
  //     toast.error('অর্ডার সম্পন্ন হয়নি। আবার চেষ্টা করুন।');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const fullPhone = '0' + phone;
    const isValidPhone = /^01[3-9]\d{8}$/.test(fullPhone);

    if (phone.length !== 10) {
      setPhoneError('মোবাইল নাম্বার অবশ্যই ১১ সংখ্যার হতে হবে।');
      return;
    }

    if (!isValidPhone) {
      setPhoneError(
        'আপনার মোবাইল নাম্বারটি ‍সঠিক হয়নি, আপনি ‍সঠিক মোবাইল নাম্বার দিন।'
      );
      return;
    }

    setLoading(true);
    // sendCheckoutInitiatedEvent();

    try {
      const response = await fraudCheck(fullPhone).unwrap();

      const purchasePayload = {
        recipient_name: fullName,
        recipient_phone: fullPhone,
        recipient_email: '',
        total_parcels: response.total_parcels,
        total_delivered: response.total_delivered,
        total_cancel: response.total_cancel,
        recipient_address: `${zela}, ${addressText}`,
        note: '',
        shippingCost,
        items: items.map((it) => ({
          productId: it._id,
          product_color: it.color,
          product_size: it.size,
          total_lot: it.qty,
        })),
      };

      // 1️⃣ Create order
      await purchaseProduct(purchasePayload).unwrap();

      // 2️⃣ Save success data
      sessionStorage.setItem(
        'orderSuccessData',
        JSON.stringify({
          fullName,
          phone: fullPhone,
          zela,
          addressText,
          shippingCost,
          subtotal: total.toFixed(0),
          grandTotal: grandTotal.toFixed(0),
          items,
        })
      );

      // 3️⃣ Clear cart
      dispatch(clearCart());
      if (directItem) sessionStorage.removeItem(DIRECT_KEY);

      // 4️⃣ Navigate first
      navigate('/order-confirmed');

      // 5️⃣ Trigger email in background (no need to await)
      sendOrderEmail({
        recipient_name: fullName,
        recipient_phone: fullPhone,
        items: items.map((it) => ({
          productId: it._id,
          product_color: it.color,
          product_size: it.size,
          total_lot: it.qty,
        })),
      }).catch((err) => {
        console.error('Email sending failed:', err);
      });
    } catch {
      toast.error('অর্ডার সম্পন্ন হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (idx) => {
    if (cartItems.length > 1) {
      dispatch(removeItem(idx));
    }
  };

  return (
    <div className="bg-[#f7f7f7]">
      <div className="max-w-[1440px] md:pt-6 mx-auto md:pb-16 min-h-screen px-4 pt-0 md:px-6 md:mt-24 mt-16">
        <ScrollToTop />
        <div className="mx-auto mt-10 flex lg:flex-row flex-col-reverse pb-10 pt-6 gap-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 lg:w-2/3 w-full order-2 md:order-1 bg-white p-4 md:p-6 rounded-xl h-fit static md:sticky md:top-32"
          >
            <h2 className="text-2xl font-bold mb-4 text-[#212529]">
              Delivery information
            </h2>

            <div>
              <h2 className="text-[#212529] mb-2">Name*</h2>

              <input
                required
                placeholder="আপনার নাম লিখুন"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border p-3 rounded border-gray-300 focus:outline-none placeholder:text-sm placeholder:text-[#878a99]"
              />
            </div>

            <div className="w-full">
              <h2 className="text-[#212529] mb-2">Phone Number*</h2>

              <label className="relative block w-full">
                <span className="absolute inset-y-0 left-0 text-sm flex items-center pl-3 text-[#878a99] select-none">
                  +880
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="1XXXXXXXXXX"
                  maxLength={11}
                  className={`pl-16 w-full border p-3 placeholder:text-sm placeholder:text-[#878a99] rounded focus:outline-none border-gray-300 ${
                    phoneError ? 'border-[#f06548]' : ''
                  }`}
                />
              </label>
            </div>

            {phoneError && (
              <p className="text-[#f06548] -mt-2 text-sm">{phoneError}</p>
            )}

            {/* ✅ Searchable district input field with dropdown */}
            <div className="w-full">
              <h2 className="text-[#212529] mb-2">District*</h2>
              <div className="relative w-full">
                <input
                  type="text"
                  value={zela}
                  onChange={(e) => {
                    const input = e.target.value;
                    setZela(input);
                    setShipping(null);
                    setSearchTerm(input);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    // Delay dropdown close to allow onClick on dropdown options
                    setTimeout(() => setIsFocused(false), 150);
                  }}
                  placeholder="সিটি নির্বাচন করুন"
                  className="w-full border p-3 rounded focus:outline-none placeholder:text-sm placeholder:text-[#878a99] border-gray-300"
                  required
                />

                {/* Only show dropdown if focused AND searchTerm has value */}
                {isFocused && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 mt-0 rounded shadow-lg max-h-64 overflow-y-auto">
                    {(() => {
                      const lowerSearch = (searchTerm || '').toLowerCase();

                      const filtered = districts.filter((d) =>
                        d.toLowerCase().startsWith(lowerSearch)
                      );

                      const dhakaMatch =
                        'dhaka'.startsWith(lowerSearch) &&
                        districts.includes('Dhaka');

                      const resultList = [];

                      // Push Dhaka first if it matches
                      if (dhakaMatch) {
                        resultList.push('Dhaka');
                      }

                      // Then push other results (excluding Dhaka)
                      resultList.push(...filtered.filter((d) => d !== 'Dhaka'));

                      return resultList.map((d) => (
                        <div
                          key={d}
                          onClick={() => {
                            setZela(d);
                            setSearchTerm('');
                          }}
                          className="px-4 py-2 hover:bg-[#f7f7f7] hover:text-[#212529] cursor-pointer"
                        >
                          {d}
                        </div>
                      ));
                    })()}

                    {districts.filter((d) =>
                      d.toLowerCase().startsWith(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-gray-500">
                        No district found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              <h2 className="text-[#212529] mb-2">Full Address*</h2>
              <textarea
                required
                rows={3}
                placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className="w-full border p-3 rounded focus:outline-none placeholder:text-sm placeholder:text-[#878a99] border-gray-300"
              />
            </div>

            {/* {shipping && (
              <div className="mt-2">
                <h3 className="font-semibold mb-3">Courier charge</h3>

                <div className="flex items-center gap-2 border border-[#B2672A] rounded-md p-3 cursor-default bg-white">
                  <MapPin
                    size={20}
                    strokeWidth={2}
                    className="text-[#B2672A] font-bold"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {shipping === 'inside'
                        ? `Inside Dhaka - ৳${shippingRates.inside}`
                        : `Outside Dhaka - ৳${shippingRates.outside}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {shipping === 'inside'
                        ? 'Estimated delivery in 2-3 business days'
                        : 'Estimated delivery in 3-4 business days'}
                    </p>
                  </div>
                </div>
              </div>
            )} */}

            <button
              type="submit"
              className="w-full py-3 text-white rounded-md bg-[#099885] hover:bg-[#00846e] cursor-pointer mt-4 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
            </button>
          </form>

          {/* 🛒 Order Summary */}
          <div className="lg:w-1/3 w-full order-1 md:order-2 p-4 md:p-6 border border-gray-300 h-fit rounded-xl">
            <h2 className="text-2xl font-bold pb-4 text-[#212529]">
              Your Cart
            </h2>

            <div className="space-y-4 divide-gray-300 rounded">
              {cartItems.map((it, idx) => (
                <div
                  key={`${it._id}-${it.color}-${it.size}`}
                  className="flex items-center gap-2"
                >
                  <div>
                    <button
                      onClick={() => handleRemove(idx)}
                      className={`${
                        cartItems.length > 1 ? 'bg-[#f06548]' : 'bg-[#878a99]'
                      } cursor-pointer text-white rounded-full p-0.5 transition-opacity`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between flex-1 gap-4">
                    <div className="flex gap-4 w-full">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-20 h-20 object-cover bg-gray-100 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#212529] md:text-base text-sm">
                          {it.name}
                        </p>
                        <div className="flex justify-between w-full">
                          <div className="flex md:flex-row flex-col md:items-center md:gap-2 text-[#878a99] mt-1">
                            <p className="flex items-center gap-1 text-xs">
                              <span>কালার: </span>
                              <span>{it.color}</span>
                            </p>
                            <p className="flex items-center gap-1 text-xs">
                              <span>সাইজ: </span>
                              <span>{it.size}</span>
                            </p>
                          </div>
                          <p className="text-lg font-semibold md:hidden items-center flex">
                            <span className="text-[#878a99]">{it.qty}</span>{' '}
                            <X size={16} className="text-[#878a99] ml-0.5" />{' '}
                            Tk.&nbsp;
                            {it.price}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-semibold md:flex items-center hidden">
                      <span className="text-[#878a99]">{it.qty}</span>{' '}
                      <X size={16} className="text-[#878a99] ml-0.5" />{' '}
                      Tk.&nbsp;
                      {it.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-300 pt-4 space-y-1 text-right text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium flex">
                  Tk.&nbsp;
                  {total.toFixed(0)}
                </span>
              </div>
              {shipping && (
                <div className="pb-[14px] flex justify-between">
                  <span>Courier charge:</span>
                  <span className="font-medium flex">
                    Tk.&nbsp;
                    {shippingCost}
                  </span>
                </div>
              )}
              <div className="text-xl font-bold border-t border-gray-300 pt-2 flex items-center justify-between">
                <span>Total:</span>
                <p className="flex">
                  Tk.&nbsp;
                  {grandTotal.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
