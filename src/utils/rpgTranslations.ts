import type { DerivationKind, License, LicenseKind, RpgBookKind, RpgFormat } from '@/types/rpg'

export const licenseKindNames: Record<LicenseKind, string> = {
  license: 'Licencia',
  reference_document: 'Documento de referencia',
  community_license: 'Licencia comunitaria',
}

export const derivationKindNames: Record<DerivationKind, string> = {
  revision: 'Revisión con cambios menores',
  compatible: 'Reescrito, pero compatible',
  major_rewrite: 'Cambio mayor de reglas',
  inspiration: 'Inspiración',
}

export const bookKindNames: Record<RpgBookKind, string> = {
  core: 'Libro básico',
  starter: 'Caja de inicio',
  supplement: 'Suplemento',
  adventure: 'Aventura',
  setting: 'Ambientación',
  other: 'Otro',
}

// Títulos de los grupos de libros de una edición anterior de D&D, en el orden en que se muestran
export const bookKindGroups: [RpgBookKind, string][] = [
  ['core', 'Libros básicos'],
  ['starter', 'Cajas de inicio'],
  ['supplement', 'Suplementos'],
  ['setting', 'Ambientaciones'],
  ['adventure', 'Aventuras'],
  ['other', 'Otros'],
]

export const rpgFormatNames: Record<RpgFormat, string> = {
  hardcover: 'Tapa dura',
  paperback: 'Tapa blanda',
  boxed_set: 'Caja',
  pdf: 'PDF',
}

// Nombre corto de una licencia para etiquetas y filtros
export function licenseLabel(license: Pick<License, 'name' | 'short_name'>): string {
  return license.short_name ?? license.name
}
