// frontend/app/explorer/[id]/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronLeft, ExternalLink, Play } from "lucide-react"

type AnimeDetail = {
    mal_id: number
    title: string
    images?: { webp?: { image_url?: string } }
    synopsis?: string
    score?: number
    episodes?: number
    type?: string
    duration?: string
    rating?: string
    aired?: { string?: string }
    genres?: { mal_id: number; name: string }[]
    studios?: { mal_id: number; name: string }[]
    trailer?: { url?: string }
    url?: string
}

export default function AnimeDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id
    const [anime, setAnime] = useState<AnimeDetail | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        const ac = new AbortController()
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, { signal: ac.signal })
                if (!res.ok) throw new Error(`Erreur ${res.status}`)
                const json = await res.json()
                const data = json.data ?? null
                setAnime(data)
            } catch (err: any) {
                if (err.name !== "AbortError") setError(err.message || "Erreur lors de la récupération")
            } finally {
                setLoading(false)
            }
        }
        load()
        return () => ac.abort()
    }, [id])

    if (!id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Identifiant manquant</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto py-8 px-4">
                <div className="mb-6">
                    <Button onClick={() => router.back()} variant="ghost" className="gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        Retour
                    </Button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {error && (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="pt-6">
                            <p className="text-destructive font-medium">Erreur: {error}</p>
                            <Button onClick={() => { setError(null); router.refresh() }} variant="outline" className="mt-4">
                                Réessayer
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {!loading && anime && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Poster + actions */}
                        <Card className="overflow-hidden">
                            <div className="aspect-[3/4] bg-muted">
                                {anime.images?.webp?.image_url ? (
                                    <img src={anime.images.webp.image_url} alt={anime.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-4xl">📺</span>
                                    </div>
                                )}
                            </div>
                            <CardContent className="space-y-3">
                                <h2 className="text-lg font-semibold">{anime.title}</h2>

                                <div className="flex gap-2 flex-wrap">
                                    <Badge>Type: {anime.type ?? "—"}</Badge>
                                    <Badge>Episodes: {anime.episodes ?? "—"}</Badge>
                                    <Badge>Score: {anime.score ?? "—"}</Badge>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    {anime.url && (
                                        <Button asChild>
                                            <a href={anime.url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                                                Voir sur MAL <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    )}

                                    {anime.trailer?.url && (
                                        <Button onClick={() => window.open(anime.trailer!.url, "_blank")} variant="outline" className="flex items-center gap-2">
                                            Bande-annonce <Play className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Détails */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{anime.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        <div><strong>Diffusion:</strong> {anime.aired?.string ?? "—"}</div>
                                        <div><strong>Durée:</strong> {anime.duration ?? "—"}</div>
                                        <div><strong>Rating:</strong> {anime.rating ?? "—"}</div>
                                        {anime.studios && anime.studios.length > 0 && (
                                            <div><strong>Studios:</strong> {anime.studios.map(s => s.name).join(", ")}</div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Genres</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {anime.genres?.map(g => (
                                                <Badge key={g.mal_id}>{g.name}</Badge>
                                            )) || <span className="text-sm text-muted-foreground">—</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Synopsis</h4>
                                        <p className="text-sm text-muted-foreground">{anime.synopsis ?? "Pas de description."}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
