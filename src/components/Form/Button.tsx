import { ComponentProps } from "react"
import { tv, VariantProps } from "tailwind-variants"

const button = tv({
  base: 'rounded bg-white disabled:bg-zinc-900 py-1.5 text-sm font-medium text-zinc-500',
  variants: {
    size: {
      default: 'h-10 px-4',
      full: 'w-full py-2',
      sm: 'h-8 px-3',
      xs: 'h-6 px-2 text-xs',
    },
    
  },
  defaultVariants: {
    size: 'default'
  }
})

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>

export function Button({size, className, ...props}: ButtonProps ) {
  return (
    <button
      {...props}
      className={button({size, className})}
    >
      {props.children}
    </button>
  )
}