import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const db = await connectToDatabase();
      const productsCollection = db.collection("products");

      const products = await productsCollection.find({}).toArray();
      res.status(200).json(products);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}