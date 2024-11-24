'use client';
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
    productId: string;
    productName: string;
    price: number;
    quantityAvailable: number;
}

const ManageProducts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const [newProduct, setNewProduct] = useState<Product>({
        productId: "",
        productName: "",
        price: 0,
        quantityAvailable: 0,
    });

    // Fetch products from the API
    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            } else {
                toast.error("Failed to fetch products!", { position: "top-center" });
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Error fetching products!", { position: "top-center" });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add a new product
    const handleAddProduct = async () => {
        if (
            !newProduct.productId ||
            !newProduct.productName ||
            newProduct.price <= 0 ||
            newProduct.quantityAvailable < 0
        ) {
            toast.error("Please fill in all fields correctly!", { position: "top-center" });
            return;
        }

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Product added successfully!", { position: "top-center" });
                setNewProduct({ productId: "", productName: "", price: 0, quantityAvailable: 0 });
                setIsPopupOpen(false);
                fetchProducts();
            } else {
                toast.error("Failed to add product!", { position: "top-center" });
            }
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Error adding product!", { position: "top-center" });
        }
    };

    // Delete a product
    const handleDeleteProduct = async (productId: string) => {
        try {
            const response = await fetch("/api/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Product deleted successfully!", { position: "top-center" });
                fetchProducts();
            } else {
                toast.error("Failed to delete product!", { position: "top-center" });
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Error deleting product!", { position: "top-center" });
        }
    };

    const updateProduct = async (productId: string, field: keyof Product, value: string | number) => {
        // Clear the debounce timer if it exists
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // Set a new debounce timer
        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await fetch("/api/products", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId,
                        updates: { [field]: typeof value === "number" ? value : parseFloat(value) },
                    }),
                });
                const data = await response.json();

                if (data.success) {
                    toast.success("Product updated successfully!", { position: "top-center" });
                    fetchProducts(); // Fetch updated products to refresh the table
                } else {
                    toast.error("Failed to update product!", { position: "top-center" });
                }
            } catch (error) {
                console.error("Error updating product:", error);
                toast.error("Error updating product!", { position: "top-center" });
            }
        }, 500); // Delay execution by 500ms (adjust if needed)
    };

    return (
        <div className="bg-background-theme w-full min-h-screen pt-12 px-10 pb-8 overflow-hidden overflow-y-auto">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <div className="font-extrabold text-4xl tracking-widest text-white">
                    Manage Your Products
                </div>
                <div className="font-semibold text-xl tracking-wider text-blue-theme">
                    Add, edit, and manage your products seamlessly
                </div>
            </div>
            <div className="flex w-full items-center justify-between mb-8">
                <div className="relative flex items-center border-2 rounded-full border-blue-theme w-[80%]">
                    <input
                        type="text"
                        placeholder="Search Products"
                        className="bg-black rounded-full py-3 px-10 text-sm text-white placeholder-gray-400 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-white" />
                </div>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="flex items-center justify-center transition duration-150 ease-in-out gap-3 border-2 border-blue-theme hover:bg-blue-theme hover:text-black text-white py-2 px-4 rounded-full font-bold hover:bg-opacity-80"
                >
                    <PlusCircleIcon className="size-8" />
                    Add a New Product
                </button>
            </div>
            <div className="bg-navbar-bg backdrop-blur-lg border-2 border-blue-theme rounded-md py-2 px-5">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="font-extrabold border-b-2 border-blue-theme text-white">
                            <tr>
                                <th className="py-2 px-4 text-center">Product ID</th>
                                <th className="py-2 px-4 text-center">Product Name</th>
                                <th className="py-2 px-4 text-center">Price</th>
                                <th className="py-2 px-4 text-center">Quantity Available</th>
                                <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {products
                                .filter((product) =>
                                    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((product) => (
                                    <tr key={product.productId}>
                                        <td className="py-2 text-center">{product.productId}</td>
                                        <td className="py-2 text-center">{product.productName}</td>
                                        <td className="py-2 text-center">
                                            <input
                                                type="number"
                                                value={product.price}
                                                onChange={(e) =>
                                                    updateProduct(product.productId, "price", e.target.value)
                                                }
                                                className="bg-black text-white border-2 border-blue-theme rounded-md py-1 px-2 text-center"
                                            />
                                        </td>
                                        <td className="py-2 text-center">
                                            <input
                                                type="number"
                                                value={product.quantityAvailable}
                                                onChange={(e) =>
                                                    updateProduct(product.productId, "quantityAvailable", e.target.value)
                                                }
                                                className="bg-black text-white border-2 border-blue-theme rounded-md py-1 px-2 text-center"
                                            />
                                        </td>
                                        <td className="py-2 text-center">
                                            <button
                                                onClick={() => handleDeleteProduct(product.productId)}
                                                className="bg-red-500 text-white py-1 px-3 rounded-full font-bold hover:bg-opacity-80"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-400">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isPopupOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsPopupOpen(false);
                        }
                    }}
                >
                    <div className="bg-background-theme p-6 rounded-md border-2 border-blue-theme w-[33rem]">
                        <h3 className="text-white text-xl font-bold mb-4 text-center">Add New Product</h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Product ID"
                                value={newProduct.productId}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, productId: e.target.value })
                                }
                                className="bg-black text-white border-2 border-blue-theme rounded-md py-2 px-4"
                            />
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={newProduct.productName}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, productName: e.target.value })
                                }
                                className="bg-black text-white border-2 border-blue-theme rounded-md py-2 px-4"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                                }
                                className="bg-black text-white border-2 border-blue-theme rounded-md py-2 px-4"
                            />
                            <input
                                type="number"
                                placeholder="Quantity Available"
                                value={newProduct.quantityAvailable}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        quantityAvailable: parseInt(e.target.value),
                                    })
                                }
                                className="bg-black text-white border-2 border-blue-theme rounded-md py-2 px-4"
                            />
                            <button
                                onClick={handleAddProduct}
                                className="bg-blue-theme text-black font-bold py-2 px-4 rounded-full hover:bg-opacity-80"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ManageProducts;