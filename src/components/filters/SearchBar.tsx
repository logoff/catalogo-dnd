import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '@/store/productStore'
import { useDebounce } from '@/hooks/useDebounce'
import SearchField from '@/components/ui/SearchField'

export default function SearchBar({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery } = useProductStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const debouncedQuery = useDebounce(localQuery, 300)
  const prevQuery = useRef(debouncedQuery)

  useEffect(() => {
    if (debouncedQuery === prevQuery.current) return
    prevQuery.current = debouncedQuery

    setSearchQuery(debouncedQuery)
    if (debouncedQuery && !window.location.pathname.endsWith('/catalogo')) {
      navigate(`/catalogo?q=${encodeURIComponent(debouncedQuery)}`)
    }
  }, [debouncedQuery, setSearchQuery, navigate])

  const handleClear = () => {
    setLocalQuery('')
    setSearchQuery('')
  }

  return (
    <SearchField
      label="Buscar libros"
      value={localQuery}
      onChange={(e) => setLocalQuery(e.target.value)}
      onClear={handleClear}
      placeholder="Buscar libros…"
      size={size}
    />
  )
}
