export const fetchOrders = async (role: 'seller' | 'buyer', userId: string) => {
    const endpoint = role === 'seller' ? `/api/seller/orders` : `/api/buyer/orders/${userId}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
};