'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  productId: string;
  productName: string;
  sellerName: string;
  quantityAvailable: number;
  country: string;
}

const PlaceOrder = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch products in real-time
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaceOrder = async (product: Product) => {
    try {
      await axios.post("/api/orders", { productId: product.productId });
      setOrderSuccess(true);
      setSelectedProduct(product);
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="bg-background-theme w-full min-h-screen pt-12 px-10 pb-8">
      <div className="font-extrabold text-4xl text-white mb-6 text-center">
        Place New Order
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mb-8">
        <div className="relative flex items-center border-2 rounded-full border-blue-theme">
          <input
            type="text"
            placeholder="Search Products"
            className="bg-black rounded-full py-2 px-10 text-sm text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-navbar-bg backdrop-blur-lg border-2 border-blue-theme rounded-md py-2 px-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="font-extrabold border-b-2 border-blue-theme text-white">
              <tr>
                <th className="py-2 px-4 text-center">Product ID</th>
                <th className="py-2 px-4 text-center">Product Name</th>
                <th className="py-2 px-4 text-center">Seller Name</th>
                <th className="py-2 px-4 text-center">Quantity Available</th>
                <th className="py-2 px-4 text-center">Country</th>
                <th className="py-2 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {filteredProducts.map((product) => (
                <tr key={product.productId}>
                  <td className="py-2 text-center">{product.productId}</td>
                  <td className="py-2 text-center">{product.productName}</td>
                  <td className="py-2 text-center">{product.sellerName}</td>
                  <td className="py-2 text-center">{product.quantityAvailable}</td>
                  <td className="py-2 text-center">{product.country}</td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => handlePlaceOrder(product)}
                      className="bg-blue-theme text-white font-bold py-1 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {orderSuccess && selectedProduct && (
        <div className="text-green-500 mt-4 text-center">
          Order placed successfully for {selectedProduct.productName}!
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;