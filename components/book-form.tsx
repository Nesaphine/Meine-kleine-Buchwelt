"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import GenreSelector from "./genre-selector"
import type { Book } from "@/lib/types"

interface BookFormProps {
  book?: Book
  onSubmit: (book: Omit<Book, "id" | "category">) => void
  onCancel: () => void
  category: string
  availableGenres: string[]
}

export default function BookForm({ book, onSubmit, onCancel, category, availableGenres }: BookFormProps) {
  const [name, setName] = useState(book?.name || "")
  const [author, setAuthor] = useState(book?.author || "")
  const [price, setPrice] = useState(book?.price || 0)
  const [genres, setGenres] = useState<string[]>(book?.genre || [])
  const [imageUrl, setImageUrl] = useState(book?.imageUrl || "")
  const [releaseDate, setReleaseDate] = useState(
    book?.releaseDate ? new Date(book.releaseDate).toISOString().split("T")[0] : "",
  )
  const [shopLink, setShopLink] = useState(book?.shopLink || "")
  const [rating, setRating] = useState(book?.rating || 0)
  const [notes, setNotes] = useState(book?.notes || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      author,
      price,
      genre: genres,
      imageUrl,
      releaseDate: releaseDate ? new Date(releaseDate).toISOString() : undefined,
      shopLink: category === "wunschliste" ? shopLink : undefined,
      isRead: book?.isRead || false,
      isBought: book?.isBought || false,
      rating: rating,
      notes: notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white dark:bg-lavender-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Autor *</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="bg-white dark:bg-lavender-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preis (€) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
            required
            className="bg-white dark:bg-lavender-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Bild URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/book-cover.jpg"
            className="bg-white dark:bg-lavender-800"
          />
        </div>

        {(category === "vorbestellungen" || category === "wunschliste") && (
          <div className="space-y-2">
            <Label htmlFor="releaseDate">Erscheinungsdatum *</Label>
            <Input
              id="releaseDate"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
              className="bg-white dark:bg-lavender-800"
            />
          </div>
        )}

        {category === "wunschliste" && (
          <div className="space-y-2">
            <Label htmlFor="shopLink">Link zum Shop</Label>
            <Input
              id="shopLink"
              value={shopLink}
              onChange={(e) => setShopLink(e.target.value)}
              placeholder="https://example.com/book"
              className="bg-white dark:bg-lavender-800"
            />
          </div>
        )}

        {category === "bibliothek" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="rating">Bewertung (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(Number.parseFloat(e.target.value))}
                className="bg-white dark:bg-lavender-800"
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-2 col-span-full">
        <Label>Genres *</Label>
        <GenreSelector selectedGenres={genres} availableGenres={availableGenres} onChange={setGenres} />
      </div>

      {category === "bibliothek" && (
        <div className="space-y-2">
          <Label htmlFor="notes">Notizen</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Deine Gedanken zum Buch..."
            className="bg-white dark:bg-lavender-800"
            rows={4}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-mint-100 hover:bg-mint-200 dark:bg-lavender-800"
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          className="bg-lavender-500 hover:bg-lavender-600 dark:bg-lavender-700 dark:hover:bg-lavender-600"
        >
          Speichern
        </Button>
      </div>
    </form>
  )
}
