"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        try {
            // Test si l'API répond avec la requête
            const res = await fetch(`/api/explorer?q=${encodeURIComponent(query)}`)
            if (!res.ok) throw new Error(`Erreur ${res.status}`)

            // Redirection vers explore avec la recherche
            router.push(`/explore?q=${encodeURIComponent(query)}`)
            setQuery("")
        } catch (err) {
            console.error("Erreur de recherche:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-xs mx-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Chercher un anime..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                    disabled={loading}
                />
            </div>
            <Button type="submit" disabled={loading || !query.trim()} className="h-9 px-3 cursor-pointer" size="sm">
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                {!loading && "Go"}
            </Button>
        </form>
    )
}
