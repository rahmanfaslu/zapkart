// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import React from 'react';

// // Public & User Pages
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Cart from './pages/Cart';
// import ProductPage from './pages/ProductPage';
// import OrderPage from './pages/OrderPage';
// import Checkout from './pages/Checkout';
// import Wishlist from './pages/whishlist';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import { Toaster } from 'react-hot-toast';
// import { useAuth } from './context/AuthContext';

// // Admin Pages
// import AdminLayout from './admin/components/AdminLayout';
// import Dashboard from './admin/pages/Dashboard';
// import ManageProducts from './admin/pages/ManageProducts';
// import ManageUsers from './admin/pages/ManageUsers';
// import ManageOrders from './admin/pages/ManageOrders';

// // Private Route Component
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// // Admin Route Component
// const AdminRoute = ({ children }) => {
//   const { isAuthenticated, user } = useAuth();
//   const isAdmin = user?.role === 'admin';

//   return isAuthenticated && isAdmin ? children : <Navigate to="/login" />;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public + User Routes */}
//         <Route
//           path="*"
//           element={
//             <>
//               <Header />
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
//                 <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
//                 <Route path="/products" element={<ProductPage />} />
//                 <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
//                 <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
//               </Routes>
//               <Footer />
//             </>
//           }
//         />

//         {/* Admin Routes */}
//         <Route
//           path="/admin"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <Dashboard />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/products"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <ManageProducts />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/users"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <ManageUsers />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/orders"
//           element={
//             <AdminRoute>
//               <AdminLayout>
//                 <ManageOrders />
//               </AdminLayout>
//             </AdminRoute>
//           }
//         />
//       </Routes>

//       {/* Global Toasts */}
//       <Toaster position="top-center" reverseOrder={false} />
//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Cart from './pages/Cart';
import React from 'react';
import Header from './components/Header';
import Whishlist from './pages/whishlist ';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage'
import { useAuth } from './context/AuthContext';
import Checkout from './pages/Checkout' ;
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import NotFound from './pages/NotFound';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
 
function App() {
  return (
    
  <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={ <Register />} />
        <Route path="/cart" element={ <PrivateRoute> <Cart /></PrivateRoute>} />
        <Route path="/whishlist" element={ <PrivateRoute> <Whishlist /> </PrivateRoute>} />
        <Route path="/products" element={ <ProductPage/>} />
        <Route path="/order" element={ <PrivateRoute>  <OrderPage/> </PrivateRoute>} />
        <Route path="/checkout" element={ <PrivateRoute>  <Checkout/> </PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
                  <Toaster position="top-center" reverseOrder={false} />
      
      <Footer />
    </BrowserRouter>
    

    
  );
}

export default App;
