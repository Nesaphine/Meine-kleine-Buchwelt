export interface Book {
  id: string
  name: string
  author: string
  price: number
  genre: string[] // Geändert von string zu string[]
  imageUrl?: string
  releaseDate?: string
  shopLink?: string
  isRead: boolean
  isBought: boolean
  isArrived?: boolean // Neue Eigenschaft
  rating: number
  notes: string
  category: string // "bibliothek" | "vorbestellungen" | "wunschliste"
}
