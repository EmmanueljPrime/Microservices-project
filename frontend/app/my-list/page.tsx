"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Trash2, LayoutGrid, List, Table, Pen } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Anime = {
    mal_id: number
    title: string
    score?: number
    images?: { webp?: { image_url?: string } }
    synopsis?: string
}

type AnimeWithStatus = Anime & {
    status: 'à regarder' | 'en cours' | 'terminé'
}

type ViewMode = 'grid' | 'list' | 'table'

export default function MyListPage() {
    const router = useRouter()
    const [animes, setAnimes] = useState<AnimeWithStatus[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<string>("à regarder")
    const [viewMode, setViewMode] = useState<ViewMode>('grid')

    // Simuler le chargement des animes depuis localStorage ou API
    useEffect(() => {
        loadMyList()
    }, [])

    async function loadMyList() {
        setLoading(true)
        try {
            // Pour le moment, récupérer depuis localStorage (front-only)
            const savedList = localStorage.getItem('myAnimeList')
            if (savedList) {
                const parsed = JSON.parse(savedList)
                setAnimes(parsed)
            }
        } catch (err) {
            console.error('Failed to load my list', err)
        } finally {
            setLoading(false)
        }
    }

    function handleRemoveAnime(id: number) {
        const updated = animes.filter(a => a.mal_id !== id)
        setAnimes(updated)
        localStorage.setItem('myAnimeList', JSON.stringify(updated))
    }

    function handleChangeStatus(id: number, newStatus: 'à regarder' | 'en cours' | 'terminé') {
        const updated = animes.map(a => 
            a.mal_id === id ? { ...a, status: newStatus } : a
        )
        setAnimes(updated)
        localStorage.setItem('myAnimeList', JSON.stringify(updated))
    }

    const filteredAnimes = animes.filter(a => a.status === activeTab)

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto py-8 px-4 space-y-8">
                {/* Header */}
                <div className="space-y-2 mb-8">
                    <h1 className="text-5xl font-bold text-foreground">Ma Liste</h1>
                    <p className="text-muted-foreground text-lg">
                        Gérez vos animes à regarder, en cours et terminés
                    </p>
                </div>

                {/* Tabs Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="à regarder">
                                À regarder
                                <Badge variant="secondary" className="ml-2">
                                    {animes.filter(a => a.status === 'à regarder').length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="en cours">
                                En cours
                                <Badge variant="secondary" className="ml-2">
                                    {animes.filter(a => a.status === 'en cours').length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="terminé">
                                Terminé
                                <Badge variant="secondary" className="ml-2">
                                    {animes.filter(a => a.status === 'terminé').length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className="h-9 w-9"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className="h-9 w-9"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'table' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('table')}
                                className="h-9 w-9"
                            >
                                <Table className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <TabsContent value={activeTab} className="mt-8">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p className="text-muted-foreground">Chargement...</p>
                                </div>
                            </div>
                        ) : filteredAnimes.length === 0 ? (
                            <Card className="text-center py-16 border-border/50">
                                <CardContent>
                                    <div className="text-6xl mb-4">📺</div>
                                    <h3 className="text-xl font-semibold mb-2">Aucun anime</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Vous n'avez pas encore d'anime dans cette catégorie
                                    </p>
                                    <Button onClick={() => router.push('/explorer')} variant="outline">
                                        Explorer les animes
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Grid View */}
                                {viewMode === 'grid' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                        {filteredAnimes.map((anime) => (
                                            <Card
                                                key={anime.mal_id}
                                                className="group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border-border/50 bg-card/50 overflow-hidden"
                                                onClick={() => router.push(`/explorer/${anime.mal_id}`)}
                                            >
                                                <div className="aspect-3/4 relative overflow-hidden bg-muted">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                onClick={(e) => e.stopPropagation()}
                                                                variant="secondary"
                                                                size="icon"
                                                                className="absolute top-2 right-2 z-10 h-7 w-7 bg-secondary/90 hover:bg-secondary"
                                                                aria-label="Modifier le statut"
                                                            >
                                                                <Pen className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleChangeStatus(anime.mal_id, 'à regarder')
                                                                }}
                                                            >
                                                                À regarder
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleChangeStatus(anime.mal_id, 'en cours')
                                                                }}
                                                            >
                                                                En cours
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleChangeStatus(anime.mal_id, 'terminé')
                                                                }}
                                                            >
                                                                Terminé
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleRemoveAnime(anime.mal_id)
                                                        }}
                                                        className="absolute top-2 right-11 z-10 p-1.5 rounded-md bg-destructive/90 hover:bg-destructive text-destructive-foreground shadow-sm transition-all"
                                                        aria-label="Supprimer"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>

                                                    {anime.images?.webp?.image_url ? (
                                                        <img
                                                            src={anime.images.webp.image_url || "/placeholder.svg"}
                                                            alt={anime.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                                                            <span className="text-4xl">📺</span>
                                                        </div>
                                                    )}

                                                    {anime.score && (
                                                        <Badge className="absolute top-2 left-2 bg-yellow-600/90 hover:bg-yellow-600 text-white border-0">
                                                            ⭐ {anime.score}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <CardContent className="p-3 space-y-2">
                                                    <h4 className="font-medium text-sm line-clamp-2 text-foreground">
                                                        {anime.title}
                                                    </h4>
                                                    {anime.synopsis && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {anime.synopsis}
                                                        </p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* List View */}
                                {viewMode === 'list' && (
                                    <div className="space-y-3">
                                        {filteredAnimes.map((anime) => (
                                            <Card
                                                key={anime.mal_id}
                                                className="cursor-pointer transition-all duration-200 hover:shadow-lg border-border/50 bg-card/50 overflow-hidden"
                                                onClick={() => router.push(`/explorer/${anime.mal_id}`)}
                                            >
                                                <div className="flex gap-4 p-4">
                                                    <div className="w-24 h-32 flex-shrink-0 relative overflow-hidden rounded-md bg-muted">
                                                        {anime.images?.webp?.image_url ? (
                                                            <img
                                                                src={anime.images.webp.image_url || "/placeholder.svg"}
                                                                alt={anime.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted-foreground/20">
                                                                <span className="text-2xl">📺</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-lg line-clamp-1 text-foreground mb-1">
                                                                    {anime.title}
                                                                </h3>
                                                                {anime.synopsis && (
                                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                                        {anime.synopsis}
                                                                    </p>
                                                                )}
                                                                {anime.score && (
                                                                    <Badge className="bg-yellow-600/90 text-white border-0">
                                                                        ⭐ {anime.score}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            variant="ghost"
                                                                            size="icon"
                                                                        >
                                                                            <Pen className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                                                        <DropdownMenuItem
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                handleChangeStatus(anime.mal_id, 'à regarder')
                                                                            }}
                                                                        >
                                                                            À regarder
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                handleChangeStatus(anime.mal_id, 'en cours')
                                                                            }}
                                                                        >
                                                                            En cours
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                handleChangeStatus(anime.mal_id, 'terminé')
                                                                            }}
                                                                        >
                                                                            Terminé
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleRemoveAnime(anime.mal_id)
                                                                    }}
                                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Table View */}
                                {viewMode === 'table' && (
                                    <Card className="border-border/50">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-border">
                                                        <th className="text-left p-4 font-semibold text-sm">Image</th>
                                                        <th className="text-left p-4 font-semibold text-sm">Titre</th>
                                                        <th className="text-left p-4 font-semibold text-sm">Synopsis</th>
                                                        <th className="text-left p-4 font-semibold text-sm">Score</th>
                                                        <th className="text-right p-4 font-semibold text-sm">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAnimes.map((anime) => (
                                                        <tr
                                                            key={anime.mal_id}
                                                            className="border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                                                            onClick={() => router.push(`/explorer/${anime.mal_id}`)}
                                                        >
                                                            <td className="p-4">
                                                                <div className="w-12 h-16 relative overflow-hidden rounded bg-muted">
                                                                    {anime.images?.webp?.image_url ? (
                                                                        <img
                                                                            src={anime.images.webp.image_url || "/placeholder.svg"}
                                                                            alt={anime.title}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center">
                                                                            <span className="text-xl">📺</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-medium">{anime.title}</span>
                                                            </td>
                                                            <td className="p-4 max-w-md">
                                                                <span className="text-sm text-muted-foreground line-clamp-2">
                                                                    {anime.synopsis || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                {anime.score ? (
                                                                    <Badge className="bg-yellow-600/90 text-white border-0">
                                                                        ⭐ {anime.score}
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-sm text-muted-foreground">N/A</span>
                                                                )}
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                variant="ghost"
                                                                                size="icon"
                                                                            >
                                                                                <Pen className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleChangeStatus(anime.mal_id, 'à regarder')
                                                                                }}
                                                                            >
                                                                                À regarder
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleChangeStatus(anime.mal_id, 'en cours')
                                                                                }}
                                                                            >
                                                                                En cours
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleChangeStatus(anime.mal_id, 'terminé')
                                                                                }}
                                                                            >
                                                                                Terminé
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleRemoveAnime(anime.mal_id)
                                                                        }}
                                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
