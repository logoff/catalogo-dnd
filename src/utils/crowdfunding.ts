import type { CrowdfundingPlatform, RpgCrowdfunding } from '@/types/rpg'
import { formatDate } from './formatters'

export const platformNames: Record<CrowdfundingPlatform, string> = {
  verkami: 'Verkami',
  kickstarter: 'Kickstarter',
  gamefound: 'Gamefound',
  backerkit: 'BackerKit',
  lanzanos: 'Lánzanos',
  ulule: 'Ulule',
}

// Abierta si cierra hoy o después. «Hoy» es el día del build (virtual:build-date), para que el
// HTML prerenderizado y el primer render coincidan
export function campaignOpen(campaign: RpgCrowdfunding, today: string): boolean {
  return campaign.end >= today
}

// «En campaña en Verkami hasta el 27 dic 2026» o «Financiado en Verkami»
export function campaignLabel(campaign: RpgCrowdfunding, today: string): string {
  const platform = platformNames[campaign.platform]
  return campaignOpen(campaign, today)
    ? `En campaña en ${platform} hasta el ${formatDate(campaign.end)}`
    : `Financiado en ${platform}`
}
