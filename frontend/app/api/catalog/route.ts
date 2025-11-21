import { NextRequest, NextResponse } from "next/server";

const CATALOG_API_URL =
    process.env.CATALOG_API_URL || "https://api.jikan.moe/v4/";

export async function GET(request: NextRequest) {
    // 1. Récupérer searchParams proprement
    const searchParams = request.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 24;
    const query = searchParams.get("q") || "";

    // 2. Construire le qParam
    const qParams = query ? `&q=${encodeURIComponent(query)}` : "";

    // 3. Construire l’URL finale
    const url = `${CATALOG_API_URL}anime?page=${page}&limit=${limit}${qParams}`;

    try {
        // 4. Appel à l'API externe
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json(
                { error: `Erreur côté API externe : ${response.status}` },
                { status: response.status }
            );
        }

        // 5. Récupérer le JSON
        const json = await response.json();

        const data = json.data ?? [];
        const pagination = json.pagination ?? {};
        const lastVisible = pagination.last_visible_page;
        const totalFromItems = pagination.items?.total;

        // 6. Calcul du nombre total de pages
        const computedLast =
            lastVisible ??
            (totalFromItems ? Math.ceil(totalFromItems / limit) : 1);

        // 7. Déterminer s’il y a une page suivante
        const hasNext =
            Boolean(pagination.has_next_page) || page < computedLast;

        // 8. Retourner la réponse finale
        return NextResponse.json({
            data,
            pagination: {
                page,
                limit,
                totalPage: computedLast,
                totalItems: totalFromItems,
                hasNext,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Erreur interne lors de l'appel Jikan" },
            { status: 500 }
        );
    }
}
