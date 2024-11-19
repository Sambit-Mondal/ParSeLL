import { fetchOrders } from "@/services/spApi";

export async function GET(req) {
  const url = new URL(req.url);
  const marketplaceId = url.searchParams.get("marketplaceId");

  if (!marketplaceId) {
    return new Response(
      JSON.stringify({ error: "Missing marketplaceId parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const orders = await fetchOrders({ marketplaceId });
    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch orders" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}