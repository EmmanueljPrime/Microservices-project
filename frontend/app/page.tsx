// frontend/app/page.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function LoginPage() {
    const [username, setU] = useState('')
    const [password, setP] = useState('')
    const [loading, setL] = useState(false)
    const [err, setErr] = useState('')

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setL(true)
        setErr('')

        const res = await fetch('/api/auth-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        setL(false)
        if (res.ok) {
            window.location.href = '/dashboard'
        } else {
            const j = await res.json().catch(() => ({ detail: 'Erreur' }))
            setErr(j.detail || 'Échec de connexion')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md rounded-2xl shadow-sm border bg-card">
                <CardContent className="p-8">
                    <h1 className="text-2xl font-semibold text-center mb-6 text-foreground">
                        Connexion
                    </h1>

                    <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Nom d’utilisateur
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setU(e.target.value)}
                                placeholder="john.doe"
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border rounded-lg bg-transparent border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setP(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border rounded-lg bg-transparent border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {err && <p className="text-sm text-destructive">{err}</p>}

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
