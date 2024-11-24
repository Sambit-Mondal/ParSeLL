'use client';
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";

interface Order {
    orderId: string;
    productId: string;
    productName: string;
    buyerName: string;
    createdAt: string;
    quantity: number;
    status: string;
}

const ManageOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userData, setUserData] = useState({
        uniqueID: '',
        name: ''
    });

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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`/api/seller/orders?sellerID=${userData.uniqueID}`);
                if (response.data.success) {
                    setOrders(response.data.data);
                } else {
                    toast.error("Failed to fetch orders");
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast.error("Error fetching orders");
            }
        };

        if (userData.uniqueID) {
            fetchOrders();
        }
    }, [userData.uniqueID]);

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const response = await axios.patch(`/api/seller/orders`, { orderId, status });
            if (response.data.success) {
                toast.success("Order status updated successfully");
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderId === orderId ? { ...order, status } : order
                    )
                );
            } else {
                toast.error(response.data.message || "Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        }
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.productId.includes(searchTerm) ||
            order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.createdAt.includes(searchTerm) ||
            order.status.includes(searchTerm)
    );

    return (
        <div className="bg-background-theme w-full min-h-screen pt-12 px-10 pb-8 overflow-hidden overflow-y-auto">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <div className="font-extrabold text-4xl tracking-widest text-white">
                    Manage Your Orders
                </div>
                <div className="font-semibold text-xl tracking-wider text-blue-theme">
                    Monitor and manage your sales orders efficiently
                </div>
            </div>
            <div className="relative flex items-center border-2 mb-8 rounded-full border-blue-theme w-full">
                <input
                    type="text"
                    placeholder="Search Orders"
                    className="bg-black rounded-full py-3 px-10 text-sm text-white placeholder-gray-400 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-white" />
            </div>
            <div className="bg-navbar-bg backdrop-blur-lg border-2 border-blue-theme rounded-md py-2 px-5">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="font-extrabold border-b-2 border-blue-theme text-white">
                            <tr>
                                <th className="py-2 px-4 text-center">Order ID</th>
                                <th className="py-2 px-4 text-center">Product Name</th>
                                <th className="py-2 px-4 text-center">Buyer Name</th>
                                <th className="py-2 px-4 text-center">Order Date</th>
                                <th className="py-2 px-4 text-center">Quantity</th>
                                <th className="py-2 px-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {filteredOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td className="py-2 text-center">{order.productId}</td>
                                    <td className="py-2 text-center">{order.productName}</td>
                                    <td className="py-2 text-center">{order.buyerName}</td>
                                    <td className="py-2 text-center">{order.createdAt}</td>
                                    <td className="py-2 text-center">{order.quantity}</td>
                                    <td className="py-2 text-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                            className={`${order.status === "Shipped"
                                                ? "bg-green-500"
                                                : order.status === "Pending"
                                                    ? "bg-yellow-500"
                                                    : "bg-blue-500"
                                                } text-black rounded-md py-1 px-2 font-bold`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;