import { useCallback, useState } from 'react'

export function useFavorites(initialIds?: string[]) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    () => new Set(initialIds ?? [])
  )

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  )

  return { favoriteIds, toggleFavorite, isFavorite }
}

