import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLOR_HEX = {
  Master: '#B2672A',
  Chocolate: '#713500',
  Black: '#000000',
  Tan: '#9D4304',
};

const Success = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('orderSuccessData');
    if (data) {
      setOrder(JSON.parse(data));
      sessionStorage.removeItem('orderSuccessData');
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!order) return null;

  const { fullName, grandTotal, items } = order;

  return (
    <div className="max-w-3xl mx-auto py-20 text-center px-6 pt-28 md:pt-40">
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-left space-y-4">
        <div className="flex justify-center mb-4">
          <Check
            size={50}
            className="bg-[#099885] p-1.5 rounded-full text-white"
          />
        </div>
        <h1 className="md:text-3xl text-xl text-center font-bold text-[#099885] mb-4">
          Order Placed Successfully!
        </h1>
        <p className="mb-10 text-[#878a99] text-center">
          Thank you for your purchase, <strong>{fullName}</strong>!
        </p>
        <div>
          <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
          <div className="divide-y divide-gray-200">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 w-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover bg-gray-100 rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#212529] md:text-base text-sm">
                    {item.name}
                  </p>
                  <div className="flex justify-between w-full">
                    <div className="flex md:flex-row flex-col md:items-center md:gap-2 text-[#878a99] mt-1">
                      <p className="flex items-center gap-1 text-xs">
                        <span>কালার: </span>
                        <span>{item.color}</span>
                      </p>
                      <p className="flex items-center gap-1 text-xs">
                        <span>সাইজ: </span>
                        <span>{item.size}</span>
                      </p>
                    </div>
                    <p className="md:text-lg text-sm font-semibold items-center flex">
                      <span className="text-[#878a99]">{item.qty}</span>{' '}
                      <X size={16} className="text-[#878a99] ml-0.5" />{' '}
                      Tk.&nbsp;
                      {item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-gray-300 pt-4 md:text-xl text-lg font-bold flex items-center justify-between">
          <p className="text-xl font-bold">Total:</p>
          <p className="text-xl font-bold">Tk.&nbsp;{grandTotal}</p>
        </div>
      </div>

      <button
        className="mt-10 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Success;
