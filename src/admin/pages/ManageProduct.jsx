import React, { useEffect, useRef, useState, Fragment } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    originalPrice: "",
    onSale: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); 
  const nameInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const { title, price, category, image } = formData;

    if (!title || !price || !category || !image) {
      toast.error("Please fill all required fields");
      return;
    }

    const isDuplicate = products.some(
      (p) =>
        p.title.toLowerCase() === title.toLowerCase() &&
        p.id !== editingId
    );
    if (isDuplicate) {
      toast.error("Duplicate product title");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/Products/${editingId}`, formData);
        toast.success("Product updated");
      } else {
        const newId = Math.max(...products.map(p => parseInt(p.id)), 0) + 1;
        await axios.post("http://localhost:5000/Products", {
          ...formData,
          id: newId.toString()
        });
        toast.success("Product added");
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error("Error saving product");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      category: "",
      image: "",
      originalPrice: "",
      onSale: false,
    });
    setEditingId(null);
    setIsOpen(false);
  };

  const editProduct = (product) => {
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      originalPrice: product.originalPrice || "",
      onSale: product.onSale || false,
    });
    setEditingId(product.id);
    setIsOpen(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/Products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  // Pagination
  const categories = [...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter(
    (p) => filterCategory === "All" || p.category === filterCategory
  );
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-blue-800 flex items-center gap-3">
          Manage Products
          </h1>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg shadow-md hover:shadow-lg transition-all"
          >
            <FaPlus size={18} /> Add Product
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 p-5 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-lg text-gray-700">Filter by Category:</label>
            <select
              className="border-2 rounded-lg p-3 text-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1); 
              }}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full text-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-8 py-5 text-left">Image</th>
                <th className="px-8 py-5 text-left">Name</th>
                <th className="px-8 py-5 text-left">Price</th>
                <th className="px-8 py-5 text-left">Category</th>
                <th className="px-8 py-5 text-left">On Sale</th>
                <th className="px-8 py-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-800">{product.title}</td>
                    <td className="px-8 py-6">
                      <span className="font-semibold">₹{product.price}</span>
                      {product.onSale && product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-gray-600">{product.category}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.onSale ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.onSale ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button
                          onClick={() => editProduct(product)}
                          className="bg-yellow-400 hover:bg-yellow-500 p-3 text-white rounded-lg shadow hover:shadow-md transition-all"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 hover:bg-red-600 p-3 text-white rounded-lg shadow hover:shadow-md transition-all"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center text-gray-500 text-xl">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
              <div className="text-gray-600">
                Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <FaChevronLeft size={16} />
                </button>
                
                {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
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
                  disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                  className={`p-3 rounded-lg ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <FaChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
                  <Dialog.Title className="text-2xl font-bold mb-6 text-gray-800">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </Dialog.Title>

                  <form onSubmit={handleAddOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Product Title *</label>
                      <input
                        name="title"
                        type="text"
                        className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.title}
                        onChange={handleInput}
                        ref={nameInputRef}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Price *</label>
                      <input
                        name="price"
                        type="number"
                        className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.price}
                        onChange={handleInput}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Original Price</label>
                      <input
                        name="originalPrice"
                        type="number"
                        className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.originalPrice}
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        name="category"
                        className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.category}
                        onChange={handleInput}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div> 
                    <div className="md:col-span-2">
                      <label className="block text-lg font-medium text-gray-700 mb-2">Image URL *</label>
                      <input
                        name="image"
                        type="url"
                        className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.image}
                        onChange={handleInput}
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        name="onSale"
                        type="checkbox"
                        className="w-5 h-5 mr-3 rounded focus:ring-blue-500"
                        checked={formData.onSale}
                        onChange={handleInput}
                      />
                      <label className="text-lg text-gray-700">On Sale</label>
                    </div>
                  </form>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 text-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleAddOrUpdate}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-lg font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      {editingId ? "Update Product" : "Add Product"}
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