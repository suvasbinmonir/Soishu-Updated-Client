import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../Layout/Main';
import { Index } from '../Pages/Home';
import ProductDetails from '../Shared/Shop/ProductDetails';
import Cart from '../Pages/Cart/Cart';

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
    ],
  },
]);
