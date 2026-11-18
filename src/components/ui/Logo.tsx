import clsx from 'clsx'

// El D20 de public/images/logo.svg con los colores del tema
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="var(--c-accent)"
      strokeWidth="4"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      className={clsx('shrink-0', className)}
    >
      <path d="M50 5 89 27.5V72.5L50 95 11 72.5V27.5Z" fill="var(--c-well)" />
      <path d="M50 30 73 68H27Z" fill="var(--c-line)" />
      <path d="M50 5V30M89 27.5 50 30M89 27.5 73 68M89 72.5 73 68M50 95 73 68M50 95 27 68M11 72.5 27 68M11 27.5 27 68M11 27.5 50 30" />
    </svg>
  )
}
