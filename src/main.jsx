import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/Router.jsx';
import { Provider } from 'react-redux';
import { store } from './store.js';
import { GTM } from './gtm/GTM.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <GTM />{' '}
    <div className="bg-[#faf8f2]">
      <RouterProvider router={router} />
    </div>
  </Provider>
  // </StrictMode>
);
