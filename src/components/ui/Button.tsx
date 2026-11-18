import { Link, type LinkProps } from 'react-router-dom'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './styles'

interface StyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />
}

export function ButtonLink({ variant, size, className, ...props }: StyleProps & LinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />
}

export function ButtonAnchor({
  variant,
  size,
  className,
  ...props
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={buttonClass(variant, size, className)} {...props} />
}
