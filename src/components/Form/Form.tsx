import { ComponentProps } from "react"

export type FormProps = ComponentProps<'form'>

export function Form({...props}: FormProps) {
  return (
    <form
      {...props}
    />
  )
}