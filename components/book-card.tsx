"use client"

import { useState } from "react"
import { Edit, Trash2, ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Book } from "@/lib/types"
import BookForm from "./book-form"

interface BookCardProps {
  book: Book
  onDelete: (id: string) => void
  onUpdate: (book: Book) => void
  onMarkAsRead: (id: string, isRead: boolean) => void
  onMarkAsBought: (id: string, isBought: boolean) => void
  onMarkAsArrived: (id: string, isArrived: boolean) => void
  availableGenres: string[]
}

export default function BookCard({
  book,
  onDelete,
  onUpdate,
  onMarkAsRead,
  onMarkAsBought,
  onMarkAsArrived,
  availableGenres,
}: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = (updatedBookData: Omit<Book, "id" | "category">) => {
    onUpdate({
      ...book,
      ...updatedBookData,
    })
    setIsEditing(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unbekannt"
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE")
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (isEditing) {
    return (
      <Card className="bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
        <CardHeader>
          <h3 className="text-xl font-bold">Buch bearbeiten</h3>
        </CardHeader>
        <CardContent>
          <BookForm
            book={book}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            category={book.category}
            availableGenres={availableGenres}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700 hover:shadow-md transition-shadow">
      <div className="relative pt-[60%] bg-gray-100 dark:bg-gray-800">
        {book.imageUrl ? (
          <img
            src={book.imageUrl || "/placeholder.svg"}
            alt={book.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
            Kein Bild verfügbar
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg line-clamp-2">{book.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1 mb-2">
            {Array.isArray(book.genre) ? (
              book.genre.map((genre) => (
                <Badge key={genre} className="bg-lavender-500 hover:bg-lavender-600">
                  {genre}
                </Badge>
              ))
            ) : (
              <Badge className="bg-lavender-500 hover:bg-lavender-600">{book.genre}</Badge>
            )}
          </div>

          <p className="font-medium">{book.price.toFixed(2)} €</p>

          {book.releaseDate && (
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Erscheint am: </span>
              {formatDate(book.releaseDate)}
            </p>
          )}

          {book.category === "bibliothek" && book.isRead && book.rating > 0 && (
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Bewertung: </span>
              <div className="flex">{renderStars(book.rating)}</div>
            </div>
          )}

          {book.category === "bibliothek" && book.isRead && book.notes && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Notizen:</p>
              <p className="text-sm mt-1 line-clamp-3">{book.notes}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-2">
        {book.category === "bibliothek" && (
          <div className="flex items-center space-x-2 w-full">
            <Checkbox
              id={`read-${book.id}`}
              checked={book.isRead}
              onCheckedChange={(checked) => onMarkAsRead(book.id, checked as boolean)}
              className="data-[state=checked]:bg-lavender-500 data-[state=checked]:border-lavender-500"
            />
            <Label htmlFor={`read-${book.id}`} className="text-sm">
              Gelesen?
            </Label>
          </div>
        )}

        {book.category === "vorbestellungen" && (
          <div className="flex items-center space-x-2 w-full">
            <Checkbox
              id={`arrived-${book.id}`}
              checked={book.isArrived}
              onCheckedChange={(checked) => onMarkAsArrived(book.id, checked as boolean)}
              className="data-[state=checked]:bg-lavender-500 data-[state=checked]:border-lavender-500"
            />
            <Label htmlFor={`arrived-${book.id}`} className="text-sm">
              Angekommen?
            </Label>
          </div>
        )}

        {book.category === "wunschliste" && (
          <div className="flex items-center space-x-2 w-full">
            <Checkbox
              id={`bought-${book.id}`}
              checked={book.isBought}
              onCheckedChange={(checked) => onMarkAsBought(book.id, checked as boolean)}
              className="data-[state=checked]:bg-lavender-500 data-[state=checked]:border-lavender-500"
            />
            <Label htmlFor={`bought-${book.id}`} className="text-sm">
              Gekauft?
            </Label>
          </div>
        )}

        {book.category === "wunschliste" && book.shopLink && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 bg-mint-100 hover:bg-mint-200 dark:bg-lavender-800"
            onClick={() => window.open(book.shopLink, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Zum Shop
          </Button>
        )}

        <div className="flex justify-between w-full mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="bg-mint-100 hover:bg-mint-200 dark:bg-lavender-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Bearbeiten
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(book.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
