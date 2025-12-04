import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import CartContextProvider from './contexts/CartContext.tsx';
import OrderContextProvider from './contexts/OrderContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CartContextProvider>
      <OrderContextProvider>
        <App />
      </OrderContextProvider>
    </CartContextProvider>
  </BrowserRouter>
);
