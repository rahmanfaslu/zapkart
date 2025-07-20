import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import {CartProvider} from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WishlistProvider>
        <CartProvider>
       <AuthProvider>
        <OrderProvider>
        <App />
        </OrderProvider>
        
      </AuthProvider>
      </CartProvider>
    </WishlistProvider>   
  </StrictMode>,
)
