import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    region: process.env.AWS_REGION!,
});

const s3 = new AWS.S3();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ signedUrl: string } | { message: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { filename, fileType } = req.body;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `documents/${filename}`,
        Expires: 60,
        ContentType: fileType,
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        res.status(200).json({ signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ message: 'Failed to generate upload URL' });
    }
}