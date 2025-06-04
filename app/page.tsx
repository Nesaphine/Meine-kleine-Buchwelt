"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Moon, Sun, Download, Upload, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import BookForm from "@/components/book-form"
import BookCard from "@/components/book-card"
import Calendar from "@/components/calendar"
import Statistics from "@/components/statistics"
import type { Book } from "@/lib/types"
import { useTheme } from "next-themes"

// Standardgenres
const DEFAULT_GENRES = [
  "Romance",
  "Fantasy",
  "Thriller",
  "Science Fiction",
  "Krimi",
  "Sachbuch",
  "Biografie",
  "Historisch",
  "Young Adult",
  "Kinderbuch",
  "Dark Romance",
  "Romantasy",
]

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentTab, setCurrentTab] = useState("bibliothek")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterGenre, setFilterGenre] = useState("")
  const [filterAuthor, setFilterAuthor] = useState("")
  const [availableGenres, setAvailableGenres] = useState<string[]>(DEFAULT_GENRES)
  const { theme, setTheme } = useTheme()

  // Load books and genres from localStorage on initial render
  useEffect(() => {
    const savedBooks = localStorage.getItem("books")
    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks)

        // Konvertiere alte Bücher mit einzelnem Genre zu Array
        const updatedBooks = parsedBooks.map((book: any) => ({
          ...book,
          genre: Array.isArray(book.genre) ? book.genre : [book.genre],
        }))

        setBooks(updatedBooks)

        // Sammle alle Genres aus den Büchern
        const genresFromBooks = updatedBooks.flatMap((book: Book) => book.genre)
        const uniqueGenres = [...new Set([...DEFAULT_GENRES, ...genresFromBooks])]
        setAvailableGenres(uniqueGenres)
      } catch (error) {
        console.error("Fehler beim Laden der Bücher:", error)
      }
    }

    const savedGenres = localStorage.getItem("genres")
    if (savedGenres) {
      try {
        const parsedGenres = JSON.parse(savedGenres)
        setAvailableGenres([...DEFAULT_GENRES, ...parsedGenres])
      } catch (error) {
        console.error("Fehler beim Laden der Genres:", error)
      }
    }
  }, [])

  // Save books and genres to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))

    // Speichere alle benutzerdefinierten Genres
    const customGenres = availableGenres.filter((genre) => !DEFAULT_GENRES.includes(genre))
    if (customGenres.length > 0) {
      localStorage.setItem("genres", JSON.stringify(customGenres))
    }
  }, [books, availableGenres])

  const addBook = (book: Omit<Book, "id" | "category">) => {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      category: currentTab,
    }

    setBooks([...books, newBook as Book])

    // Aktualisiere die verfügbaren Genres
    const newGenres = book.genre.filter((genre) => !availableGenres.includes(genre))
    if (newGenres.length > 0) {
      setAvailableGenres([...availableGenres, ...newGenres])
    }

    setShowAddForm(false)
  }

  const deleteBook = (id: string) => {
    setBooks(books.filter((book) => book.id !== id))
  }

  const updateBook = (updatedBook: Book) => {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))

    // Aktualisiere die verfügbaren Genres
    const newGenres = updatedBook.genre.filter((genre) => !availableGenres.includes(genre))
    if (newGenres.length > 0) {
      setAvailableGenres([...availableGenres, ...newGenres])
    }
  }

  const markAsRead = (id: string, isRead: boolean) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, isRead } : book)))
  }

  const markAsBought = (id: string, isBought: boolean) => {
    const bookToUpdate = books.find((book) => book.id === id)
    if (!bookToUpdate) return

    // Remove from wishlist
    const filteredBooks = books.filter((book) => book.id !== id)

    if (isBought) {
      // Add to library or pre-orders based on release date
      const now = new Date()
      const releaseDate = bookToUpdate.releaseDate ? new Date(bookToUpdate.releaseDate) : null

      const updatedBook = {
        ...bookToUpdate,
        isBought,
        category: releaseDate && releaseDate > now ? "vorbestellungen" : "bibliothek",
      }

      setBooks([...filteredBooks, updatedBook])
    }
  }

  // Neue Funktion für "Angekommen?" Checkbox
  const markAsArrived = (id: string, isArrived: boolean) => {
    if (!isArrived) return // Nur handeln, wenn die Checkbox aktiviert wird

    const bookToUpdate = books.find((book) => book.id === id)
    if (!bookToUpdate) return

    // Entferne das Buch aus den Vorbestellungen
    const filteredBooks = books.filter((book) => book.id !== id)

    // Füge das Buch zur Bibliothek hinzu
    const updatedBook = {
      ...bookToUpdate,
      isArrived,
      category: "bibliothek", // Ändere die Kategorie zu "bibliothek"
    }

    setBooks([...filteredBooks, updatedBook])
  }

  const exportData = () => {
    const dataToExport = {
      books,
      genres: availableGenres.filter((genre) => !DEFAULT_GENRES.includes(genre)),
    }

    const dataStr = JSON.stringify(dataToExport)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = "meine-buchwelt-export.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0], "UTF-8")
      fileReader.onload = (e) => {
        if (e.target?.result) {
          try {
            const importedData = JSON.parse(e.target.result as string)

            if (importedData.books) {
              // Konvertiere alte Bücher mit einzelnem Genre zu Array
              const updatedBooks = importedData.books.map((book: any) => ({
                ...book,
                genre: Array.isArray(book.genre) ? book.genre : [book.genre],
              }))

              setBooks(updatedBooks)
            }

            if (importedData.genres) {
              setAvailableGenres([...DEFAULT_GENRES, ...importedData.genres])
            }
          } catch (error) {
            console.error("Fehler beim Importieren der Daten:", error)
            alert("Die Datei enthält ungültige Daten.")
          }
        }
      }
    }
  }

  // Filter and sort books based on current tab and filters
  const filteredBooks = books
    .filter((book) => book.category === currentTab)
    .filter((book) => {
      if (searchTerm) {
        return (
          book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      return true
    })
    .filter((book) => {
      if (filterGenre) {
        // Prüfe, ob das Buch das ausgewählte Genre enthält
        return book.genre.includes(filterGenre)
      }
      return true
    })
    .filter((book) => {
      if (filterAuthor) {
        return book.author.toLowerCase().includes(filterAuthor.toLowerCase())
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "author") {
        return sortOrder === "asc" ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author)
      } else if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      }
      return 0
    })

  // Get unique genres and authors for filters
  const allGenres = [...new Set(books.flatMap((book) => book.genre))]
  const authors = [...new Set(books.map((book) => book.author))]

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <main className="container mx-auto p-4 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center text-lavender-600 dark:text-lavender-400">
            Meine kleine Buchwelt
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="bg-mint-100 hover:bg-mint-200 dark:bg-lavender-800"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              onClick={exportData}
              className="bg-mint-100 hover:bg-mint-200 dark:bg-lavender-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-file")?.click()}
              className="bg-mint-100 hover:bg-mint-200 dark:bg-lavender-800"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importieren
            </Button>
            <input id="import-file" type="file" accept=".json" onChange={importData} className="hidden" />
          </div>
        </div>

        <Tabs
          defaultValue="bibliothek"
          onValueChange={(value) => {
            setCurrentTab(value)
            setShowAddForm(false)
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 mb-4 bg-lavender-100 dark:bg-lavender-900">
            <TabsTrigger
              value="bibliothek"
              className="data-[state=active]:bg-lavender-300 dark:data-[state=active]:bg-lavender-700"
            >
              Bibliothek
            </TabsTrigger>
            <TabsTrigger
              value="vorbestellungen"
              className="data-[state=active]:bg-lavender-300 dark:data-[state=active]:bg-lavender-700"
            >
              Vorbestellungen
            </TabsTrigger>
            <TabsTrigger
              value="wunschliste"
              className="data-[state=active]:bg-lavender-300 dark:data-[state=active]:bg-lavender-700"
            >
              Wunschliste
            </TabsTrigger>
            <TabsTrigger
              value="kalender"
              className="data-[state=active]:bg-lavender-300 dark:data-[state=active]:bg-lavender-700"
            >
              Kalender
            </TabsTrigger>
            <TabsTrigger
              value="statistiken"
              className="data-[state=active]:bg-lavender-300 dark:data-[state=active]:bg-lavender-700"
            >
              Statistiken
            </TabsTrigger>
          </TabsList>

          {/* Book Tabs Content */}
          {["bibliothek", "vorbestellungen", "wunschliste"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {/* Controls */}
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-lavender-500 hover:bg-lavender-600 dark:bg-lavender-700 dark:hover:bg-lavender-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Buch hinzufügen
                  </Button>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-[200px] bg-mint-50 dark:bg-lavender-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="px-3 py-2 rounded-md border bg-mint-50 dark:bg-lavender-800"
                  >
                    <option value="">Alle Genres</option>
                    {allGenres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterAuthor}
                    onChange={(e) => setFilterAuthor(e.target.value)}
                    className="px-3 py-2 rounded-md border bg-mint-50 dark:bg-lavender-800"
                  >
                    <option value="">Alle Autoren</option>
                    {authors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-md border bg-mint-50 dark:bg-lavender-800"
                  >
                    <option value="name">Nach Name</option>
                    <option value="author">Nach Autor</option>
                    <option value="price">Nach Preis</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-2 rounded-md border bg-mint-50 dark:bg-lavender-800"
                  >
                    <option value="asc">Aufsteigend</option>
                    <option value="desc">Absteigend</option>
                  </select>
                </div>
              </div>

              {/* Add Book Form */}
              {showAddForm && (
                <Card className="mb-6 bg-mint-50 dark:bg-lavender-900 border-lavender-200 dark:border-lavender-700">
                  <CardHeader>
                    <h3 className="text-xl font-bold">Neues Buch hinzufügen</h3>
                  </CardHeader>
                  <CardContent>
                    <BookForm
                      onSubmit={addBook}
                      onCancel={() => setShowAddForm(false)}
                      category={tab}
                      availableGenres={availableGenres}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Book Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onDelete={deleteBook}
                    onUpdate={updateBook}
                    onMarkAsRead={markAsRead}
                    onMarkAsBought={markAsBought}
                    onMarkAsArrived={markAsArrived}
                    availableGenres={availableGenres}
                  />
                ))}
                {filteredBooks.length === 0 && !showAddForm && (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    Keine Bücher gefunden. Füge ein neues Buch hinzu!
                  </div>
                )}
              </div>
            </TabsContent>
          ))}

          {/* Calendar Tab */}
          <TabsContent value="kalender">
            <Calendar books={books} />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistiken">
            <Statistics books={books} />
          </TabsContent>
        </Tabs>
      </main>
    </ThemeProvider>
  )
}
