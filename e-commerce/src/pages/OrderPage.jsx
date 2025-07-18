import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import {useCart} from '../context/CartContext'; 

function Orders() {
  const [products, setProducts] = useState([]);
  const { wishlist, addToWishlist } = useWishlist();
  const { addToCart } = useCart();
 


  useEffect(() => {
    axios
      .get("http://localhost:3001/Products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("There is an error:", err));
  }, []);

  return (
    
    <h1>fgdb</h1>
     
  );
}

export default Orders;
