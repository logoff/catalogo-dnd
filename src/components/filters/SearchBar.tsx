import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useProductStore } from '@/store/productStore'
import { useDebounce } from '@/hooks/useDebounce'

export default function SearchBar() {
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
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Buscar..."
        className="input-dnd pl-10 pr-10 py-2 text-sm"
      />
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
