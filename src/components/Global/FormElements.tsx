import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ErrorMessage } from '@hookform/error-message'
import { useState } from 'react'
type Props = {
  type?: 'text' | 'email' | 'password' | 'number'
  inputType: 'select' | 'input' | 'textarea'
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  name: string
  lines?: number
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  className?: string
  readonly?: boolean
}

const FormElements: React.FC<Props> = ({
  type,
  inputType,
  label,
  placeholder,
  name,
  register,
  errors,
  className = '', // Default to empty string
  readonly = false, // Default to false
}: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  switch (inputType) {
    case 'input':
      return (
        <div className="w-full">
          {label && (
            <Label
              htmlFor={`input-${name}`}
              className="block font-medium mb-2 mt-1 text-[#cccccc] text-sm"
            >
              {label} <span className="text-red-500">*</span>
            </Label>
          )}
          <Input
            id={`input-${name}`}
            type={type}
            placeholder={placeholder}
            {...register(name)}
            readOnly={readonly}
            className={`lg:text-[15px] text-[14px] dark:border-gray-[#444444] rounded-none w-full lg:h-12 h-11 mb-2 focus:border-black focus:border-[1.8px] focus:outline-none ${className} ${
              errors[name]
                ? 'border-red-500 text-red-500'
                : isFocused
                ? 'border-[#635BFF]'
                : 'border-gray-400'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mb-2.5  text-sm">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </div>
      )
    default:
      return null
  }
}

export default FormElements
