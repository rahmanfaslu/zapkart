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

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <section className="min-h-screen bg-gray-50 px-4 md:px-10 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        My Orders
      </h1>

      {!orders.length ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
          <FaBoxOpen className="text-5xl mb-4" />
          <p className="text-lg font-medium">You haven’t placed any orders yet</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {orders.map((order, idx) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-gray-100">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{orders.length - idx}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt />
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    {order.status}
                  </span>
                  <p className="flex items-center gap-1 text-lg font-semibold text-gray-800">
                    <FaMoneyCheckAlt />
                    ₹{order.total}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 grid md:grid-cols-3 gap-6">
                {/* Address */}
                <div className="md:col-span-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Shipping Address
                  </h3>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.shippingAddress.name}
                      </p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>
                      <p>{order.shippingAddress.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Order Items
                  </h3>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                      >
                        <img
                          src={item.product.images?.[0]}
                          alt={item.product.title}
                          className="w-14 h-14 object-contain border rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{item.product.price} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-700">
                          ₹{item.product.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
