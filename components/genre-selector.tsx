"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GenreSelectorProps {
  selectedGenres: string[]
  availableGenres: string[]
  onChange: (genres: string[]) => void
}

export default function GenreSelector({ selectedGenres, availableGenres, onChange }: GenreSelectorProps) {
  const [newGenre, setNewGenre] = useState("")
  const [showAddGenre, setShowAddGenre] = useState(false)

  const handleAddGenre = () => {
    if (newGenre.trim() && !availableGenres.includes(newGenre.trim())) {
      const updatedGenres = [...selectedGenres, newGenre.trim()]
      onChange(updatedGenres)
      setNewGenre("")
      setShowAddGenre(false)
    }
  }

  const handleSelectGenre = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      const updatedGenres = [...selectedGenres, genre]
      onChange(updatedGenres)
    }
  }

  const handleRemoveGenre = (genre: string) => {
    const updatedGenres = selectedGenres.filter((g) => g !== genre)
    onChange(updatedGenres)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedGenres.map((genre) => (
          <Badge key={genre} className="bg-lavender-500 hover:bg-lavender-600 flex items-center gap-1 px-3 py-1">
            {genre}
            <button
              type="button"
              onClick={() => handleRemoveGenre(genre)}
              className="ml-1 rounded-full hover:bg-lavender-700 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {!showAddGenre ? (
        <div className="flex flex-wrap gap-2">
          {availableGenres
            .filter((genre) => !selectedGenres.includes(genre))
            .map((genre) => (
              <Badge
                key={genre}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
                onClick={() => handleSelectGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddGenre(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Neues Genre
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Neues Genre eingeben..."
            className="bg-white dark:bg-lavender-800"
          />
          <Button type="button" onClick={handleAddGenre} className="bg-lavender-500 hover:bg-lavender-600">
            Hinzufügen
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowAddGenre(false)}>
            Abbrechen
          </Button>
        </div>
      )}
    </div>
  )
}
