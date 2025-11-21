"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Library, Flame, CheckCircle2, Clock, BookmarkPlus } from "lucide-react"

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

export default function Dashboard() {
    const router = useRouter()
    const [totalJikan, setTotalJikan] = useState<number | null>(null);
    const [animes, setAnimes] = useState<Anime[]>([])
    const [publicPreview, setPublicPreview] = useState<Anime[]>([])
    const [publicCount, setPublicCount] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        malId: "",
        title: "",
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [creating, setCreating] = useState(false)
    const [addingId, setAddingId] = useState<number | null>(null)
    const [ratingAnime, setRatingAnime] = useState<number | null>(null)
    const [ratingValue, setRatingValue] = useState<number>(0)

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

    const loadAnimes = async () => {
        try {
            const res = await fetch("/api/animes")
            if (!res.ok) {
                if (res.status === 401) {
                    window.location.href = "/login"
                    return
                }
                throw new Error("fetch failed")
            }
            const data = await res.json()
            setAnimes(data)
            setLoading(false)
        } catch {
            setError("Impossible de charger vos animes")
            setLoading(false)
        }
    }

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
        loadTotalJikan()
        loadAnimes()
        loadPublic()
    }, [])

    const createAnime = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.malId.trim()) return

        setCreating(true)
        const res = await fetch("/api/animes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                malId: Number.parseInt(formData.malId),
                title: formData.title || `Anime ${formData.malId}`,
                status: "watchlist",
            }),
        })
        setCreating(false)

        if (res.ok) {
            setFormData({ malId: "", title: "" })
            loadAnimes()
        } else if (res.status === 401) {
            window.location.href = "/login"
        } else {
            alert("Erreur lors de la création")
        }
    }

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
                loadAnimes()
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
            loadAnimes()
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
                                loadAnimes()
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
                            <div className="text-3xl font-bold text-foreground">{animes.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Animes dans votre collection</p>
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
                            <div className="text-3xl font-bold text-foreground">{watching.length}</div>
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
                            <div className="text-3xl font-bold text-foreground">{completed.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Animes terminés</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Add Form */}
                <Card className="bg-card/30 border-border">
                    <CardHeader>
                        <CardTitle>Ajouter un anime rapidement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={createAnime} className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Entrez le MAL ID (ex: 1)"
                                value={formData.malId}
                                onChange={(e) => setFormData({ ...formData, malId: e.target.value })}
                                required
                                className="flex-1"
                            />
                            <Button type="submit" disabled={creating} className="cursor-pointer">
                                {creating ? "Ajout..." : "+ Ajouter"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Navigation Links */}
                <div className="flex flex-wrap gap-3 justify-center">
                    <Button onClick={() => router.push("/explore")} variant="outline" className="cursor-pointer">
                        🔍 Explorer la bibliothèque
                    </Button>
                    <Button
                        onClick={() => document.getElementById("collection")?.scrollIntoView()}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        ⭐ Voir ma collection
                    </Button>
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

                {/* Collection d'animes avec onglets */}
                <div id="collection" className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Ma collection</h2>
                        <p className="text-muted-foreground text-sm">Organisez vos animes en différentes catégories</p>
                    </div>

                    {animes.length === 0 ? (
                        <Card className="text-center py-16 border-border/50">
                            <CardContent>
                                <div className="text-6xl mb-4">📚</div>
                                <CardTitle className="mb-2">Votre collection est vide</CardTitle>
                                <p className="text-muted-foreground mb-6">Commencez par ajouter vos premiers animes favoris</p>
                                <Button onClick={() => router.push("/explore")} className="cursor-pointer">
                                    Découvrir des animes
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Tabs defaultValue="watchlist" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-muted/30">
                                <TabsTrigger value="watchlist" className="cursor-pointer">
                                    <Clock className="w-4 h-4 mr-2" />À regarder ({watchlist.length})
                                </TabsTrigger>
                                <TabsTrigger value="watching" className="cursor-pointer">
                                    <Flame className="w-4 h-4 mr-2" />
                                    En cours ({watching.length})
                                </TabsTrigger>
                                <TabsTrigger value="completed" className="cursor-pointer">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Terminés ({completed.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="watchlist" className="space-y-4 mt-6">
                                {watchlist.length === 0 ? (
                                    <Card className="text-center py-8 border-border/50">
                                        <CardContent>
                                            <p className="text-muted-foreground">Aucun anime dans votre watchlist</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {watchlist.map((anime) => (
                                            <AnimeCard
                                                key={anime.id}
                                                anime={anime}
                                                onRate={updateAnimeRating}
                                                onDelete={deleteAnime}
                                                onRate2={setRatingAnime}
                                                router={router}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="watching" className="space-y-4 mt-6">
                                {watching.length === 0 ? (
                                    <Card className="text-center py-8 border-border/50">
                                        <CardContent>
                                            <p className="text-muted-foreground">Aucun anime en visionnage</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {watching.map((anime) => (
                                            <AnimeCard
                                                key={anime.id}
                                                anime={anime}
                                                onRate={updateAnimeRating}
                                                onDelete={deleteAnime}
                                                onRate2={setRatingAnime}
                                                router={router}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="completed" className="space-y-4 mt-6">
                                {completed.length === 0 ? (
                                    <Card className="text-center py-8 border-border/50">
                                        <CardContent>
                                            <p className="text-muted-foreground">Aucun anime terminé</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {completed.map((anime) => (
                                            <AnimeCard
                                                key={anime.id}
                                                anime={anime}
                                                onRate={updateAnimeRating}
                                                onDelete={deleteAnime}
                                                onRate2={setRatingAnime}
                                                router={router}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </main>
        </div>
    )
}

function AnimeCard({
                       anime,
                       onRate,
                       onDelete,
                       onRate2,
                       router
                   }: {
    anime: Anime
    onRate: (id: number, rating: number) => void
    onDelete: (id: number) => void
    onRate2: (id: number | null) => void
    router: ReturnType<typeof useRouter>
}) {
    return (
        <Card className="group transition-all duration-200 hover:shadow-lg border-border/50 bg-card/50 overflow-hidden">
            <div
                className="aspect-[3/4] relative overflow-hidden bg-muted cursor-pointer"
                onClick={() => router.push(`/anime/${anime.malId}`)}
            >
                {anime.image ? (
                    <img
                        src={anime.image || "/placeholder.svg"}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">📺</span>
                    </div>
                )}
                {anime.score && (
                    <Badge className="absolute top-2 right-2 bg-yellow-600/90 hover:bg-yellow-600 text-white border-0">
                        ⭐ {anime.score}
                    </Badge>
                )}
                {anime.userRating && (
                    <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-primary-foreground border-0">
                        ✨ {anime.userRating}/10
                    </Badge>
                )}
            </div>
            <CardContent className="p-4 space-y-3">
                <div>
                    <CardTitle className="line-clamp-2 text-base text-foreground">{anime.title}</CardTitle>
                </div>
                {anime.synopsis && <p className="text-muted-foreground text-sm line-clamp-2">{anime.synopsis}</p>}
                <div className="flex gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => onRate(anime.id!, star)}
                            className="cursor-pointer hover:scale-110 transition-transform"
                        >
                            <Star
                                className={`w-4 h-4 ${
                                    (anime.userRating || 0) >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 pt-2">
                    {anime.url && (
                        <Button variant="outline" size="sm" className="flex-1 cursor-pointer text-xs h-8 bg-transparent" asChild>
                            <a href={anime.url} target="_blank" rel="noopener noreferrer">
                                🔗 MAL
                            </a>
                        </Button>
                    )}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(anime.id!)}
                        className="flex-1 cursor-pointer text-xs h-8"
                    >
                        🗑️
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

const router = undefined
