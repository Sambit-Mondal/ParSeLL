'use client';
import { useEffect, useState } from "react";

export default function OrdersPage() {
    interface Order {
        AmazonOrderId: string;
        PurchaseDate: string;
    }

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrders() {
          try {
            const response = await fetch(`/api/get-orders?marketplaceId=ATVPDKIKX0DER`);
            if (!response.ok) {
              throw new Error("Failed to fetch orders");
            }
            const data = await response.json();
            console.log("API Response:", data); // Debugging
            setOrders(data.orders.payload.Orders || []);
          } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Unknown error");
          } finally {
            setLoading(false);
          }
        }
      
        fetchOrders();
      }, []);      

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!orders.length) return <div>No orders found.</div>;

    return (
        <div>
            <h1>Orders</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.AmazonOrderId}>
                        Order ID: {order.AmazonOrderId} | Purchase Date: {order.PurchaseDate}
                    </li>
                ))}
            </ul>
        </div>
    );
}