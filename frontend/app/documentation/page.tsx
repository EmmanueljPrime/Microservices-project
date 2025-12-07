"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Lock, CheckCircle2 } from "lucide-react"

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto py-8 px-4 space-y-8">
                {/* Header */}
                <div className="space-y-2 mb-8">
                    <h1 className="text-5xl font-bold text-foreground">Documentation API</h1>
                    <p className="text-muted-foreground text-lg">
                        Guide complet pour utiliser les APIs du projet Shurikn
                    </p>
                </div>

                {/* Services Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">Auth Service</CardTitle>
                                <Lock className="w-4 h-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Port 8000 - Python/FastAPI</p>
                            <Badge className="mt-2">Authentication & JWT</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-chart-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">Anime Service</CardTitle>
                                <Database className="w-4 h-4 text-chart-1" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Port 5000 - NestJS/TypeScript</p>
                            <Badge className="mt-2">User Anime List</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-chart-4">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">Frontend API</CardTitle>
                                <Code className="w-4 h-4 text-chart-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Port 3000 (Next.js) - Proxy</p>
                            <Badge className="mt-2">Catalog & Routing</Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* API Documentation Tabs */}
                <Tabs defaultValue="auth" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="auth">Auth Service</TabsTrigger>
                        <TabsTrigger value="anime">Anime Service</TabsTrigger>
                        <TabsTrigger value="frontend">Frontend API</TabsTrigger>
                    </TabsList>

                    {/* AUTH SERVICE */}
                    <TabsContent value="auth" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default">POST</Badge>
                                    <CardTitle className="text-lg">/auth/login</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Authentification utilisateur</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:8000/auth/login
                                    </code>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Request Body</h4>
                                    <pre className="bg-muted p-4 rounded overflow-x-auto">
{`{
  "username": "admin",
  "password": "admin"
}`}
                                    </pre>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Response (200 OK)</h4>
                                    <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default">POST</Badge>
                                    <CardTitle className="text-lg">/auth/register</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Créer un nouveau compte</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:8000/auth/register
                                    </code>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Request Body</h4>
                                    <pre className="bg-muted p-4 rounded overflow-x-auto">
{`{
  "username": "newuser",
  "password": "securepassword"
}`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">GET</Badge>
                                    <CardTitle className="text-lg">/.well-known/jwks.json</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Récupérer les clés publiques JWT</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:8000/.well-known/jwks.json
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ANIME SERVICE */}
                    <TabsContent value="anime" className="space-y-4 mt-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-500">
                                        Authentification requise
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Toutes les routes nécessitent un token JWT valide dans le header Authorization
                                    </p>
                                    <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                                        Authorization: Bearer {"{"}access_token{"}"}
                                    </code>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default">POST</Badge>
                                    <CardTitle className="text-lg">/animes</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Ajouter ou mettre à jour un anime dans la liste
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:5000/animes
                                    </code>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Headers</h4>
                                    <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`Authorization: Bearer eyJhbGc...
Content-Type: application/json`}
                                    </pre>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Request Body</h4>
                                    <pre className="bg-muted p-4 rounded overflow-x-auto">
{`{
  "malId": 1,
  "title": "Cowboy Bebop",
  "image": "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
  "url": "https://myanimelist.net/anime/1/Cowboy_Bebop",
  "synopsis": "In the year 2071...",
  "score": 8.75,
  "status": "à regarder"
}`}
                                    </pre>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Champs obligatoires</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge variant="secondary">malId</Badge>
                                        <Badge variant="secondary">title</Badge>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Champs optionnels</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge variant="outline">image</Badge>
                                        <Badge variant="outline">url</Badge>
                                        <Badge variant="outline">synopsis</Badge>
                                        <Badge variant="outline">score</Badge>
                                        <Badge variant="outline">status</Badge>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Valeurs status possibles</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        <code className="bg-muted px-2 py-1 rounded text-sm">à regarder</code>
                                        <code className="bg-muted px-2 py-1 rounded text-sm">en cours</code>
                                        <code className="bg-muted px-2 py-1 rounded text-sm">terminé</code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">GET</Badge>
                                    <CardTitle className="text-lg">/animes</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Récupérer tous les animes de l&apos;utilisateur
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:5000/animes
                                    </code>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Query Parameters (optionnel)</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <code className="bg-muted px-2 py-1 rounded text-sm">?status=à regarder</code>
                                            <p className="text-sm text-muted-foreground mt-1">Filtrer par statut</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Exemples</h4>
                                    <div className="space-y-2">
                                        <code className="bg-muted px-3 py-1 rounded text-sm block">
                                            GET http://localhost:5000/animes
                                        </code>
                                        <code className="bg-muted px-3 py-1 rounded text-sm block">
                                            GET http://localhost:5000/animes?status=en cours
                                        </code>
                                        <code className="bg-muted px-3 py-1 rounded text-sm block">
                                            GET http://localhost:5000/animes?status=terminé
                                        </code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">GET</Badge>
                                    <CardTitle className="text-lg">/animes/:id</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Récupérer un anime spécifique</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:5000/animes/1
                                    </code>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-600">PATCH</Badge>
                                    <CardTitle className="text-lg">/animes/:id/status</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Mettre à jour le statut d&apos;un anime</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:5000/animes/1/status
                                    </code>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Request Body</h4>
                                    <pre className="bg-muted p-4 rounded overflow-x-auto">
{`{
  "status": "terminé"
}`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="destructive">DELETE</Badge>
                                    <CardTitle className="text-lg">/animes/:id</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Supprimer un anime de la liste</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:5000/animes/1
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* FRONTEND API */}
                    <TabsContent value="frontend" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">GET</Badge>
                                    <CardTitle className="text-lg">/api/catalog</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Rechercher des animes dans la base Jikan (MAL)
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:3000/api/catalog
                                    </code>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Query Parameters</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <code className="bg-muted px-2 py-1 rounded text-sm">page</code>
                                            <span className="text-sm text-muted-foreground ml-2">(défaut: 1)</span>
                                        </div>
                                        <div>
                                            <code className="bg-muted px-2 py-1 rounded text-sm">limit</code>
                                            <span className="text-sm text-muted-foreground ml-2">(défaut: 24)</span>
                                        </div>
                                        <div>
                                            <code className="bg-muted px-2 py-1 rounded text-sm">q</code>
                                            <span className="text-sm text-muted-foreground ml-2">(recherche textuelle)</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Exemples</h4>
                                    <div className="space-y-2">
                                        <code className="bg-muted px-3 py-1 rounded text-sm block">
                                            GET /api/catalog?page=1&limit=24
                                        </code>
                                        <code className="bg-muted px-3 py-1 rounded text-sm block">
                                            GET /api/catalog?q=naruto&page=1&limit=10
                                        </code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">GET</Badge>
                                    <CardTitle className="text-lg">/api/catalog/:id</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Détails d&apos;un anime par MAL ID</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:3000/api/catalog/1
                                    </code>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default">POST</Badge>
                                    <CardTitle className="text-lg">/api/auth-login</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Login via le frontend (proxy vers auth-service)
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">URL</h4>
                                    <code className="bg-muted px-3 py-1 rounded text-sm">
                                        http://localhost:3000/api/auth-login
                                    </code>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Request Body</h4>
                                    <pre className="bg-muted p-4 rounded overflow-x-auto">
{`{
  "username": "admin",
  "password": "admin"
}`}
                                    </pre>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                                    <p className="text-sm">
                                        <CheckCircle2 className="w-4 h-4 inline mr-1" />
                                        Les tokens sont automatiquement stockés dans les cookies HTTP-only
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quick Reference */}
                <Card className="border-primary/50">
                    <CardHeader>
                        <CardTitle>Référence rapide</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Ports des services</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Auth Service</span>
                                        <code className="bg-muted px-2 py-0.5 rounded">:8000</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Anime Service</span>
                                        <code className="bg-muted px-2 py-0.5 rounded">:5000</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Frontend</span>
                                        <code className="bg-muted px-2 py-0.5 rounded">:3000</code>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Status HTTP</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Succès</span>
                                        <Badge variant="outline">200 OK</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Créé</span>
                                        <Badge variant="outline">201 Created</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Non autorisé</span>
                                        <Badge variant="destructive">401 Unauthorized</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Erreur serveur</span>
                                        <Badge variant="destructive">500 Error</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
