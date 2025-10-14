import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchOrders(), fetchUsers()]);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, statusFilter, sortOption]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid orders data");
      }
      setOrders(res.data.map(order => ({
        ...order,
        date: order.date || new Date().toISOString(),
        total: order.total || 0,
        status: order.status || "Placed"
      })));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid users data");
      }
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setUsers([]);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/orders/${id}`);
      toast.success("Order deleted");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];
    
    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    
    // Sort orders
    if (sortOption === "Date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "Total") {
      filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    }
    
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const getCountByStatus = (status) =>
    orders.filter((o) => o.status === status).length;

  const getUserEmail = (userId) => {
    if (!userId) return "Guest";
    const user = users.find((u) => u.id === userId);
    return user?.email || `User ${userId}`;
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Placed");
    setIsModalOpen(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      await axios.patch(`http://localhost:5000/orders/${selectedOrder.id}`, {
        status: newStatus,
      });
      toast.success("Order status updated");
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredOrders.length / ordersPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <section className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-blue-800 flex items-center gap-3">
            Manage Orders
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-lg text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-xl shadow-sm text-center border-l-4 border-yellow-400">
            <p className="text-lg text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{getCountByStatus("Placed")}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm text-center border-l-4 border-blue-400">
            <p className="text-lg text-gray-600">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">{getCountByStatus("Shipped")}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-sm text-center border-l-4 border-green-400">
            <p className="text-lg text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{getCountByStatus("Delivered")}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 p-5 bg-white rounded-xl shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-lg font-medium text-gray-700 mb-2">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block text-lg font-medium text-gray-700 mb-2">Sort By:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Default</option>
                <option value="Date">Date (Newest)</option>
                <option value="Total">Total Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xl text-gray-500">
                {orders.length === 0 ? "No orders found." : "No orders match the current filters."}
              </p>
            </div>
          ) : (
            <>
              <table className="min-w-full text-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-8 py-5 text-left">Order ID</th>
                    <th className="px-8 py-5 text-left">Customer</th>
                    <th className="px-8 py-5 text-left">Status</th>
                    <th className="px-8 py-5 text-left">Date</th>
                    <th className="px-8 py-5 text-left">Total</th>
                    <th className="px-8 py-5 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-medium text-gray-800">#{order.id}</td>
                      <td className="px-8 py-6 text-gray-600">{getUserEmail(order.userId)}</td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status || "Placed"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-gray-600">
                        {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-8 py-6 font-semibold">₹{(order.total || 0).toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openStatusModal(order)}
                            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow hover:shadow-md transition-all"
                            title="Update Status"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow hover:shadow-md transition-all"
                            title="Delete Order"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredOrders.length > ordersPerPage && (
                <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-gray-600">
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`p-3 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    
                    {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`w-12 h-12 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} border border-gray-200`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                      className={`p-3 rounded-lg ${currentPage === Math.ceil(filteredOrders.length / ordersPerPage) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Update Status Modal */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                  <Dialog.Title className="text-2xl font-bold mb-6 text-gray-800">
                    Update Order Status
                  </Dialog.Title>

                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">New Status:</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 text-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={updateOrderStatus}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-lg font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Update Status
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </section>
  );
}