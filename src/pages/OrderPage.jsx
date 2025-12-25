import { useEffect } from "react";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { FaBoxOpen, FaCalendarAlt, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";

export default function OrderPage() {
  const { orders, fetchUserOrders } = useOrder();
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchUserOrders();
  }, [user]);

  const formatDate = (date) =>
    new Date(date).toLocaleString();

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Orders</h1>

      {!orders.length ? (
        <div className="text-center text-gray-500">
          <FaBoxOpen className="mx-auto text-4xl mb-3" />
          No orders yet
        </div>
      ) : (
        orders.map((order, idx) => (
          <div key={order._id} className="bg-white p-6 rounded shadow mb-6">
            <div className="mb-4">
              <p className="font-bold">Order #{orders.length - idx}</p>
              <p className="text-sm flex items-center gap-2">
                <FaCalendarAlt /> {formatDate(order.createdAt)}
              </p>
              <p>Status: {order.status}</p>
              <p className="font-bold">₹{order.total}</p>
            </div>

            <div className="mb-4 flex gap-2">
              <FaMapMarkerAlt />
              <div>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.pincode}</p>
              </div>
            </div>

            <div>
              {order.items.map((item) => (
                <div key={item._id} className="flex gap-3 mb-3">
                  <img
                    src={item.product.images?.[0]}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm">
                      ₹{item.product.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
