import AWS from "aws-sdk";
import axios from "axios";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

// Load environment variables
const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    ROLE_ARN,
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    REGION,
    SP_API_ENDPOINT
} = process.env;

// Configure AWS SDK
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION,
});

// Function to assume role and get temporary security credentials
export async function getAWSSecurityToken() {
    const client = new STSClient({ region: process.env.REGION });
    const params = {
        RoleArn: ROLE_ARN,
        RoleSessionName: "SPAPISession",
    };

    try {
        const command = new AssumeRoleCommand(params);
        const response = await client.send(command);
        return {
            accessKeyId: response.Credentials.AccessKeyId,
            secretAccessKey: response.Credentials.SecretAccessKey,
            sessionToken: response.Credentials.SessionToken,
        };
    } catch (error) {
        console.error("Error assuming role:", error);
        throw error;
    }
}

// Function to get SP-API Access Token
export async function getAccessToken() {
    const url = "https://api.amazon.com/auth/o2/token";
    const data = {
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    };

    try {
        const response = await axios.post(url, data, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
    }
}

// Function to fetch orders
export async function fetchOrders({ marketplaceId }) {
    await getAWSSecurityToken();
    const accessToken = await getAccessToken();

    const config = {
        headers: {
            "x-amz-access-token": accessToken,
            "Content-Type": "application/json",
            "x-amz-date": new Date().toISOString(),
        },
    };

    try {
        const response = await axios.get(
            `${SP_API_ENDPOINT}/orders/v0/orders?MarketplaceIds=${marketplaceId}&CreatedAfter=2012-01-01`,
            config
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error);
        throw error;
    }
}