'use client';

import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface Order {
    orderId: string;
    buyerName: string;
    orderDate: string;
    totalAmount: number;
    status: string;
}

const ManageOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            const mockOrders: Order[] = [
                { orderId: "ORD123", buyerName: "John Doe", orderDate: "2024-11-20", totalAmount: 150.5, status: "Shipped" },
                { orderId: "ORD124", buyerName: "Jane Smith", orderDate: "2024-11-21", totalAmount: 300, status: "Processing" },
                { orderId: "ORD125", buyerName: "Alice Brown", orderDate: "2024-11-22", totalAmount: 500, status: "Delivered" },
            ];
            setOrders(mockOrders);
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(
        (order) =>
            order.orderId.includes(searchTerm) ||
            order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderDate.includes(searchTerm)
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
                                <th className="py-2 px-4 text-center">Buyer Name</th>
                                <th className="py-2 px-4 text-center">Order Date</th>
                                <th className="py-2 px-4 text-center">Total Amount</th>
                                <th className="py-2 px-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {filteredOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td className="py-2 text-center">{order.orderId}</td>
                                    <td className="py-2 text-center">{order.buyerName}</td>
                                    <td className="py-2 text-center">{order.orderDate}</td>
                                    <td className="py-2 text-center">${order.totalAmount.toFixed(2)}</td>
                                    <td className="py-2 text-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => {
                                                const updatedOrders = orders.map((o) =>
                                                    o.orderId === order.orderId ? { ...o, status: e.target.value } : o
                                                );
                                                setOrders(updatedOrders);
                                            }}
                                            className={`${
                                                order.status === "Shipped"
                                                    ? "bg-green-500"
                                                    : order.status === "Processing"
                                                    ? "bg-yellow-500"
                                                    : "bg-blue-500"
                                            } text-black rounded-md py-1 px-2 font-bold`}
                                        >
                                            <option value="Shipped" className="bg-green-500 font-bold">Shipped</option>
                                            <option value="Processing" className="bg-yellow-500 font-bold">Processing</option>
                                            <option value="Delivered" className="bg-blue-500 font-bold">Delivered</option>
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