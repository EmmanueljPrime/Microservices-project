"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Library, Flame, CheckCircle2, BookmarkPlus } from "lucide-react"

interface Anime {
    id?: number
    user?: string
    malId: number
    title: string
    image?: string
    url?: string
    synopsis?: string
    score?: number
    status?: "watchlist" | "watching" | "completed"
    userRating?: number
    createdAt?: string
}

type AnimeWithStatus = {
    mal_id: number
    title: string
    score?: number
    images?: { webp?: { image_url?: string } }
    synopsis?: string
    status: 'à regarder' | 'en cours' | 'terminé'
}

export default function Dashboard() {
    const router = useRouter()
    const [totalJikan, setTotalJikan] = useState<number | null>(null);
    const [animes, setAnimes] = useState<Anime[]>([])
    const [publicPreview, setPublicPreview] = useState<Anime[]>([])
    const [publicCount, setPublicCount] = useState<number | null>(null)
    const [toWatchCount, setToWatchCount] = useState<number>(0)
    const [watchingCount, setWatchingCount] = useState<number>(0)
    const [completedCount, setCompletedCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [addingId, setAddingId] = useState<number | null>(null)
    const [ratingAnime, setRatingAnime] = useState<number | null>(null)
    const [ratingValue, setRatingValue] = useState<number>(0)

    const loadAnimeCounts = () => {
        try {
            const savedList = localStorage.getItem('myAnimeList')
            if (savedList) {
                const parsed: AnimeWithStatus[] = JSON.parse(savedList)
                const toWatch = parsed.filter((a) => a.status === 'à regarder').length
                const watching = parsed.filter((a) => a.status === 'en cours').length
                const completed = parsed.filter((a) => a.status === 'terminé').length
                
                setToWatchCount(toWatch)
                setWatchingCount(watching)
                setCompletedCount(completed)
            }
        } catch (err) {
            console.error('Failed to load anime counts', err)
        }
    }

    const loadTotalJikan = async () => {
        try{
            const res = await fetch ("https://api.jikan.moe/v4/anime")
            if (!res.ok) {
                if (res.status === 401) {
                    window.location.href = "/login"
                    return
                }
                throw new Error("fetch failed")
            }
            const json = await res.json()

            const data = json.pagination.items.total

            setTotalJikan(data)
            setLoading(false)
        }catch{
            setError("Impossible de charger le total des animes")
            setLoading(false)
        }
    }

    // const loadAnimes = async () => {
    //     try {
    //         const res = await fetch("/api/animes")
    //         if (!res.ok) {
    //             if (res.status === 401) {
    //                 window.location.href = "/login"
    //                 return
    //             }
    //             throw new Error("fetch failed")
    //         }
    //         const data = await res.json()
    //         setAnimes(data)
    //         setLoading(false)
    //     } catch {
    //         setError("Impossible de charger vos animes")
    //         setLoading(false)
    //     }
    // }

    const loadPublic = async () => {
        try {
            const res = await fetch("/api/public/animes?limit=6")
            if (!res.ok) {
                setPublicCount(null)
                setPublicPreview([])
                return
            }
            const data = await res.json().catch(() => [])
            if (Array.isArray(data)) {
                setPublicPreview(data.slice(0, 6))
                setPublicCount(data.length)
            } else {
                setPublicPreview(data.items ?? [])
                setPublicCount(typeof data.total === "number" ? data.total : data.items ? data.items.length : null)
            }
        } catch {
            setPublicCount(null)
            setPublicPreview([])
        }
    }

    useEffect(() => {
        loadAnimeCounts()
        loadTotalJikan()
        loadPublic()
    }, [])



    const addFavorite = async (anime: Anime) => {
        if (!anime || !anime.malId) return
        setAddingId(anime.malId)
        try {
            const res = await fetch("/api/animes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    malId: anime.malId,
                    title: anime.title,
                    image: anime.image,
                    url: anime.url,
                    synopsis: anime.synopsis,
                    score: anime.score,
                    status: "watchlist",
                }),
            })
            setAddingId(null)
            if (res.ok) {
                // loadAnimes()
            } else if (res.status === 401) {
                window.location.href = "/login"
            }
        } catch {
            setAddingId(null)
        }
    }

    const updateAnimeRating = async (animeId: number, rating: number) => {
        try {
            const res = await fetch(`/api/animes/${animeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userRating: rating }),
            })
            if (res.ok) {
                setAnimes(animes.map((a) => (a.id === animeId ? { ...a, userRating: rating } : a)))
                setRatingAnime(null)
            }
        } catch {
            console.error("Erreur lors de la mise à jour")
        }
    }

    const deleteAnime = async (id: number) => {
        if (!confirm("Retirer cet anime ?")) return

        const res = await fetch(`/api/animes/${id}`, { method: "DELETE" })
        if (res.ok) {
            // loadAnimes()
        } else if (res.status === 401) {
            window.location.href = "/login"
        }
    }

    const getAnimesByStatus = (status: string) => {
        return animes.filter((a) => (a.status || "watchlist") === status)
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary"></div>
                    <p className="text-muted-foreground">Chargement du dashboard...</p>
                </div>
            </div>
        )

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="max-w-md mx-4">
                    <CardContent className="text-center pt-6">
                        <div className="text-6xl mb-4">⚠️</div>
                        <CardTitle className="mb-2">Erreur</CardTitle>
                        <p className="text-destructive mb-4">{error}</p>
                        <Button
                            onClick={() => {
                                setError("")
                                //loadAnimes()
                                loadPublic()
                            }}
                            variant="destructive"
                        >
                            Réessayer
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )

    const watchlist = getAnimesByStatus("watchlist")
    const watching = getAnimesByStatus("watching")
    const completed = getAnimesByStatus("completed")

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto py-8 px-4 space-y-8">
                {/* Header du Dashboard */}
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold text-foreground">Shurikn</h1>
                    <p className="text-muted-foreground text-lg">Gérez et découvrez vos animes préférés</p>
                </div>

                {/* Statistiques - KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-primary bg-card/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Base de données</CardTitle>
                                <Library className="w-4 h-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{totalJikan}</div>
                            <p className="text-xs text-muted-foreground mt-1">Animes disponibles</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-chart-2 bg-card/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">À regarder</CardTitle>
                                <BookmarkPlus className="w-4 h-4 text-chart-2" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{toWatchCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Animes à regarder</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-chart-1 bg-card/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
                                <Flame className="w-4 h-4 text-chart-1" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{watchingCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Actuellement en visionnage</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-chart-4 bg-card/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Terminés</CardTitle>
                                <CheckCircle2 className="w-4 h-4 text-chart-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{completedCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Animes terminés</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Aperçu des animes publics */}
                {publicPreview.length > 0 && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Animes populaires</h2>
                            <p className="text-muted-foreground text-sm">
                                Découvrez les animes les plus populaires et ajoutez-les à votre collection
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {publicPreview.map((anime) => (
                                <Card
                                    key={anime.malId}
                                    className="group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border-border/50"
                                    onClick={(e) => {
                                        const target = e.target as HTMLElement
                                        if (target.closest("button")) return
                                        router.push(`/anime/${anime.malId}`)
                                    }}
                                >
                                    <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg bg-muted">
                                        {anime.image ? (
                                            <img
                                                src={anime.image || "/placeholder.svg"}
                                                alt={anime.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-2xl">📺</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                                            <div className="p-2 w-full">
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        addFavorite(anime)
                                                    }}
                                                    disabled={addingId === anime.malId}
                                                    className="w-full"
                                                >
                                                    {addingId === anime.malId ? "..." : "⭐ Ajouter"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-3">
                                        <h4 className="font-medium text-sm line-clamp-2 text-foreground">{anime.title}</h4>
                                        {anime.score && (
                                            <Badge variant="secondary" className="text-xs mt-2">
                                                ⭐ {anime.score}
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section Activité Récente */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Activité récente</h2>
                        <p className="text-muted-foreground text-sm">Les derniers animes ajoutés à votre liste</p>
                    </div>

                    {toWatchCount === 0 && watchingCount === 0 && completedCount === 0 ? (
                        <Card className="text-center py-16 border-border/50">
                            <CardContent>
                                <div className="text-6xl mb-4">🎬</div>
                                <CardTitle className="mb-2">Commencez votre aventure</CardTitle>
                                <p className="text-muted-foreground mb-6">
                                    Ajoutez vos premiers animes et suivez votre progression
                                </p>
                                <Button onClick={() => router.push("/explorer")} className="cursor-pointer">
                                    Explorer la bibliothèque
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Progression personnelle */}
                            <Card className="border-border/50 bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Flame className="w-5 h-5 text-chart-1" />
                                        Votre progression
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Animes terminés</span>
                                            <span className="font-semibold text-foreground">{completedCount}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-chart-4 h-2 rounded-full transition-all"
                                                style={{ 
                                                    width: `${(completedCount / (toWatchCount + watchingCount + completedCount)) * 100}%` 
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">En cours de visionnage</span>
                                            <span className="font-semibold text-foreground">{watchingCount}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-chart-1 h-2 rounded-full transition-all"
                                                style={{ 
                                                    width: `${(watchingCount / (toWatchCount + watchingCount + completedCount)) * 100}%` 
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-border">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Total dans votre liste</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {toWatchCount + watchingCount + completedCount}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions rapides */}
                            <Card className="border-border/50 bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        Actions rapides
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        onClick={() => router.push("/explorer")}
                                        variant="outline"
                                        className="w-full justify-start cursor-pointer"
                                    >
                                        <Library className="w-4 h-4 mr-2" />
                                        Découvrir de nouveaux animes
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/my-list")}
                                        variant="outline"
                                        className="w-full justify-start cursor-pointer"
                                    >
                                        <BookmarkPlus className="w-4 h-4 mr-2" />
                                        Gérer ma liste
                                    </Button>
                                    {watchingCount > 0 && (
                                        <div className="pt-2 border-t border-border">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Vous avez {watchingCount} anime{watchingCount > 1 ? 's' : ''} en cours
                                            </p>
                                            <Button
                                                onClick={() => router.push("/my-list")}
                                                size="sm"
                                                className="w-full cursor-pointer"
                                            >
                                                Continuer à regarder
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

const router = undefined
