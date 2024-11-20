import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    region: process.env.AWS_REGION!,
});

const s3 = new AWS.S3();

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.json();
    const { filename, fileType } = body;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `documents/${filename}`,
        Expires: 60,
        ContentType: fileType,
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        return NextResponse.json({ signedUrl }, { status: 200 });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return NextResponse.json({ message: 'Failed to generate upload URL' }, { status: 500 });
    }
}