import { useEffect } from "react";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { FaBoxOpen, FaCalendarAlt, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";

export default function OrderPage() {
  const { orders, fetchUserOrders } = useOrder();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      fetchUserOrders();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="bg-gradient-to-tr from-gray-100 to-gray-200 min-h-screen p-3 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-blue-800 mb-6 md:mb-10">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600 text-xl md:text-2xl font-medium">
            <FaBoxOpen className="mx-auto text-4xl md:text-5xl mb-4 text-blue-500" />
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4 md:space-y-8">
            {orders.map((order, index) => (
              <div
                key={order.id || index}
                className="bg-white shadow-md rounded-xl p-4 md:p-6 hover:shadow-lg transition"
              >
                {/* Order details */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Order #{orders.length - index}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />
                      {formatDate(order.createdAt)}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="font-semibold">
                        Status: <span className="capitalize">{order.status}</span>
                      </p>
                      <p className="text-lg font-bold">
                        Total: ₹{order.total?.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold">Shipping Address:</h3>
                          <p className="text-sm">
                            {order.shippingAddress?.name}, {order.shippingAddress?.phone}
                          </p>
                          <p className="text-sm">
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}
                          </p>
                          <p className="text-sm">
                            {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold mb-3">Order Items ({order.items?.length})</h3>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 object-contain rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm truncate">{item.title}</p>
                              <p className="text-xs text-gray-600">
                                ₹{item.price?.toLocaleString()} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}