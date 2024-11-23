'use client';

import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface Order {
    orderId: string;
    productName: string;
    orderDate: string;
    deliveryStatus: string;
    estimatedDelivery: string;
}

const TrackOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(
        (order) =>
            order.orderId.includes(searchTerm) ||
            order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderDate.includes(searchTerm)
    );

    return (
        <div className="bg-background-theme w-full min-h-screen pt-12 px-10 pb-8 overflow-hidden overflow-y-auto">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
                <div className="font-extrabold text-4xl tracking-widest text-white">
                    Track Your Orders
                </div>
                <div className="font-semibold text-xl tracking-wider text-blue-theme">
                    Keep an eye on your orders in real time
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mb-8">
                <div className="relative flex items-center border-2 rounded-full border-blue-theme">
                    <input
                        type="text"
                        placeholder="Search Orders"
                        className="bg-black rounded-full py-2 px-10 text-sm text-white placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-white" />
                </div>
                <Link href="/buyer/orders/place-order">
                    <button className="border-2 border-blue-theme text-white font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition duration-200 flex items-center justify-between gap-4">
                        <PlusCircleIcon className="size-8 text-white" />
                        Place New Order
                    </button>
                </Link>
            </div>
            <div className="bg-navbar-bg backdrop-blur-lg border-2 border-blue-theme rounded-md py-2 px-5">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="font-extrabold border-b-2 border-blue-theme text-white">
                            <tr>
                                <th className="py-2 px-4 text-center">Order ID</th>
                                <th className="py-2 px-4 text-center">Product</th>
                                <th className="py-2 px-4 text-center">Order Date</th>
                                <th className="py-2 px-4 text-center">Delivery Status</th>
                                <th className="py-2 px-4 text-center">Estimated Delivery</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {filteredOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td className="py-2 text-center">{order.orderId}</td>
                                    <td className="py-2 text-center">{order.productName}</td>
                                    <td className="py-2 text-center">{order.orderDate}</td>
                                    <td className="py-2 text-center">{order.deliveryStatus}</td>
                                    <td className="py-2 text-center">{order.estimatedDelivery}</td>
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

export default TrackOrders;