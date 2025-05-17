"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Book } from "@/lib/types"

interface CalendarProps {
  books: Book[]
}

export default function Calendar({ books }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Filter books with release dates in the future
  const upcomingBooks = books.filter((book) => {
    if (!book.releaseDate) return false
    const releaseDate = new Date(book.releaseDate)
    return releaseDate > new Date()
  })

  // Sort by release date
  const sortedBooks = [...upcomingBooks].sort((a, b) => {
    const dateA = new Date(a.releaseDate || "")
    const dateB = new Date(b.releaseDate || "")
    return dateA.getTime() - dateB.getTime()
  })

  // Group by month and year
  const groupedBooks: Record<string, Book[]> = {}

  sortedBooks.forEach((book) => {
    if (!book.releaseDate) return

    const date = new Date(book.releaseDate)
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`

    if (!groupedBooks[monthYear]) {
      groupedBooks[monthYear] = []
    }

    groupedBooks[monthYear].push(book)
  })

  // Navigate to previous month
  const prevMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() - 1)
    setCurrentMonth(date)
  }

  // Navigate to next month
  const nextMonth = () => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() + 1)
    setCurrentMonth(date)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE")
  }

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Erscheinungskalender</h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="px-3 py-1 rounded-md bg-lavender-100 hover:bg-lavender-200 dark:bg-lavender-800 dark:hover:bg-lavender-700"
          >
            ←
          </button>
          <span className="font-medium">{getMonthName(currentMonth)}</span>
          <button
            onClick={nextMonth}
            className="px-3 py-1 rounded-md bg-lavender-100 hover:bg-lavender-200 dark:bg-lavender-800 dark:hover:bg-lavender-700"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Wunschliste</h3>
          {sortedBooks
            .filter((book) => book.category === "wunschliste")
            .map((book) => (
              <Card
                key={book.id}
                className="mb-4 bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{book.name}</h4>
                    <span className="text-sm text-lavender-600 dark:text-lavender-400">
                      {formatDate(book.releaseDate || "")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <span>{book.price.toFixed(2)} €</span>
                    <span className="text-sm bg-lavender-100 dark:bg-lavender-800 px-2 py-1 rounded">{book.genre}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          {sortedBooks.filter((book) => book.category === "wunschliste").length === 0 && (
            <p className="text-gray-500 text-center py-4">Keine bevorstehenden Bücher in der Wunschliste</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Vorbestellungen</h3>
          {sortedBooks
            .filter((book) => book.category === "vorbestellungen")
            .map((book) => (
              <Card
                key={book.id}
                className="mb-4 bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{book.name}</h4>
                    <span className="text-sm text-lavender-600 dark:text-lavender-400">
                      {formatDate(book.releaseDate || "")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <span>{book.price.toFixed(2)} €</span>
                    <span className="text-sm bg-lavender-100 dark:bg-lavender-800 px-2 py-1 rounded">{book.genre}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          {sortedBooks.filter((book) => book.category === "vorbestellungen").length === 0 && (
            <p className="text-gray-500 text-center py-4">Keine bevorstehenden Vorbestellungen</p>
          )}
        </div>
      </div>
    </div>
  )
}
