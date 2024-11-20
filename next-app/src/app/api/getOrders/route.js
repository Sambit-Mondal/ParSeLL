import fetch from 'node-fetch';
import credentials from './creds';

// Function to get the access token
async function getAccessToken() {
  try {
    const tokenResponse = await fetch('https://api.amazon.com/auth/o2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: credentials.refresh_token,
        client_id: credentials.lwa_app_id,
        client_secret: credentials.lwa_client_secret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorDetails = await tokenResponse.json();
      throw new Error(`Token API error: ${JSON.stringify(errorDetails)}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token; // Return the access token
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Failed to retrieve access token');
  }
}

// Function to fetch orders
async function getOrders(accessToken) {
  try {
    const endpoint = credentials.sp_api_endpoint;
    const marketplaceId = credentials.marketplace_id;

    // Query parameters
    const requestParams = {
      MarketplaceIds: marketplaceId,
      CreatedAfter: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    };

    // Build URL with query parameters
    const url = `${endpoint}/orders/v0/orders?${new URLSearchParams(requestParams)}`;

    const ordersResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!ordersResponse.ok) {
      const errorDetails = await ordersResponse.json();
      throw new Error(`Orders API error: ${JSON.stringify(errorDetails)}`);
    }

    return await ordersResponse.json(); // Return the orders data
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

// Main GET handler
export async function GET() {
  try {
    const accessToken = await getAccessToken(); // Fetch access token
    const ordersData = await getOrders(accessToken); // Fetch orders using the token

    return new Response(JSON.stringify(ordersData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}