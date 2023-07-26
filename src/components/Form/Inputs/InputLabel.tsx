import { ElementType, LabelHTMLAttributes } from 'react'

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  Icon?: ElementType
  text?: string
  error?: boolean
}

export function InputLabel({ text, error, Icon, ...rest }: InputLabelProps) {
  return (
    <label
      className="
      w-11 flex justify-center px-2 py-2 items-center
      text-zinc-400 text-1xl data-[error=true]:text-red-500
      "
      {...rest}
    >
      {Icon ? (
        <Icon />
      ) : text ? (
        <p>{text}</p>
      ) : null}
    </label>
  )
}