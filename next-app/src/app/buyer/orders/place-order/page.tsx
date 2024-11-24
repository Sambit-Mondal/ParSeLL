'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";

interface Product {
  productId: string;
  productName: string;
  quantityAvailable: number;
  country: string;
  name: string;
  email: string;
  sellerID: string;
  price: number;
}

interface Order {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  name: string;
  buyerID: string;
  buyerCountry: string;
  email: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentDetails: {
    method: string;
    transactionId: string;
  };
}

const PlaceOrder = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderPopupVisible, setOrderPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [userData, setUserData] = useState({
    uniqueID: '',
    country: '',
    email: '',
    name: ''
  });

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/seller/products");
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        console.error("Failed to fetch products:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchUserData = async () => {
    const email = localStorage.getItem('user-email');

    if (!email) {
      toast.error('User email not found');
      return;
    }

    try {
      const response = await fetch(`/api/profile?email=${email}`);
      if (!response.ok) {
        throw new Error('Error fetching user data');
      }
      const data = await response.json();
      setUserData(data);
      console.log('Fetched user data:', data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setOrderPopupVisible(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) {
      toast.error("No product selected!", { position: "top-center" });
      return;
    }

    if (quantity < 1 || quantity > selectedProduct.quantityAvailable) {
      toast.error("Invalid quantity!", { position: "top-center" });
      return;
    }

    if (!userData) {
      toast.error("User data is not loaded yet!", { position: "top-center" });
      return;
    }

    // Stringify the shippingAddress object
    const shippingAddressString = JSON.stringify(shippingAddress);

    // Construct the complete order payload
    const payload = {
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      quantity,
      email: userData.email,
      buyerID: userData.uniqueID,
      name: userData.name,
      buyerCountry: userData.country,
      price: quantity * selectedProduct.price,
      shippingAddress: shippingAddressString,  // Send as string
      paymentDetails: {
        method: "Credit Card",
        transactionId: "TXN123456",
      },
    };

    console.log("Order Payload:", payload); // Debugging: check payload

    try {
      const response = await fetch(`/api/buyer/orders?email=${userData.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order placed successfully!", { position: "top-center" });
        setOrderPopupVisible(false);
        setSelectedProduct(null);
        setQuantity(1);
        setShippingAddress({
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        });
      } else {
        toast.error(data.message || "Failed to place order.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred while placing the order.", { position: "top-center" });
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
      const productName = product.productName ? product.productName.toLowerCase() : "";
      const productId = product.productId ? product.productId.toLowerCase() : "";
      const productNameAlt = product.name ? product.name.toLowerCase() : "";

      return (
        productName.includes(searchTerm.toLowerCase()) ||
        productId.includes(searchTerm.toLowerCase()) ||
        productNameAlt.includes(searchTerm.toLowerCase())
      );
    })
    : [];

  return (
    <div className="bg-background-theme w-full min-h-screen pt-12 px-10 pb-8">
      <div className="font-extrabold text-4xl text-white mb-6 text-center">
        Place New Order
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mb-8">
        <div className="relative flex items-center border-2 rounded-full border-blue-theme w-full">
          <input
            type="text"
            placeholder="Search Products"
            className="bg-black rounded-full py-3 px-10 text-sm text-white placeholder-gray-400 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-white" />
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
                  <td className="py-2 text-center">{product.name}</td>
                  <td className="py-2 text-center">{product.quantityAvailable}</td>
                  <td className="py-2 text-center">{product.country}</td>
                  <td className="py-2 text-center flex items-center justify-center gap-3">
                    <button
                      className="border-2 border-blue-theme text-white font-bold py-1 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                      onClick={() => handleOrderClick(product)}
                    >
                      Order
                    </button>
                    <ChatBubbleIcon className="h-6 w-6 text-blue-theme cursor-pointer" />
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

      {orderPopupVisible && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-background-theme border-2 border-blue-theme text-white p-6 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">Place Order</h2>
            <div className="flex items-center justify-between w-full">
              <p><strong>Product:</strong> {selectedProduct.productName}</p>
              <p><strong>Seller:</strong> {selectedProduct.name}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="mt-4">
                <label className="block font-bold">Quantity:</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-background-theme border-2 border-blue-theme"
                  value={quantity}
                  min={1}
                  max={selectedProduct.quantityAvailable}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="mt-4">
                <label className="block font-bold">Price:</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-background-theme border-2 border-blue-theme"
                  value={quantity * selectedProduct.price}
                  readOnly
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-bold">Shipping Address:</label>
              <input
                type="text"
                placeholder="Street"
                className="w-full p-2 rounded-md bg-background-theme border-2 border-blue-theme mb-2"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, street: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 rounded-md bg-background-theme border-2 border-blue-theme mb-2"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="State"
                className="w-full p-2 rounded-md bg-background-theme border-2 border-blue-theme mb-2"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, state: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Zip"
                className="w-full p-2 rounded-md bg-background-theme border-2 border-blue-theme mb-2"
                value={shippingAddress.zip}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, zip: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 rounded-md bg-background-theme border-2 border-blue-theme"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, country: e.target.value })
                }
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-background-theme border-2 border-blue-theme transition ease-in-out duration-150 hover:bg-gray-700 py-2 px-4 rounded-md"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
              <button
                className="bg-red-500 transition duration-150 ease-in-out hover:bg-red-800 py-2 px-4 rounded-md"
                onClick={() => setOrderPopupVisible(false)}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;