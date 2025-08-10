import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FieldValues } from 'react-hook-form'

const useZodForm = (
  schema: z.ZodTypeAny,
  mutation?: (data: Record<string, unknown>) => void,
  defaultValues?: Record<string, unknown>
) => {
  const {
    handleSubmit,
    register,
    watch,
    reset,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: 'onChange',
  })

  const onFormSubmit = mutation
    ? handleSubmit(async (values: FieldValues) => {
        mutation(values)
      })
    : undefined

  return {
    register,
    watch,
    reset,
    isValid,
    errors,
    control,
    setValue,
    handleSubmit,
    ...(onFormSubmit && { onFormSubmit }),
  }
}

export default useZodForm
