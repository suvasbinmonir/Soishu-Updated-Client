import { createBrowserRouter } from 'react-router-dom';
import { Main } from '../Layout/Main';
import Cart from '../Pages/Cart/Cart';
import Checkout from '../Shared/Checkout/Checkout';
import { Index } from '../Pages/Home/Index';
import { TermsPage } from '../Pages/Terms/Terms';
import { Privacy } from '../Pages/Privecy/Privecy';
import Success from '../Pages/ScucessPage/SucessPage';
import ProductDetails from '../Shared/ProductDetails/ProductDetails';
import { Login } from '../Pages/LogIn/Login';
import DashboardLayout from '../Layout/DashboardLayout';
import SignUp from '../Pages/SignUp/SignUp';
import ProtectedRoute from './ProtectedRoute';
import Consignment from '../components/Consignment';
import OrderTable from '../components/OrderTable';
import AddProductForm from '../Pages/AddProductForm';
import UsersTable from '../Pages/Home/pages/Users/UsersTable';
import Dashboard from '../Pages/Dashboard/Dashboard';
import UiManagement from '../components/UiManagement';
import NotFoundPage from '../components/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <NotFoundPage />,
    children: [
      // PAGES
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      // {
      //   path: '/verify-otp',
      //   element: <VerifyOtp />,
      // },
      // {
      //   path: '/verify',
      //   element: <Verify />,
      // },
      {
        path: '/products/:name/:color?',
        element: <ProductDetails />,
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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['User', 'Moderator', 'Admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={['Moderator', 'Admin']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute allowedRoles={['Moderator', 'Admin']}>
            <Consignment />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: 'add-product',
      //   element: (
      //     <ProtectedRoute allowedRoles={['Admin']}>
      //       <AddProductForm />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: 'orders',
        element: (
          <ProtectedRoute allowedRoles={['Moderator', 'Admin']}>
            <OrderTable />
          </ProtectedRoute>
        ),
      },
      {
        path: 'frontend-management',
        element: (
          <ProtectedRoute allowedRoles={['Moderator', 'Admin']}>
            <UiManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={['Admin']}>
            <UsersTable />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
