"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

type Anime = {
    mal_id: number
    title: string
    score?: number
    images?: { webp?: { image_url?: string } }
    synopsis?: string
}

export default function ExplorePage() {
    const router = useRouter()
    const [animes, setAnimes] = useState<Anime[]>([])
    const [totalPage, setTotalPage] = useState<number>(0)
    const [totalAnimes, setTotalAnimes] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState<number>(1)
    const [limit] = useState<number>(24)
    const [query, setQuery] = useState<string>("")
    const [hasNext, setHasNext] = useState<boolean>(false)

    useEffect(() => {
        loadAnimes()// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    async function loadAnimes(search = false) {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/catalog?page=${page}&limit=${limit}&q=${query}`);
            const json = await res.json();
            console.log('Fetched animes:', json);
            setAnimes(json.data);
            setTotalAnimes(json.pagination.totalItems);
            setTotalPage(json.pagination.totalPage);
            setHasNext(json.pagination.hasNext);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération")
        } finally {
            setLoading(false)
        }
    }

    function onSearch(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault()
        setPage(1)
        loadAnimes(true)
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto py-8 px-4 space-y-8">
                {/* Header */}
                <div className="space-y-2 mb-8">
                    <h1 className="text-5xl font-bold text-foreground">Explorer</h1>
                    <p className="text-muted-foreground text-lg">Découvrez les animes de la base de données Jikan</p>
                </div>

                {/* Search Form */}
                <Card className="bg-card/30 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Rechercher un anime
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSearch} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Rechercher (ex: Naruto, Attack on Titan...)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={loading} className="cursor-pointer gap-2">
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Rechercher
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setQuery("")
                                    setPage(1)
                                    loadAnimes()
                                }}
                                className="cursor-pointer"
                            >
                                Réinitialiser
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Loading & Error States */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Chargement des animes...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="pt-6">
                            <p className="text-destructive font-medium">Erreur: {error}</p>
                            <Button
                                onClick={() => {
                                    setError(null)
                                    loadAnimes()
                                }}
                                variant="outline"
                                className="mt-4 cursor-pointer"
                            >
                                Réessayer
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Animes Grid */}
                {!loading && animes.length === 0 && !error && (
                    <Card className="text-center py-16 border-border/50">
                        <CardContent>
                            <div className="text-6xl mb-4">🔍</div>
                            <CardTitle className="mb-2">Aucun anime trouvé</CardTitle>
                            <p className="text-muted-foreground">Essayez une autre recherche ou réinitialisez les filtres</p>
                        </CardContent>
                    </Card>
                )}

                {!loading && animes.length > 0 && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm">
                                {totalAnimes} anime{animes.length > 1 ? "s" : ""} trouvé{animes.length > 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {animes.map((anime) => (
                                <Card
                                    key={anime.mal_id}
                                    className="group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border-border/50 bg-card/50 overflow-hidden"
                                    onClick={() => router.push(`/explorer/${anime.mal_id}`)}
                                >
                                    <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                                        {anime.images?.webp?.image_url ? (
                                            <img
                                                src={anime.images.webp.image_url || "/placeholder.svg"}
                                                alt={anime.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
                                                <span className="text-4xl">📺</span>
                                            </div>
                                        )}
                                        {anime.score && (
                                            <Badge className="absolute top-2 right-2 bg-yellow-600/90 hover:bg-yellow-600 text-white border-0">
                                                ⭐ {anime.score}
                                            </Badge>
                                        )}
                                    </div>

                                    <CardContent className="p-3 space-y-2">
                                        <h4 className="font-medium text-sm line-clamp-2 text-foreground">{anime.title}</h4>
                                        {anime.synopsis && <p className="text-xs text-muted-foreground line-clamp-2">{anime.synopsis}</p>}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {!loading && animes.length > 0 && (
                    <div className="flex justify-center items-center gap-3 py-8">
                        <Button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            variant={page === 1 ? "secondary" : "outline"}
                            className="cursor-pointer gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Précédent
                        </Button>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                            <span className="text-sm font-medium">Page</span>
                            <span className="text-sm font-bold text-primary">{page}/ {totalPage > 0 ? totalPage : '-'}</span>
                        </div>

                        <Button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={loading || !hasNext}
                            variant={!hasNext ? "secondary" : "outline"}
                            className="cursor-pointer gap-2"
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}
