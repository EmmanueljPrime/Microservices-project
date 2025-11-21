import { cookies } from 'next/headers'

const ANIME_SERVICE_URL = process.env.ANIME_SERVICE_URL || 'http://localhost:5000';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
     console.log('token : '+ token);
    if (!token) {
        return Response.json({ detail: 'unauthorized' }, { status: 401 });
    }

    try {
        console.log('Fetching animes from '+ANIME_SERVICE_URL+'/animes');
        const response = await fetch(`${ANIME_SERVICE_URL}/animes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('Fetching animes response');

        const data = await response.json().catch(() => ({}));
        return Response.json(data, { status: response.status });
    } catch {
        return Response.json({ detail: 'anime service unreachable' }, { status: 503 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return Response.json({ detail: 'unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const response = await fetch(`${process.env.ANIME_SERVICE_URL || 'http://localhost:5000/animes'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => ({}));
        return Response.json(data, { status: response.status });
    } catch {
        return Response.json({ detail: 'anime service unreachable' }, { status: 503 });
    }
}