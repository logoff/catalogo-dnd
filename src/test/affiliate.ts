import { expect } from 'vitest'

// Todo botón de compra tiene que estar dentro de una zona con el aviso de afiliado
// (PurchaseLinks), para que el aviso quede cerca del enlace
export function expectAffiliateNotices() {
  const buttons = document.querySelectorAll('a[data-umami-event="comprar"]')
  expect(buttons.length).toBeGreaterThan(0)
  for (const button of buttons) {
    const area = button.closest('[data-purchase-links]')
    expect(area, button.textContent ?? '').not.toBeNull()
    expect(area!.querySelector('[data-affiliate-notice]')).toHaveTextContent(
      /enlaces de compra son de afiliado/
    )
  }
}
