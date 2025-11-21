import { NextRequest, NextResponse } from 'next/server'
/**
 * A avoir dans le return :
 * Data anime : https://api.jikan.moe/v4/anime/1
 * character : https://api.jikan.moe/v4/anime/1/characters
 * statistics : https://api.jikan.moe/v4/anime/1/statistics
 */

const CATALOG_API_URL = process.env.CATALOG_API_URL || 'https://api.jikan.moe/v4/';

export async function GET(req: NextRequest, context: any) {

    const {id} = await context.params;

    const animeUrl =  `${CATALOG_API_URL}anime/${id}`;
    const characterUrl = `${CATALOG_API_URL}anime/${id}/characters`;
    const statisticsUrl = `${CATALOG_API_URL}anime/${id}/statistics`;

    try{
        const [animeRes, characterRes, statisticsRes] = await Promise.all([
            fetch(animeUrl),
            fetch(characterUrl),
            fetch(statisticsUrl)
        ]);

        if (!animeRes.ok || !characterRes.ok || !statisticsRes.ok) {
            return NextResponse.json({ detail: 'catalog service unreachable' }, { status: 503 });
        }

        const anime = await animeRes.json();
        const characters = await characterRes.json();
        const statistics = await statisticsRes.json();

        return NextResponse.json({
            anime: anime.data ?? null,
            characters: characters.data ?? null,
            statistics: statistics.data ?? null
        });
    }catch(err){
        return NextResponse.json(
            { error: "Erreur interne lors de la récupération des données" },
            { status: 500 }
        );
    }


}