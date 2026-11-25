import SearchField from '@/components/ui/SearchField'
import { useSiteSearchInput } from '@/hooks/useSiteSearchInput'

// Buscador global de la cabecera y de la portada: lleva a /buscar con los resultados de todas
// las secciones
export default function SearchBar({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const { value, onChange, onClear, onSubmit } = useSiteSearchInput()

  return (
    <form role="search" onSubmit={onSubmit}>
      <SearchField
        label="Buscar en el catálogo"
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder="Buscar en el catálogo…"
        size={size}
      />
    </form>
  )
}
