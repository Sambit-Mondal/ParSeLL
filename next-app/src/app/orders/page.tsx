'use client';
import { useEffect, useState } from 'react';

export default function Orders() {
  interface Order {
    AmazonOrderId: string;
    PurchaseDate: string;
    OrderStatus: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/getOrders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Orders</h1>
      {orders && orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.AmazonOrderId}>
              <strong>Order ID:</strong> {order.AmazonOrderId}
              <br />
              <strong>Order Date:</strong> {order.PurchaseDate}
              <br />
              <strong>Status:</strong> {order.OrderStatus}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}