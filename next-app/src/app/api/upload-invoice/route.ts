import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post('http://localhost:8000/upload-invoice/', req, {
                headers: {
                    'Content-Type': req.headers.get('content-type') || '',
                },
            });

            return NextResponse.json(response.data, { status: 200 });
        } catch (error) {
            const err = error as any;
            return NextResponse.json(err.response.data, { status: err.response.status || 500 });
        }
    } else {
        res.headers.set('Allow', 'POST');
        return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
    }
}