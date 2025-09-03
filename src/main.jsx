import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/Router.jsx';
import { Provider } from 'react-redux';
import { store } from './store.js';
import { GTM } from './gtm/GTM.jsx';
import AuthProvider from './firebase/AuthProvider.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <AuthProvider>
      <GTM />{' '}
      <div className="bg-white">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </Provider>
);
