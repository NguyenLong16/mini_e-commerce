import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import CartContextProvider from './contexts/CartContext.tsx';
import OrderContextProvider from './contexts/OrderContext.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/stores/store.ts';
import { ToastProvider } from './contexts/ToastContext.tsx';
import 'antd/dist/reset.css';


createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <Provider store={store}>
      <BrowserRouter>
        <CartContextProvider>
          <OrderContextProvider>
            <App />
          </OrderContextProvider>
        </CartContextProvider>
      </BrowserRouter>
    </Provider>
  </ToastProvider>
);
