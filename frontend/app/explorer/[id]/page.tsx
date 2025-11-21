"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star } from "lucide-react"

interface VoiceActor {
    person: {
        mal_id: number
        name: string
        images?: {
            jpg?: {
                image_url?: string
            }
        }
    }
    language: string
}

interface Character {
    character: {
        mal_id: number
        name: string
        images?: {
            webp?: {
                image_url?: string
            }
        }
    }
    role: string
    favorites: number
    voice_actors: VoiceActor[]
}

interface AnimeDetail {
    anime: {
        mal_id: number
        title: string
        title_english?: string
        title_japanese?: string
        images?: {
            webp?: {
                large_image_url?: string
                image_url?: string
            }
            jpg?: {
                large_image_url?: string
                image_url?: string
            }
        }
        synopsis?: string
        background?: string
        score?: number
        scored_by?: number
        rank?: number
        popularity?: number
        type?: string
        source?: string
        episodes?: number
        status?: string
        aired?: {
            string?: string
        }
        duration?: string
        rating?: string
        genres?: Array<{ name: string }>
        themes?: Array<{ name: string }>
        studios?: Array<{ name: string }>
        producers?: Array<{ name: string }>
    }
    characters: Character[]
}

export default function AnimeDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [anime, setAnime] = useState<AnimeDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [rating, setRating] = useState(0)
    const [userRating, setUserRating] = useState(0)

    useEffect(() => {
        if (!id) return

        loadAnimeDetail()
    }, [id])

    async function loadAnimeDetail() {
        try {
            setLoading(true)
            setError(null)

            let res
            let attempts = 0
            const maxAttempts = 3

            while (attempts < maxAttempts) {
                // Always add a delay, even before the first attempt (1s initial, then exponential)
                await new Promise((resolve) => setTimeout(resolve, 1000 * (attempts + 1)))

                res = await fetch(`/api/catalog/${id}`)

                // If successful, break the loop
                if (res.ok) {
                    break
                }

                // If not a 503, break and handle the error
                if (res.status !== 503) {
                    break
                }

                attempts++
            }

            if (!res?.ok) {
                throw new Error(`Erreur ${res?.status || "inconnue"}`)
            }

            const data = await res.json()
            setAnime(data)
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement")
        } finally {
            setLoading(false)
        }
    }

    if (!id || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        )
    }

    if (error || !anime) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md w-full mx-4 border-destructive/50">
                    <CardContent className="pt-6">
                        <p className="text-destructive font-medium mb-4">{error || "Anime non trouvé"}</p>
                        <Button onClick={() => router.back()} className="w-full gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const animeData = anime.anime
    const imageUrl =
        animeData.images?.webp?.large_image_url ||
        animeData.images?.webp?.image_url ||
        animeData.images?.jpg?.large_image_url ||
        "/placeholder.svg"

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={animeData.title}
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 z-10 p-2 rounded-lg bg-card/80 hover:bg-card transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            <main className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar - Image & Stats */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="overflow-hidden border-border/50">
                            <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={animeData.title}
                                className="w-full aspect-[3/4] object-cover"
                            />
                        </Card>

                        {/* Quick Stats */}
                        <Card className="border-border/50 bg-card/50 space-y-4 p-4">
                            {animeData.score && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Score MAL</span>
                                        <Badge className="bg-yellow-600/90">⭐ {animeData.score}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{animeData.scored_by?.toLocaleString()} votes</p>
                                </div>
                            )}

                            {animeData.rank && (
                                <div className="flex items-center justify-between py-2 border-t border-border">
                                    <span className="text-sm font-medium text-muted-foreground">Rang</span>
                                    <Badge variant="outline">#{animeData.rank}</Badge>
                                </div>
                            )}

                            {animeData.popularity && (
                                <div className="flex items-center justify-between py-2 border-t border-border">
                                    <span className="text-sm font-medium text-muted-foreground">Popularité</span>
                                    <Badge variant="outline">#{animeData.popularity}</Badge>
                                </div>
                            )}

                            {/* Rating System */}
                            <div className="pt-2 border-t border-border space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Ta note</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setUserRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-5 h-5 ${
                                                    star <= userRating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Title & Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-4xl font-bold text-foreground mb-2">{animeData.title}</h1>
                                {animeData.title_english && animeData.title_english !== animeData.title && (
                                    <p className="text-lg text-muted-foreground">{animeData.title_english}</p>
                                )}
                                {animeData.title_japanese && (
                                    <p className="text-lg text-muted-foreground">{animeData.title_japanese}</p>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {animeData.type && (
                                    <Card className="border-border/50 bg-card/50 p-3">
                                        <p className="text-xs text-muted-foreground">Type</p>
                                        <p className="font-semibold text-foreground">{animeData.type}</p>
                                    </Card>
                                )}
                                {animeData.episodes && (
                                    <Card className="border-border/50 bg-card/50 p-3">
                                        <p className="text-xs text-muted-foreground">Épisodes</p>
                                        <p className="font-semibold text-foreground">{animeData.episodes}</p>
                                    </Card>
                                )}
                                {animeData.status && (
                                    <Card className="border-border/50 bg-card/50 p-3">
                                        <p className="text-xs text-muted-foreground">Statut</p>
                                        <p className="font-semibold text-foreground text-sm">{animeData.status}</p>
                                    </Card>
                                )}
                                {animeData.aired?.string && (
                                    <Card className="border-border/50 bg-card/50 p-3">
                                        <p className="text-xs text-muted-foreground">Diffusé</p>
                                        <p className="font-semibold text-foreground text-sm">{animeData.aired.string}</p>
                                    </Card>
                                )}
                            </div>

                            {/* Genres & Themes */}
                            <div className="space-y-3">
                                {animeData.genres && animeData.genres.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Genres</p>
                                        <div className="flex flex-wrap gap-2">
                                            {animeData.genres.map((genre) => (
                                                <Badge key={genre.name} variant="secondary">
                                                    {genre.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {animeData.themes && animeData.themes.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Thèmes</p>
                                        <div className="flex flex-wrap gap-2">
                                            {animeData.themes.map((theme) => (
                                                <Badge key={theme.name} variant="outline">
                                                    {theme.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Synopsis */}
                        {animeData.synopsis && (
                            <Card className="border-border/50 bg-card/50 p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-3">Synopsis</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{animeData.synopsis}</p>
                            </Card>
                        )}

                        {/* Background */}
                        {animeData.background && (
                            <Card className="border-border/50 bg-card/50 p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-3">Contexte</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{animeData.background}</p>
                            </Card>
                        )}

                        {/* Production */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {animeData.studios && animeData.studios.length > 0 && (
                                <Card className="border-border/50 bg-card/50 p-4">
                                    <h3 className="font-semibold text-foreground mb-3">Studios</h3>
                                    <ul className="space-y-2">
                                        {animeData.studios.map((studio) => (
                                            <li key={studio.name} className="text-sm text-muted-foreground">
                                                {studio.name}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {animeData.producers && animeData.producers.length > 0 && (
                                <Card className="border-border/50 bg-card/50 p-4">
                                    <h3 className="font-semibold text-foreground mb-3">Producteurs</h3>
                                    <ul className="space-y-2">
                                        {animeData.producers.map((producer) => (
                                            <li key={producer.name} className="text-sm text-muted-foreground">
                                                {producer.name}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Characters Section */}
                {anime.characters && anime.characters.length > 0 && (
                    <div className="mt-16 space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-2">Personnages</h2>
                            <p className="text-muted-foreground">Découvrez les personnages principaux et leurs voix</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {anime.characters.slice().map((char) => (
                                <Card
                                    key={char.character.mal_id}
                                    className="border-border/50 bg-card/50 overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="md:flex gap-3 p-0">
                                        {/* Character Image */}
                                        <div className="md:w-24 flex-shrink-0">
                                            <img
                                                src={char.character.images?.webp?.image_url || "/placeholder.svg"}
                                                alt={char.character.name}
                                                className="w-full h-24 md:h-32 object-cover"
                                            />
                                        </div>

                                        {/* Character Info */}
                                        <div className="p-4 flex-1">
                                            <div className="mb-3">
                                                <p className="text-xs font-medium text-primary uppercase tracking-wide">{char.role}</p>
                                                <h4 className="font-semibold text-foreground text-sm mt-1">{char.character.name}</h4>
                                            </div>

                                            {/* Voice Actors */}
                                            {char.voice_actors.length > 0 && (
                                                <div className="space-y-2 border-t border-border pt-3">
                                                    <p className="text-xs font-medium text-muted-foreground">Doublage</p>
                                                    {char.voice_actors.slice(0, 2).map((va) => (
                                                        <div key={`${char.character.mal_id}-${va.person.mal_id}`} className="text-xs">
                                                            <p className="font-medium text-foreground">{va.person.name}</p>
                                                            <p className="text-muted-foreground">{va.language}</p>
                                                        </div>
                                                    ))}
                                                    {char.voice_actors.length > 2 && (
                                                        <p className="text-xs text-muted-foreground italic">
                                                            +{char.voice_actors.length - 2} autres
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {anime.characters.length && (
                            <div className="text-center pt-4">
                                <p className="text-muted-foreground text-sm">{anime.characters.length} personnages disponibles</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
