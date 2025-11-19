import { cookies } from 'next/headers'


/**
 * API Gateway – Animes
 * - GET : récupère les animes depuis l'api publique
 */
export async function GET(){
    const cookieStore = await cookies();
    const token = cookieStore.get('acces_token')?.value;

    if (!token) {
        return Response.json({ detail: 'unauthorized'}, {status: 401});
    }

    try {
        const r = await fetch(
            `https://api.jikan.moe/v4/anime`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const json = await r.json().catch(() => ({}));
        return Response.json(json, { status: r.status });
    } catch {
        return Response.json({ detail: 'animeList service unreachable'}, {status: 503});
    }
}