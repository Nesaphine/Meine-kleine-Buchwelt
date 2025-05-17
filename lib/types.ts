export interface Book {
  id: string
  name: string
  author: string
  price: number
  genre: string
  imageUrl?: string
  releaseDate?: string
  shopLink?: string
  isRead: boolean
  isBought: boolean
  rating: number
  notes: string
  category: string // "bibliothek" | "vorbestellungen" | "wunschliste"
}
