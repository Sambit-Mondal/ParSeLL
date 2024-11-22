export const fetchDashboardData = async (role: 'seller' | 'buyer', userId: string) => {
    const endpoint = role === 'seller' ? `/api/seller/dashboard` : `/api/buyer/dashboard`;
    const response = await fetch(`${endpoint}?id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
};