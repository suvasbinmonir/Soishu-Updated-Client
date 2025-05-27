import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../Layout/Main';
import ProductDetails from '../Shared/Shop/ProductDetails';
import Cart from '../Pages/Cart/Cart';
import Checkout from '../Shared/Checkout/Checkout';
import { Index } from '../Pages/Home/Index';
import { TermsPage } from '../Pages/Terms/Terms';
import { Privacy } from '../Pages/Privecy/Privecy';
import Success from '../Pages/ScucessPage/SucessPage';

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
        path: '/products/:name',
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
      {
        path: '/terms-and-condition',
        element: <TermsPage />,
      },
      {
        path: '/privacy',
        element: <Privacy />,
      },
      {
        path: '/order-confirmed',
        element: <Success />,
      },
    ],
  },
]);
