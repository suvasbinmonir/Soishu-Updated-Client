import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaMinus, FaOpencart, FaPlus } from 'react-icons/fa';
import {
  updateQty,
  removeItem,
  clearDirectPurchase,
  selectCartItems,
  selectCartTotal,
} from '../../cartSlice';
import ScrollToTop from '../../Shared/ScrollToTop/ScrollToTop';
import { useLazyValidateCouponQuery } from '../../api/productsApi';
import { Minus, Plus, X } from 'lucide-react';

const COLORS = [
  { name: 'Master', value: '#B2672A' },
  { name: 'Chocolate', value: '#713500' },
  { name: 'Black', value: '#000000' },
  { name: 'Tan', hex: '#9D4304' },
  // Add other predefined colors here if needed
];
const COLOR_HEX = Object.fromEntries(COLORS.map((c) => [c.name, c.value]));
const DIRECT_KEY = 'directPurchase';

export const Cart = () => {
  const items = useSelector(selectCartItems);
  const grandTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [triggerValidateCoupon] = useLazyValidateCouponQuery();

  // ─── GTM: Push view_cart whenever items change ───
  useEffect(() => {
    if (items.length > 0 && window.dataLayer) {
      const products = items.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
        item_color: item.color,
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
              item_color: item.color,
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
        item_color: item.color,
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

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      return setCouponError('Please enter a coupon code.');
    }

    const productId = items?.[0]?._id; // assumes one product — can be expanded later
    if (!productId) {
      return setCouponError('No product in cart.');
    }

    try {
      const result = await triggerValidateCoupon({
        productId,
        couponCode,
      }).unwrap();
      if (result.success) {
        setDiscount(result.discountPercentage);
        setCouponError('');
      } else {
        setDiscount(0);
        setCouponError(result.message || 'Coupon invalid.');
      }
    } catch (err) {
      setDiscount(0);
      setCouponError(err?.data?.message || 'Error validating coupon.');
    }
  };

  if (!items.length) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col items-center justify-center border border-gray-300 p-10 rounded-2xl max-w-4xl w-full max-h-80 h-full">
          <div className="text-9xl text-[#099885]">
            <FaOpencart size={100} />
          </div>
          <h1 className="text-3xl font-semibold mt-2 text-[#495057]">
            Your cart is empty
          </h1>
        </div>
        <button
          className="mt-10 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 ">
      <div className="p-4 md:p-6 bg-[#f7f7f7] mt-40 rounded-xl">
        <ScrollToTop />
        <h2 className="text-2xl font-bold text-[#212529]">Your Cart</h2>

        <div className="max-w-[1400px] mx-auto mt-1 md:p-6 rounded-lg gap-14 flex flex-col md:flex-row justify-between">
          <div className="w-full">
            <div className="divide-y divide-gray-300 w-full">
              <div className="flex items-center text-[#212529] font-semibold">
                <div className="w-[50%] py-3">Product</div>
                <div className="w-[20%] py-3">Price</div>
                <div className="w-[15%] py-3">Quantity</div>
                <div className="w-[15%] py-3 text-right">Subtotal</div>
              </div>

              {items.map((item, idx) => {
                const unit = Number(item.price) || 0;
                const qty = Number(item.qty) || 1;
                const rowTotal = unit * qty;

                return (
                  <div
                    key={`${item._id}-${item.color}-${item.size}`}
                    className="py-5"
                  >
                    <div className="flex items-center w-full">
                      <div className="flex items-center gap-2 md:gap-4 w-[50%]">
                        <div>
                          <button
                            onClick={() => handleRemove(idx, item)}
                            className={`cursor-pointer bg-[#f06548] text-white rounded-full p-0.5 transition-opacity`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover bg-gray-100 rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-[#212529]">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 text-[#878a99] mt-1">
                              <p className="flex items-center gap-1 text-xs">
                                <span>কালার: </span>
                                <span>{item.color}</span>
                              </p>
                              <p className="flex items-center gap-1 text-xs">
                                <span>সাইজ: </span>
                                <span>{item.size}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <h1 className="pt-1 text-sm md:hidden block">
                          Tk.&nbsp;{rowTotal.toFixed(0)}
                        </h1>
                      </div>

                      <h2 className="w-[20%] text-[#212529]">{item.price}</h2>

                      <div className="md:flex items-center gap-4 hidden w-[15%]">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              dispatch(updateQty({ idx, delta: -1 }))
                            }
                            className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-200 cursor-pointer"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            value={qty ?? 0}
                            onChange={(e) => {
                              let val = e.target.value;

                              if (val.length > 1 && val.startsWith('0')) {
                                val = val.replace(/^0+(?=\d)/, '');
                              }
                            }}
                            className={`no-arrows w-14 text-center py-1 border-y border-gray-300 text-[#212529] outline-none bg-white`}
                          />
                          <button
                            onClick={() =>
                              dispatch(updateQty({ idx, delta: 1 }))
                            }
                            className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-200 cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <p className="w-[15%] text-right text-[#212529]">
                        {item.price * item.qty}
                      </p>
                    </div>

                    {/* ─── Mobile Layout ─── */}
                    <div className="md:hidden flex flex-col-reverse gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button
                            onClick={() =>
                              dispatch(updateQty({ idx, delta: -1 }))
                            }
                            className="h-5 px-2 border-r hover:bg-gray-100"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-5 text-center">{qty}</span>
                          <button
                            onClick={() =>
                              dispatch(updateQty({ idx, delta: 1 }))
                            }
                            className="h-5 px-2 border-l hover:bg-gray-100"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-end border-t border-gray-300">
              <div className="pt-4 flex items-center justify-between w-full text-[#212529] font-semibold">
                <p>Cart Total:</p>
                <p>Tk.&nbsp;{grandTotal.toFixed(0)}</p>
              </div>
              <Link to="/checkout">
                <button className="py-2.5 px-6 mt-4 md:w-96 w-full text-white rounded-md bg-[#099885] hover:bg-[#00846e] cursor-pointer">
                  অর্ডার করুন
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
