

const CATALOG_API_URL = process.env.CATALOG_API_URL || 'https://api.jikan.moe/v4/';

export async function GET(request: Request) {


    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 24;
    const query = searchParams.get('q') || '';

    const qParams = query ? `&q=${encodeURIComponent(query)}` : '';

    const url = `${CATALOG_API_URL}anime?page=${page}&limit=${limit}${qParams}`;


    try{
        const response = await fetch(url);

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: `Erreur côté API externe : ${response.status}` }),
                { status: response.status }
            )
        }

        const json = await response.json();

        const data = json.data ?? [];

        const pagination = json.pagination ?? {};
        const lastVisible = pagination.last_visible_page;
        const totalFromItems = pagination.items.total;

        const computedLast =
            lastVisible ??
            (totalFromItems ? Math.ceil(totalFromItems / limit) : 1);

        const hasNext =
            Boolean(pagination.has_next_page) ||
            page < computedLast;

        return Response.json({
            data,
            pagination: {
                page,
                limit,
                totalPage: lastVisible,
                totalItems : totalFromItems,
                hasNext
            }
        })

    }catch(error){
        return new Response(
            JSON.stringify({ error: "Erreur interne lors de l'appel Jikan" }),
            { status: 500 }
        );
    }

}