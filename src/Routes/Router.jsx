import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../Layout/Main';
import ProductDetails from '../Shared/Shop/ProductDetails';
import Cart from '../Pages/Cart/Cart';
import Checkout from '../Shared/Checkout/Checkout';
import { Index } from '../Pages/Home/Index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/product-details/:id/:name',
        element: <ProductDetails />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
    ],
  },
]);
