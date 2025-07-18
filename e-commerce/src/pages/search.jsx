import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Search() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
 
  useEffect(() => {
    fetch('/products.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);

        const filtered = data.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setFilteredProducts([]);
      });
       
  }, [searchQuery]);

  return (
    <section className="py-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">
          Search Results for: <span className="text-blue-600">{searchQuery}</span>
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div key={index} className="bg-white p-4 shadow rounded">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-40 object-contain mb-2"
                />
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="text-gray-600">₹{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
