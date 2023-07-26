'use client'
import { useAuthContext } from "@/contexts/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, Mail } from 'lucide-react'
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../Form/Button"
import { Form } from "../Form/Form"
import { Input } from "../Form/Inputs"

const signInFormSchema = z.object({
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha precisa de no minimo 6 caracteres'),
})

type SignInFormData = z.infer<typeof signInFormSchema>


export const SignIn = () => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
  })

  const { signIn, isLoading } = useAuthContext()

  const handleSignIn = (data: any) => {
    signIn(data)
  }

  return (
    <div
      className="
        min-w-full flex flex-col justify-center items-center h-full
      "
    >
      <div
        className="
          w-96 min-h-[400px]
          px-4 py-4
          bg-zinc-950 rounded border-[1px] border-zinc-900
        "
      >
       
        <Form
          onSubmit={handleSubmit(handleSignIn)}
          className="
            h-full
            flex flex-col gap-4 justify-center items-center
          "
        >
          <Input.Root error={errors.email?.message}>
            <Input.Label
              htmlFor="email"
              Icon={Mail}
              data-error={errors.email?.message ? true : false}
            />
            <Input.Input
              control={control}
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="off"
              {...register('email')}
            />
          </Input.Root>

          <Input.Root error={errors.password?.message}>
            <Input.Label
              data-error={errors.email?.message ? true : false}
              htmlFor="password"
              Icon={Lock}
            />
            <Input.Input
              control={control}
              id="password"
              type="password"
              placeholder="Digita sua senha"
              autoComplete="off"
              {...register('password')}
            />
          </Input.Root>

          <Button
            type="submit"
            size="full"
          >
            Sign In
          </Button>
        </Form>

      </div>
    </div>
  )
}