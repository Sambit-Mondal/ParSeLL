import { TranslateClient } from "@aws-sdk/client-translate";
import dotenv from "dotenv";

if (!process.env.NEXT_APP_AWS_ACCESS_KEY || !process.env.NEXT_APP_AWS_SECRET_KEY) {
  throw new Error("Missing AWS credentials");
}

const translateClient = new TranslateClient({
  region: process.env.NEXT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_APP_AWS_SECRET_KEY,
  },
});

export default translateClient;
