"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const { theme, setTheme } = useTheme()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (!mounted) return null

    return (
        <nav
            className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
                isScrolled ? "bg-background/95 backdrop-blur-sm border-border/50 py-2" : "bg-background border-border py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            ✧
                        </div>
                        <span className="font-bold text-lg hidden sm:inline">Shurikn</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Dashboard
                        </a>
                        <a href="/explorer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Explorer
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Stats
                        </a>
                    </div>

                    {/* Right side - Theme toggle + Mobile menu */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="w-9 h-9"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-9 h-9"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-2">
                        <a
                            href="/dashboard"
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/explorer"
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                            Explorer
                        </a>
                        <a
                            href="#"
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                            Stats
                        </a>
                    </div>
                )}
            </div>
        </nav>
    )
}
