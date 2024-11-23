import { TranslateClient } from "@aws-sdk/client-translate";
import dotenv from "dotenv";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS credentials");
}

const translateClient = new TranslateClient({
  region: "ap-south-1", // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default translateClient;
