"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Book } from "@/lib/types"

interface StatisticsProps {
  books: Book[]
}

export default function Statistics({ books }: StatisticsProps) {
  // Count books in library
  const libraryCount = books.filter((book) => book.category === "bibliothek").length

  // Count read books
  const readCount = books.filter((book) => book.category === "bibliothek" && book.isRead).length

  // Count unread books
  const unreadCount = libraryCount - readCount

  // Count pre-orders
  const preOrderCount = books.filter((book) => book.category === "vorbestellungen").length

  // Count wishlist
  const wishlistCount = books.filter((book) => book.category === "wunschliste").length

  // Calculate total spent on library
  const librarySpent = books
    .filter((book) => book.category === "bibliothek")
    .reduce((total, book) => total + book.price, 0)

  // Calculate total spent on pre-orders
  const preOrderSpent = books
    .filter((book) => book.category === "vorbestellungen")
    .reduce((total, book) => total + book.price, 0)

  // Calculate total spent
  const totalSpent = librarySpent + preOrderSpent

  // Get genres distribution
  const genreDistribution = books.reduce((acc: Record<string, number>, book) => {
    if (!acc[book.genre]) {
      acc[book.genre] = 0
    }
    acc[book.genre]++
    return acc
  }, {})

  // Sort genres by count
  const sortedGenres = Object.entries(genreDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Get authors distribution
  const authorDistribution = books.reduce((acc: Record<string, number>, book) => {
    if (!acc[book.author]) {
      acc[book.author] = 0
    }
    acc[book.author]++
    return acc
  }, {})

  // Sort authors by count
  const sortedAuthors = Object.entries(authorDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + " €"
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistiken</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Bibliothek</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Anzahl Bücher:</span>
                <span className="font-bold">{libraryCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Gelesene Bücher:</span>
                <span className="font-bold">{readCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Ungelesene Bücher:</span>
                <span className="font-bold">{unreadCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Ausgaben:</span>
                <span className="font-bold">{formatCurrency(librarySpent)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Vorbestellungen</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Anzahl Vorbestellungen:</span>
                <span className="font-bold">{preOrderCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Ausgaben:</span>
                <span className="font-bold">{formatCurrency(preOrderSpent)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Wunschliste</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Anzahl Wünsche:</span>
                <span className="font-bold">{wishlistCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Gesamtausgaben</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Gesamt:</span>
                <span className="font-bold">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Durchschnitt pro Buch:</span>
                <span className="font-bold">{formatCurrency(totalSpent / (libraryCount + preOrderCount || 1))}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Top Genres</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedGenres.map(([genre, count]) => (
                <div key={genre} className="flex justify-between">
                  <span>{genre}:</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
              {sortedGenres.length === 0 && <p className="text-gray-500">Keine Genres gefunden</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Top Autoren</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedAuthors.map(([author, count]) => (
                <div key={author} className="flex justify-between">
                  <span>{author}:</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
              {sortedAuthors.length === 0 && <p className="text-gray-500">Keine Autoren gefunden</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Progress */}
      {libraryCount > 0 && (
        <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Lesefortschritt</h3>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-lavender-500 h-4 rounded-full"
                style={{
                  width: `${libraryCount ? (readCount / libraryCount) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>
                {readCount} von {libraryCount} gelesen
              </span>
              <span>{libraryCount ? Math.round((readCount / libraryCount) * 100) : 0}%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
