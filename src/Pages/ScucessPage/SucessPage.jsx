import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLOR_HEX = {
  Chocklate: '#4F2D1D',
  tan: '#9D4304',
};

const Success = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('orderSuccessData');
    console.log(data, 'hi');
    if (data) {
      setOrder(JSON.parse(data));
      sessionStorage.removeItem('orderSuccessData'); // Optional: clear after loading
    } else {
      // navigate('/'); // Redirect if no data found
    }
  }, [navigate]);

  if (!order) return null;

  const {
    fullName,
    phone,
    address,
    shippingCost,
    subtotal,
    grandTotal,
    items,
  } = order;

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 text-center pt-28 md:pt-40">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Order Placed Successfully!
      </h1>
      <p className="mb-10 text-gray-600">
        Thank you for your purchase, <strong>{fullName}</strong>!
      </p>

      <div className="bg-white shadow-md rounded-lg p-6 text-left space-y-4">
        <div>
          <h2 className="font-semibold text-lg mb-2">Delivery Information</h2>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Items Purchased</h2>
          <ul className="divide-y divide-gray-200">
            {items.map((item, idx) => (
              <li key={idx} className="py-4 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} &nbsp; | &nbsp; Color:
                    <span
                      className="inline-block w-4 h-4 ml-1 rounded-full"
                      style={{
                        backgroundColor: COLOR_HEX[item.colour] || '#000',
                      }}
                    />
                  </p>
                </div>
                <p className="text-sm">
                  Tk. {item.price} × {item.qty}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-200 text-right space-y-1">
          <p>
            <strong>Subtotal:</strong> Tk. {subtotal}
          </p>
          <p>
            <strong>Shipping:</strong> Tk. {shippingCost}
          </p>
          <p className="text-xl font-bold text-amber-700">
            Grand Total: Tk. {grandTotal}
          </p>
        </div>
      </div>

      <button
        className="mt-10 px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Success;
